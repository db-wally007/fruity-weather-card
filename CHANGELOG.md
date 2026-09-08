# Changelog

## [Unreleased]

### Added

- **Chance of precipitation in the daily list.** Each row shows the day's peak probability under its
  condition glyph. Nothing is printed below 20%: the figure comes from an ensemble that emits a few
  percent on days forecast bone dry, and a column of 3%/8%/16% says nothing. The caption costs no
  row height — the row already had 26px of slack around a 24px glyph.
- **Precipitation curve in the day card**, behind a thermometer/droplet toggle at the right of the
  header. Temperature is the default on every open, and the choice sticks while the card stays open
  so stepping through the week keeps showing the same series. Switching uses the same push
  animation as changing day. The curve shares the temperature chart's geometry, dashed
  elapsed-hours treatment and scrub readout — only the colour and the scale change.
- The probability scale is fixed at 0-100% and never rescaled to the day's own range. A dry day
  would otherwise be stretched until a 3% wobble looked like weather.
- `pyscript/fruity_weather.py` now also caches the ten-day hourly forecast for the home point, so
  every device in the house draws the same numbers from one fetch and the card keeps working where
  the browser cannot reach the internet. The card falls back to calling the API itself when the
  file is missing, so installs without pyscript are unaffected.

### Fixed

- A cold start could fetch the hourly forecast twice — Home Assistant can tear the card down and
  rebuild it mid-flight, and the on-disk cache is only written once a fetch finishes. Requests are
  now deduplicated while in flight, which also covers the card appearing on two dashboards.

## [2.0.0] - 2026-09-08

### Added

- **Day detail card.** Tap any row of the daily list and an hourly card opens beside it — three
  columns wide, the same height as the list, with the tiles flowing underneath. A notch on its left
  edge points at the day being shown, and prev/next arrows step through the days. Tap the same row
  again to close. Deliberately a grid card, not an overlay: nothing is hidden behind it and its
  position never moves.
- Ten-day hourly source (`src/hourly-source.ts`). Home Assistant's weather entity only carries as
  much hourly data as its integration publishes — met.no stops at 48 entries — which would have
  left seven of the ten rows with nothing to show. One Open-Meteo request covers all ten days.
- Scrubbing the curve: drag across it for that hour's time, temperature and
  condition; the day's high/low step aside while a finger is down and return on release.
- Hovering the curve reads out as well as dragging, so it works with a mouse.
- **Elapsed time on today's curve.** Hours that have already happened are drawn as history —
  dashed, colourless curve under a drained fill, with their condition glyphs, hour labels and any
  high/low marker dimmed to match, and a hairline at the current moment. The split is the real clock
  position rather than the nearest hour, interpolated between the two hours either side, so it
  creeps through the day instead of jumping hourly and the two halves meet without a seam. Only the
  row for today has a past; every other day draws live throughout.

- Motion throughout: the tiles FLIP into their new places when the day card opens or closes, the
  card springs out of the daily list rather than appearing, and the notch travels between days
  instead of jumping. All on one overshooting ease, and all suppressed under `prefers-reduced-motion`.
- The day card's header is packed to the left — previous, date, next — leaving the rest of the row
  free for further controls. The date sits centred in a fixed-width box, so the next button never
  shifts as the date changes length and the gaps either side of the date stay even.
- The temperature scale carries **at most four labels**, always whole numbers. A fixed 5° step gave
  a warm day six of them, which crowded the axis for no extra information. Only the labels are
  thinned — the bounds still round tight to the day's own range, so the curve goes on filling the
  plot.
- **Changing day pushes rather than cuts.** From the arrows or from another row of the daily list,
  the day being left accelerates out and fades while the new one settles in from the opposite side,
  so the direction of travel says which way through the week you went. The buttons stay put; only
  the content moves.

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
