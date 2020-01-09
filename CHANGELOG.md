# Changelog

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

[2.0.5]: (https://github.com/ooni/explorer/compare/v2.0.4...v2.0.5)
[2.0.4]: (https://github.com/ooni/explorer/compare/v2.0.3...v2.0.4)
[2.0.3]: (https://github.com/ooni/explorer/compare/v2.0.2...v2.0.3)
[2.0.2]: (https://github.com/ooni/explorer/compare/v2.0.1...v2.0.2)
[2.0.1]: (https://github.com/ooni/explorer/compare/v2.0.0...v2.0.1)
[2.0.0]: (https://github.com/ooni/explorer/releases/tag/v2.0.0)
