# Changelog

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

[2.0.8]: (https://github.com/ooni/explorer/compare/v2.0.7...v2.0.8)
[2.0.7]: (https://github.com/ooni/explorer/compare/v2.0.6...v2.0.7)
[2.0.6]: (https://github.com/ooni/explorer/compare/v2.0.5...v2.0.6)
[2.0.5]: (https://github.com/ooni/explorer/compare/v2.0.4...v2.0.5)
[2.0.4]: (https://github.com/ooni/explorer/compare/v2.0.3...v2.0.4)
[2.0.3]: (https://github.com/ooni/explorer/compare/v2.0.2...v2.0.3)
[2.0.2]: (https://github.com/ooni/explorer/compare/v2.0.1...v2.0.2)
[2.0.1]: (https://github.com/ooni/explorer/compare/v2.0.0...v2.0.1)
[2.0.0]: (https://github.com/ooni/explorer/releases/tag/v2.0.0)
