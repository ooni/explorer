# OONI Explorer

For the live website see: https://explorer.ooni.org.

## Setup

We assume you have a working node.js development environment with yarn installed.

Then do:

```
yarn install
```

## Usage

To run the dev server do:

```
yarn run dev
```

To build the app:

```
yarn run build
```

To start the production server run:

```
yarn run start
```

We also provide a `Dockerfile` for easy deployment.

## Testing

End-to-end tests use [Playwright](https://playwright.dev/) and live in `tests/e2e/`. They cover both functional behavior and visual regressions (screenshot comparisons).

### Running tests locally

```
yarn test
```

On a local machine (macOS) this runs all **functional** assertions but **skips screenshot comparisons** (`ignoreSnapshots` in `playwright.config.ts`). This is intentional: screenshot baselines are generated on Linux CI against a production build, and macOS renders fonts and antialiasing differently, so comparing them locally would always produce false failures.

Locally the tests run against `next dev`; on CI they run against a production build (`yarn build:test` + `next start`), which is faster, more stable, and doesn't include Next.js development UI in screenshots.

### API mocking

Tests don't hit the live OONI API. Requests are intercepted and served from JSON fixtures in `tests/e2e/fixtures/` (see `tests/e2e/helpers/mockApi.ts`). This keeps tests deterministic — live data changes as measurements are reprocessed, which would make screenshots drift.

If a test needs a fixture that doesn't exist, it fails with a "Missing fixture" error. To record missing fixtures from the live API:

```
UPDATE_FIXTURES=1 yarn playwright test tests/e2e/<spec> --project=chromium --workers=1
```

Existing fixtures are reused, only missing ones are fetched. To re-record a namespace from scratch, delete its directory under `tests/e2e/fixtures/` first. Commit the resulting JSON files.

High-cardinality query params can be excluded from fixture matching with the `ignoreParams` option of `mockApi` (e.g. thematic pages fire one aggregation request per domain — ignoring `domain` lets them all share a single fixture per test).

The homepage coverage chart is mocked via `tests/e2e/fixtures/home/` (`global_overview_by_month.json`). Banner totals are loaded in `getStaticProps` on the server, so they are masked in the homepage screenshot test instead of fixture-driven.

### Updating screenshot baselines

Screenshot baselines (`tests/e2e/*-snapshots/*.png`) are **never created locally**. They are generated on CI so that they exactly match the environment where they are compared (Ubuntu, Chromium, production build). This allows a strict diff tolerance (`maxDiffPixels: 100`) instead of a loose percentage that could hide real regressions.

When you intentionally change the UI:

1. Push your branch.
2. On GitHub go to **Actions → Update Playwright snapshots → Run workflow** and select your branch.
   (The workflow is defined in `.github/workflows/update-snapshots.yml`)
3. The job regenerates all Chromium baselines and commits them back to your branch as `github-actions[bot]`.
4. `git pull` to get the updated PNGs locally.

The regular `Playwright Tests` workflow then compares every PR against these committed baselines. Firefox and WebKit (run on pushes to main) execute functional assertions only — baselines exist just for Chromium.
