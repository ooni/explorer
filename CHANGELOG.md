# Changelog

## [2.6.1] - 2021-05-20

### Added

- Enable anomaly search for Signal tests (#592)
- Link to github repo in footer (#592)

### Fixed

- Fixed broken feedback dialog (#592)


## [2.6.0] - 2021-05-17

### Added

- Enable anomaly search for whatsapp tests (#589)
- Show anomaly type in search results (#586)
- Move all environment variable definitions to .env.{production,development} files (#587)

### Changed

- Upgrade `next` to `v10.2.0`
- Automatically reformatted this file with `prettier` integration in VSCode :shrugs:

## [2.5.3] - 2021-04-27

### Added

- Show anomaly status in search results for middlebox tests

### Fixed

- Alignment of the floating feedback button (#583)

### Changed

- Control which tests can be filtered with anomaly and confirmed status

## [2.5.2] - 2021-04-22

### Added

- Summary text on RiseupVPN measurement pages

### Fixed

- Fix bug when selecting 'Any' in test name filter

## [2.5.1] - 2021-04-15

### Changed

- Group test names in search page sidebar into test groups
- Upgraded `next`, `ooni-components`, `react-icons` to latest versions.
- Upstream changes to component names of some icons from `react-icons`

## [2.5.0] - 2021-04-15

### Added

- Support for Signal tests (#575)

## [2.4.4] - 2021-03-18

### Changed

- Show the ok_count as the difference of confirmed and anomalies

### Fixed

- Fix temporarily API bug showing same anomaly and confirmed count
- Add experimental icon to MAT page

### Removed

- Remove accuracy disclaimer on whatsapp pages added in ca9526643b5fecb34c2794ea574bc83f7f4714d6
- Remove unused dependencies

## [2.1.1] - 2020-10-27

### Changed

- Date filters in search will default to a 30 day range unless manually changed.
  This is to align with the new default in the `/api/v1/measurements` API. (#512)

### Fixed

- Fix DNS Queries box by handling AAAA answer types correctly (#505)

## [2.1.0] - 2020-10-15

### Changed

- **Uses the new refactored API**. Incompatible with 2.0.x because the endpoints to fetch measurement data has changed. (#486)

### Fixed

- Fix link colors to use `blue7` from the theme (#473)
- Address warnings about using `next/link` for external links (#484)
- Ensure that measurment pages don't crash when missing test keys (#491)

### Added

- Responsive header and nav menu in countries page (#454)
- Links to test descriptions on measurement pages (#469)
- Social media sharing buttons on measurement and country pages. This was done by our awesome [GSoC 2020 student](https://medium.com/@kronaemmanuel/anxious-to-excitement-my-gsoc-story-begins-c83041900f35) @kronaemmanuel (#476)
- Dev tool to toggle parts of `test_keys` in measurement data (#491)

### Removed

- Remove tested since date on country pages (#483)

### Security

- Bump elliptic from 6.4.1 to 6.5.3 (#477)
- Bump markdown-to-jsx from 6.9.4 to 6.11.4 (#485)

## [2.0.10] - 2020-10-07

### Fixed

- Address the OONI Probe ASN Incident reported [here](https://ooni.org/post/2020-ooni-probe-asn-incident-report/) by making it harder to lookup and access measurements with AS0 (#495)

## [2.0.9] - 2020-05-09

### Fixed

- Country page meta tag now correctly shows the measurement count for the
  country

### Changed

- Search filter test case uses test name filter to test search function
  instead of domain name filter. Avoids timeouts when API is slow.

### Security

- Pinned version for `kind-of` to `^6.0.3` as per github security advisory

## [2.0.8] - 2020-05-07

### Added

- Support for ndt7 measurements (#456)
- Meta tags for country pages (#430)
- End-to-end tests with Cypress (#417)

### Fixed

- Missing overview charts in country page (#459)
- Country codes in URL for country pages are not case sensitive anymore (#449)
- Raw measurement data content overflow in smaller screens (#429)
- Handle cases where `test_keys.tcp_connect` is missing (#412)
- Handle cases where `test_keys.requests` is missing (#412)

### Changed

- `nextjs` dependecy upgraded to 9.3.2 (#448)
- Upgrade base docker image to `node:12` as required by `next@9.x.x`
- Use `blue9` color from theme for footer background (#411)
- Updated copy

### Removed

- Dropped usage of locale-data from `react-intl`; deprecated (in v3)

### Security

- Pinned version for `https-proxy-agent` to `^2.2.3` as per github security advisory

## [2.0.7] - 2020-02-24

### Added

- Circumvention test group containing the new psiphon and tor tests (#372, #393)
- Use `scores` key from `fastpath` to show endpoint status for WhatsApp test (#405)
- Added disclaimer for older measurements (ca95266)

### Fixed

- Fixed alignment of search result rows for dns_consistency tests (#387)
- Fixed bug in selecting the correct date range in search (#397)
- Made usage of blocking reason test_key more robust (#401)
- Fixed spin loader crash by upgrading it to styled-components v4 (#408)
- Fix for bug in search results with `#` in `input` field (#409)

### Changed

- Changed ooni.io links to ooni.org (#372)
- Upgraded styled-components to v4 (#398)
- Use `country-util` package instead of API call to fetch countries list (#394)
- Switch back to using `anomaly` flag from API instead of determining from test_keys(#404)

## [2.0.6] - 2020-01-24

### Fixed

- Fixed bug in rendering measurements with misaligned anomaly flag (#374)
- Fixed error message copy for search page failures (#370)

## [2.0.5] - 2020-01-09

### Added

- Added regex to allow search by IP address in the domain field (#367)
- Added matomo based analytics (#369)

### Fixed

- Fixed bug where duplicate API requests were made for search queries (#353)
- Fixed bug in rendering DNS queries on WebConnectivity measurement pages (#363)
- Fixed 'until today' logic in search to include today's measurement (#364)

## [2.0.4] - 2019-11-27

### Added

- Added this changelog
- Added 'UTC' label to measurement timestamps (#328)
- Added explorer version in footer (#329)
- Added link to fastpath event detector feed (#342)

### Changed

- Refactored all file names exporting components to PascalCase format (#336)
- Multiple dependency upgrades via dependabot

### Fixed

- Use the correct icon for Vanilla Tor section on country page (#327)
- Replace deprecated `fuschia` color with `fuchsia` (#337)
- Fix minor bug by removing unused code (#340)

## [2.0.3] - 2019-09-25

### Changed

- Improve error reporting for failed searches

### Fixed

- Fixed bug in manual entry of date fields in search (#313)

### Removed

- Removed `BETA` from feedback modal title

## [2.0.2] - 2019-09-12

### Removed

- Dropped card for Malaysia under LGBTQI block hightlights

## [2.0.1] - 2019-09-12

### Added

- Added description to measurement coverage graph
-

### Changed

- Update link to Malaysian event in highlights
- Fix the canonical explorer link
- Fix spacing and padding

### Removed

- Remove unused code, images, references to globe/atlas/map
- Stop serving from `/data` directory. This was used temporarily during development

## [2.0.0] - 2019-09-12

### Added

- First public release ([Blog post](https://ooni.org/post/next-generation-ooni-explorer/))

[2.1.1]: https://github.com/ooni/explorer/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/ooni/explorer/compare/v2.0.10...v2.1.0
[2.0.10]: https://github.com/ooni/explorer/compare/v2.0.9...v2.0.10
[2.0.9]: https://github.com/ooni/explorer/compare/v2.0.8...v2.0.9
[2.0.8]: https://github.com/ooni/explorer/compare/v2.0.7...v2.0.8
[2.0.7]: https://github.com/ooni/explorer/compare/v2.0.6...v2.0.7
[2.0.6]: https://github.com/ooni/explorer/compare/v2.0.5...v2.0.6
[2.0.5]: https://github.com/ooni/explorer/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/ooni/explorer/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/ooni/explorer/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/ooni/explorer/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/ooni/explorer/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/ooni/explorer/releases/tag/v2.0.0
