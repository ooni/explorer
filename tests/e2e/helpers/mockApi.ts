import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type { APIResponse, Page } from '@playwright/test'

/**
 * Lightweight record/replay mocking for the OONI API used in e2e tests.
 *
 * - By default (offline), requests matching `urlPattern` are served from saved
 *   JSON fixtures in `tests/e2e/fixtures/<namespace>/`. No network is touched.
 * - With `UPDATE_FIXTURES=1`, a missing fixture is fetched from the live API
 *   once and written to disk (2xx/3xx/4xx only — 429/5xx are never cached so a
 *   rate-limited response can't poison the fixtures). On 429 the request is
 *   retried a few times with backoff; if the quota is still exhausted it throws
 *   a clear message instead of silently saving nothing.
 * - A missing fixture without `UPDATE_FIXTURES` throws, so CI can never silently
 *   fall back to the live (rate-limited) API.
 *
 * CORS headers are always injected on replay because api.ooni.org does not send
 * them for the localhost test origin.
 */

const FIXTURES_ROOT = path.join(__dirname, '..', 'fixtures')
const UPDATE = !!process.env.UPDATE_FIXTURES

const MOCK_API_HOSTS = new Set([
  new URL(process.env.NEXT_PUBLIC_OONI_API ?? 'https://api.ooni.org').host,
  'api.ooni.io',
])

const RATE_LIMIT_RETRIES = 3
const RATE_LIMIT_BACKOFF_MS = [2000, 5000, 10000]

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-credentials': 'true',
}

const preflightHeaders = {
  ...corsHeaders,
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'Content-Type, Authorization',
  'access-control-max-age': '86400',
}

type SavedResponse = {
  status: number
  contentType: string
  body: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** API responses sometimes link to api.ooni.io; the app uses api.ooni.org in tests. */
function normalizeFixtureBody(body: string): string {
  return body.replaceAll('https://api.ooni.io', 'https://api.ooni.org')
}

/** Normalize query encoding so browser and SSR requests resolve the same fixture. */
function canonicalFixtureUrl(urlString: string): string {
  const url = new URL(urlString)
  const canonical = new URL(`${url.origin}${url.pathname}`)
  for (const [key, value] of url.searchParams.entries()) {
    canonical.searchParams.append(key, value)
  }
  return canonical.toString()
}

/**
 * Build a human-readable, filesystem-safe fixture filename from a request, e.g.
 *   GET /api/v1/measurement_meta?measurement_uid=20221110..._telegram_...&full=true
 *   -> measurement_meta__measurement_uid-20221110..._telegram_..._full-true.json
 * A short hash suffix is added only when the name is truncated, to keep
 * uniqueness without sacrificing readability for the common case.
 */
function fixtureFileName(method: string, urlString: string): string {
  const url = new URL(canonicalFixtureUrl(urlString))
  const lastSegment = url.pathname.split('/').filter(Boolean).pop() || 'root'
  const params = [...url.searchParams.entries()]
    .map(([key, value]) => `${key}-${value}`)
    .join('_')

  let base = params ? `${lastSegment}__${params}` : lastSegment
  if (method !== 'GET') base = `${method.toLowerCase()}_${base}`

  let name = base.replace(/[^a-zA-Z0-9._-]/g, '-')

  const MAX = 120
  if (name.length > MAX) {
    const hash = crypto
      .createHash('sha1')
      .update(`${method} ${url.pathname}${url.search}`)
      .digest('hex')
      .slice(0, 8)
    name = `${name.slice(0, MAX)}_${hash}`
  }

  return `${name}.json`
}

function fixturePath(namespace: string, method: string, urlString: string): string {
  return path.join(FIXTURES_ROOT, namespace, fixtureFileName(method, urlString))
}

function shouldMockRequest(urlString: string): boolean {
  try {
    return MOCK_API_HOSTS.has(new URL(urlString).host)
  } catch {
    return false
  }
}

/** Fetch from the live API, retrying past transient 429 rate limits. */
async function fetchWithRateLimitRetry(
  route: Parameters<Parameters<Page['route']>[1]>[0],
): Promise<APIResponse> {
  let response = await route.fetch()
  for (
    let attempt = 0;
    response.status() === 429 && attempt < RATE_LIMIT_RETRIES;
    attempt++
  ) {
    await sleep(RATE_LIMIT_BACKOFF_MS[attempt] ?? 10000)
    response = await route.fetch()
  }
  return response
}

/**
 * Intercept `urlPattern` on `page` and serve fixtures from `namespace`.
 */
export async function mockApi(
  page: Page,
  urlPattern: string,
  namespace: string,
): Promise<void> {
  await page.route(urlPattern, async (route) => {
    const request = route.request()

    if (!shouldMockRequest(request.url())) {
      await route.continue()
      return
    }

    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 200, headers: preflightHeaders })
      return
    }

    const file = fixturePath(namespace, request.method(), request.url())

    if (fs.existsSync(file)) {
      const saved: SavedResponse = JSON.parse(fs.readFileSync(file, 'utf-8'))
      await route.fulfill({
        status: saved.status,
        headers: { 'content-type': saved.contentType, ...corsHeaders },
        body: normalizeFixtureBody(saved.body),
      })
      return
    }

    if (!UPDATE) {
      throw new Error(
        `Missing fixture for ${request.method()} ${request.url()}\n` +
          `Record it by re-running with UPDATE_FIXTURES=1.\nExpected file: ${file}`,
      )
    }

    const response = await fetchWithRateLimitRetry(route)
    const body = await response.body()
    const status = response.status()
    const contentType = response.headers()['content-type'] ?? 'application/json'

    if (status === 429) {
      throw new Error(
        `API quota exceeded (429) while recording ${request.url()}.\n` +
          'Wait for the rate limit to reset, then re-run with UPDATE_FIXTURES=1. ' +
          'Fixtures already saved are reused, so recording resumes where it left off.',
      )
    }

    // Never persist server errors — re-run to capture a good response.
    if (status < 500) {
      fs.mkdirSync(path.dirname(file), { recursive: true })
      const saved: SavedResponse = {
        status,
        contentType,
        body: body.toString('utf-8'),
      }
      fs.writeFileSync(file, JSON.stringify(saved, null, 2))
    }

    await route.fulfill({
      status,
      headers: { 'content-type': contentType, ...corsHeaders },
      body,
    })
  })
}
