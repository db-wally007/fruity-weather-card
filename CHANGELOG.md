# Changelog

## [0.2.0] - 2026-09-06

### Added

- **Day detail sheet.** Tap any row of the daily list for that day's hourly temperature curve,
  condition glyphs and its own high/low, with a day picker and prev/next navigation.
- Ten-day hourly source (`src/hourly-source.ts`). Home Assistant's weather entity only carries as
  much hourly data as its integration publishes — met.no stops at 48 entries — which would have
  left seven of the ten rows with nothing to show. One Open-Meteo request covers all ten days.

### Changed

- **The precipitation map starts animating when expanded.** Expanding it is the request to see it
  move; requiring a second tap on a play button hid what the tile was for. Manual pause and resume
  are unchanged, and the platform's reduced-motion preference still suppresses it.

## [0.1.0] - 2026-09-06

First public release.

### Added

- Scene hero with 26 condition backgrounds and separate night variants.
- 24-hour strip with sunrise and sunset threaded in as their own cells.
- Multi-day forecast with temperature-coloured range bars.
- Detail tiles: sun arc, wind rose, precipitation, feels-like, humidity — each able to read a real
  sensor instead of the forecast, and each independently tappable.
- Forecast precipitation map over an Esri basemap, with an optional pyscript cache that spends the
  Open-Meteo budget once per household rather than once per browser.
- `backgrounds_path`, so the scene artwork can live wherever an install puts it.

### Notes

- Condition glyphs are not bundled; supply a set through `icons_path`. See the README.
- Backgrounds are derived from Thyraz/weather-forecast-extended (MIT) — see NOTICE.
