# Changelog

## [3.0.3] - 2026-09-09

### Fixed

- **Night hours on later days were drawn with daytime artwork.** The card picks a sun or a moon
  glyph per hour, but it only knew tonight's sunset and tomorrow's sunrise — `sun.sun` publishes
  nothing further — so from tomorrow evening onward it assumed daylight. Midnight and 3am on a day
  four out showed a sun in the sky. It now reads each day's own sunrise and sunset from the
  Open-Meteo daily block, which the card was already requesting for the precipitation figures: the
  same call, no extra cost, exact values for all ten days. `sun.sun` remains the fallback for days
  the forecast does not cover.

## [3.0.2] - 2026-09-09

### Added

- **Tapping the hourly strip opens today's detail card.** The strip and that card cover the same
  hours, so it is the obvious place to go for more of what you are already looking at, and it
  matches tapping the first row of the daily list. `tap_actions.hourly` still overrides it, and
  `action: none` disables it.

### Changed

- The day card's condition glyphs sit further off the plot — the gap went from 2px to 11px. A curve
  reaching the top of its band used to very nearly touch the glyph above it, most visible on a 100%
  chance of precipitation.

### Fixed

- **Switching between the temperature and precipitation charts no longer animates the date.** The
  date was inside the element being pushed, so a series toggle slid it out and back in — claiming
  the day had changed when only the chart had. A day change still moves the whole header, because
  there the date is what changed.
- Tapping the strip while the day card was open closed and immediately reopened it, playing two
  animations for one tap. The window-level dismiss handler now excludes the strip, as it already
  did the daily list, so the tap toggles cleanly.

## [3.0.1] - 2026-09-08

### Added

- **Chance of precipitation in the hourly strip**, under each glyph. The row is reserved in every
  cell, empty where there is nothing to say, so the temperatures stay on one baseline whether or not
  an hour carries a figure — that shared baseline is what makes the strip scannable.
- Cells are wider and the vertical rhythm is set as fractions of the glyph rather than in pixels, so
  the proportions hold at any tile size. The chance sits flush under the glyph with the breathing
  room below it: grouped that way it reads as an annotation of the glyph rather than a third
  unrelated row.

### Fixed

- **A glyph and a chance that contradicted each other in the same cell.** Two separate causes, both
  visible as rain drawn above a blank while cells with no rain carried a figure:
  - The strip's glyph came from the weather entity while the chance came from Open-Meteo. Measured:
    met.no called 04:00 `rainy` with 0.5mm, Open-Meteo's ensemble gave that hour 5% and put the
    chance at 05:00-06:00 instead. The glyph now comes from the same forecast as the chance.
  - That exposed a second layer within one provider. A condition code is a single deterministic
    run; a probability is an ensemble of perturbed ones, and they disagree — one fetch gave
    `cloudy` at 35% alongside `rainy` at 18%. A figure is now printed whenever the glyph depicts
    precipitation, however small, as well as whenever the number is worth reading on its own. The
    same rule applies to the daily list.

## [3.0.0] - 2026-09-08

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
