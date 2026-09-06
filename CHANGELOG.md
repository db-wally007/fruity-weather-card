# Changelog

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
