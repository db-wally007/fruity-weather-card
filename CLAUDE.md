# CLAUDE.md — working notes for AI agents

Guidance for Claude Code (or any AI agent) continuing work on this card. It records the
architecture and the **non-obvious decisions and dead ends**, so a later session does not
rediscover them the hard way.

## What this is

`fruity-weather-card` — an iOS-style Home Assistant weather card: scene hero, 24-hour strip, daily
list, detail tiles, and a forecast precipitation map. Lit 3 + TypeScript, Vite into a single ESM
file. Nothing is drawn by a third-party library.

**Do not name the fruit-branded phone company anywhere in this project** — not in identifiers, CSS
custom properties, comments or docs, however tempting given the visual reference. Use `system-ui`
for the font stack and the `--fwc-*` prefix for variables. "iOS-style" is the accepted description.

## Layout

```
src/card.ts          the card: config, forecast subscriptions, hero, hourly strip, daily list,
                     tiles, sun arc, wind rose, all styles. Large and deliberately one file.
src/precip-map.ts    the precipitation map tile: grid fetch/cache, heat field, Esri tiles, zoom.
src/hourly-source.ts ten-day hourly temps + WMO codes from Open-Meteo, for the day-detail sheet.
pyscript/fruity_weather.py   OPTIONAL shared cache for the map's Open-Meteo grid.
backgrounds/         26 hero scenes + 26 launcher scenes, derived from Thyraz (MIT, see NOTICE).
homeassistant/       the optional helper package and a launcher-button example.
dist/                the built bundle — COMMITTED on purpose (HACS installs it directly).
```

## Things that will bite you

### NEVER put a backtick in a comment inside the `css` template

The styles are one enormous tagged template literal. A backtick anywhere inside it — including in a
`/* … */` comment — **terminates the literal**, and the error surfaces hundreds of lines away as
`TS1005: ';' expected` or an esbuild failure pointing at whatever rule happens to follow.

This has broken the build **four times**, every time while writing an explanatory comment and
reaching for backticks to quote a property or value out of habit. Write `overflow: hidden` or
"the non-scaling-stroke vector-effect" as plain words. The same applies to the `html` templates.

If a build suddenly fails with a syntax error in a stylesheet you did not touch, this is the first
thing to check:

```bash
awk '/static styles = css`/,/^  `;/' src/card.ts | grep -n '`'
```

### Icons are runtime files with no fallback

`_iconUrl()` resolves `new URL('../icons/<name>.png', import.meta.url)`. Vite **cannot** inline
that — the name is dynamic — so the glyphs are separate HTTP fetches relative to `dist/`, not data
URIs. An earlier comment in the source claimed otherwise; it was wrong.

The set is **not in this repository**: the one used during development arrived without a licence.
If you add one, it must be licence-clean, and `NOTICE` must say where it came from.

### Backgrounds live outside the card directory

`HERO_BASE = '/local/weather-bg'`, because the same artwork dresses a dashboard launcher button as
well as the card, and duplicating 2 MB of JPEGs to serve two callers is silly. `backgrounds_path`
overrides it for installs that put the set elsewhere. `backgrounds/` in this repo is the source of
truth for both sizes.

### `precip-grid.json` is generated and carries the home coordinates

`lat0`/`lon0` come from `hass.config.latitude/longitude`. It is gitignored. Never commit it, and
never paste its contents anywhere public.

### The day detail is a GRID CARD, not an overlay

It was a floating sheet first, and every version of that fought the layout: it
hid the tiles behind it, its top had to be clamped and re-measured, and a
backdrop covering the card swallowed clicks meant for the daily rows. It is now
a normal grid item spanning three columns and two rows beside the daily list, so
the tiles simply flow after it. The card never moves; only the notch does.

Consequences to preserve: it must be rendered INSIDE `.grid` (rendered after it
and it becomes a full-width block below), its height matches the daily panel's
pinned `tile*2 + gap`, and the notch's fill reads the same `--sheet-bg` the card
paints with so the two cannot drift to different darks.

**Its grid position is EXPLICIT (`grid-column: 3 / span 3; grid-row: 1 / span 2`)
and must stay that way.** Auto-placed under dense auto-flow, the browser first
resolved this 3x2 item into the bottom row and only settled it beside the daily
list on a later pass — so every open showed the card and the tiles swapping
places and swapping back. That was the "flicker at the start and end of the
shuffle", and it is not fixable by tuning the animation; only a definite
placement removes it.

**The radar is pinned while the card is open** (`_pinMap`), reading its cell back
from the live layout rather than hardcoding one. Preserve BOTH spans when
pinning — dropping the row span collapses a two-row tile into one and forces
that track to the tile's full height.

### The day-switch push needs a clone, and split transform/opacity

`_switchDay` animates both halves at once, which needs a clone of the outgoing content: the live
element cannot be in two places, and playing the exit before the entrance leaves the card blank for
the length of the first half. Two things to preserve:

- The clone is appended **after** the real body, so `querySelector` in `updated()` still resolves
  `.sheet-readout` and friends to the live one. Insert it first and the post-render positioning
  measures the ghost.
- **Transform and opacity are animated separately on each half.** One keyframe set means one
  easing, and the spring's very fast start brought the arriving day to half opacity while the
  leaving one was still at 60% — measured 0.52/0.61 at the crossover, which reads as a smear rather
  than a push. Split, the worst simultaneous legibility is 0.17/0.18.

The date label lives inside the sliding body, not in a nav row, so it travels with the day it
names; the prev/next buttons are positioned out of flow so they stay put. `.sheet-date` is a fixed
`--snav-size` line precisely so it occupies the row those buttons sit on.

Its **width is fixed too** (`--sheet-date-w`), and `.snav.next` is positioned from that same token.
The date string varies by 34px across a ten-day list (measured 222–256px in `en`), so a
shrink-to-fit box would drag the next button back and forth as the day changed — most visibly
during the push, where the buttons are meant to be the one fixed thing. A locale whose dates are
wider than the token will overflow into the free area kept on the right; widen the token rather
than making the box elastic.

The date is **centred** in that box. Left-aligning it parks the whole of the slack on one side, and
the resulting lopsided gap before the next button was rejected on sight. Keep the two gaps equal:
`--sheet-date-w` is padded by 10px at both ends for exactly that reason.

### `_pushSwap` takes a TARGET, and which one you pass is the message

The same push animates a day change and a series toggle, but they move different things:

- day change → `.sheet-body`, the date included, because the date is what changed;
- series toggle → `.sheet-content`, everything *below* the date, because it has not.

Sliding the date on a toggle was a bug: the animation announced a new day when only the chart had
changed. The clone is absolutely positioned, so `_pushSwap` sets its `top` from the original's
`offsetTop` — it is not always at the top of its parent.

### The day card is a fixed height with almost nothing spare

354px, `overflow: hidden`, and the content came to 328 in a 330 stage — **2px**. Anything added to
the vertical rhythm has to be taken from somewhere else or it is clipped. When the glyph row needed
clearance from the plot, 5px came out of its top margin and only the remainder was spent on height.
Measure before adding: the clip happens at the padding box, so there is a little more room than the
stage suggests, but not much.

`.now-line` derives its reach from `.sheet-glyphs`' bottom margin. Change one, change the other.

### A glyph and a chance in one cell must come from one forecast

Fixed twice, in two different layers, and both looked identical on screen — rain drawn above a
blank while the cells that carried a figure showed no rain:

1. **Across providers.** The strip drew the weather entity's glyph beside Open-Meteo's probability.
   Measured: met.no called 04:00 `rainy` with 0.5mm while Open-Meteo's ensemble gave 04:00 5% and
   put the chance at 05:00-06:00. The strip's glyph now comes from the same fetch as its chance.
   The temperature deliberately still comes from the entity — a temperature cannot visibly
   contradict a probability the way a glyph can.
2. **Within one provider.** `weather_code` is a single deterministic run; `precipitation_probability`
   is an ensemble of perturbed runs. One fetch returned `cloudy` at 35% next to `rainy` at 18%. So
   thresholding on the number alone is not enough — see `WET_CONDITIONS`, which forces a figure
   wherever the glyph depicts precipitation.

If you add another surface showing a condition and a chance together, apply the same rule, and
remember a threshold cannot by itself keep them consistent.

### Precipitation PROBABILITY exists in exactly one place

Measured 2026-09-08 against real payloads, not documentation:

| Source | Has hourly probability? |
| --- | --- |
| Met.no, both the HA integration and the **raw API** | **No.** `next_1_hours.details` carries `precipitation_amount` alone. The field exists in met.no's schema but is filled only inside their Nordic ensemble domain; elsewhere they serve ECMWF deterministic. Patching the integration would not help. |
| The Open-Meteo **HA integration** | **No.** It exposes humidity, cloud cover, UV and wind, but not this. |
| Open-Meteo **REST API** | **Yes** — `hourly=precipitation_probability`, `daily=precipitation_probability_max`. |

So the card fetches it itself. It rides on the request `hourly-source.ts` already makes for the
temperature curve, which is why moving that fetch anywhere means moving the whole thing — split
them and the card makes two calls where it used to make one.

**The probability is a far coarser grid than the temperature and cannot be otherwise.** Probability
requires an ensemble; free ensembles run at ~0.25° (~25 km) while the temperature comes from
ICON-D2 at ~2.2 km. Measured by querying offset points: temperature changes at every step, but the
probability at +1 km and +6 km is identical. Expect it to disagree with the precipitation map,
which is drawn from the high-resolution field. Neither is wrong, and it is not worth "fixing".

### The temperature scale thins LABELS, never the bounds

The day card's y-axis is capped at four labels. Do that by stepping the labels in larger multiples
of 5, not by choosing a coarser step and re-rounding the bounds to it. The latter was tried and
rejected: a 31° day rounded up to a 40° axis and the curve collapsed to two thirds of the plot
height. Bounds stay at the tight 5° rounding; the curve fills ~75% of the box on a normal day, and
labels are multiples of 5 stepped down from the top so they are whole numbers however coarse the
step gets.

### Conditional SVG shapes need lit's `svg` tag, not `html`

The day curve draws its elapsed and remaining halves as separate shapes, so those are conditional
fragments inside the `<svg>`. A nested ``html`…` `` template is parsed in the **HTML** namespace:
`<polygon>` comes out as an unknown HTML element, is inserted happily, reports as an element in
the DOM — and never paints. Nothing errors, so the only symptom is a missing shape. Use
``svg`…` `` for any fragment that lands inside an `<svg>`.

Related: `stroke-dasharray` on the curve is in **user units**, and the viewBox is stretched to the
plot (`preserveAspectRatio="none"`), so a plain dasharray is squashed horizontally. The
`non-scaling-stroke` vector-effect is what keeps the dashes in screen pixels. Round line caps also
grow each dash by half the stroke width at both ends, so the numbers are stated in pre-cap
geometry.

### `_nightAt` reads the FORECAST's sun times, not `sun.sun`

`sun.sun` carries the **next** rising and setting and nothing else — a single window — so it can
only classify times up to tomorrow's sunrise and assumes daylight forever after. Measured
2026-09-08: Thursday 21:00 and Friday 03:00 both returned *day*, so every night hour from tomorrow
evening onward wore daytime artwork in the strip and the day card.

Fixed in v3.0.3 by taking `sunrise,sunset` from the Open-Meteo **daily** block, which the card was
already requesting for `precipitation_probability_max` — the same call, no extra cost, exact values
for all ten days. `daySun` in `hourly-source.ts` holds them, keyed by local date.

`sun.sun` is still the fallback for a day the forecast does not cover and for the moments before it
loads, so the old single-window behaviour is still in there — just no longer the normal path. Do
not try to widen it; the data is not in that entity.

Polar days with no sunrise or sunset are simply absent from `daySun`, and fall back.

### Bubble pop-ups cannot pass CSS variables to a hosted card

Bubble rewrites pop-up `styles:` selectors with a `:not(.bubble-cards-grid-container, …)` that
excludes cards inside its grid, so custom properties set there never reach the card. That is why
`hero_bleed_x`, `hero_bleed_top`, `hero_extend` and `hero_radius` are **config options** rather
than variables — the values have to arrive through `setConfig`.

### The hero's bottom fade

A two-stop `linear-gradient` mask produces a visible line where the fade starts — the alpha slope
jumps from zero to constant, which the eye reads as an edge (a Mach band). The mask is a
multi-stop smoothstep ramp for that reason. If you simplify it, the line comes back.

Related: `overflow: hidden` clips a text-shadow to the element box. Where a wide soft shadow has to
survive, the clip box is expanded with `padding: 34px; margin: -34px` rather than by disabling
overflow, so `text-overflow: ellipsis` still works.

### Static backgrounds paint before positioned elements

A `position: relative` sibling paints over a static sibling's background regardless of z-index
order in the markup. When the hero artwork bled under the hourly panel, the fix was to make the
panel positioned — not to reorder or restack.

### `forecast_source: open-meteo` swaps the SOURCE, not the shapes

`_applyOpenMeteoForecast` rebuilds `_daily` and `_hourly` into exactly the `ForecastItem` shape the
entity's subscription produces, so no consumer downstream knows the difference and there is one
place the two can diverge. Two traps, both hit while building it:

- **The entity's subscription still fires.** Assigning `_daily`/`_hourly` in the callback
  unconditionally meant an entity push silently replaced the Open-Meteo data until the next hourly
  refetch — the card sat on whichever provider had spoken most recently. The callbacks now keep the
  entity's copy in `_entityDaily`/`_entityHourly` and only draw it when the entity is the source.
  Those copies are also the fallback when the fetch fails.
- **`updated()` gated the fetch on `_daily.length`.** Under `open-meteo` that list is filled BY the
  fetch, so the gate deadlocked and the card stayed permanently empty. The gate now passes when the
  option is set, regardless.

`entity` stays required — the unit strings come from it and it is the fallback — so
`_config.entity` must never become optional.

### The daily list panel is a FIXED height, so rows shrink as days grow

Two tiles tall however many rows it holds: six rows are 50px, ten are 30px. A glyph plus a chance
underneath needs 36px, so past about seven rows the caption printed over the row below.
`roomForProb` in `_renderDaily` drops the caption rather than overlap.

This was invisible until `forecast_source: open-meteo` arrived, because met.no publishes six daily
entries — `daily_days: 10` had never actually produced ten rows. Expect more of this: options that
looked fine for years were only ever exercised against met.no's limits.

### The daily list and the day sheet use DIFFERENT providers, on purpose

Measured 2026-09-06: `weather.get_forecasts(type: hourly)` on met.no returns exactly **48 entries**
— today, tomorrow, and a partial day after. A ten-row list would therefore have hourly detail for
three rows and nothing for seven, which is the entire point of the sheet. Open-Meteo returns all
240 hours in one request, so the sheet uses that.

The visible consequence: a list row's high comes from the HA weather entity, the peak of its curve
from Open-Meteo, and they can differ by a degree or two. The sheet prints H/L computed **from the
curve it is drawing** so its own numbers and picture never disagree. Do not "fix" that by copying
the row's H/L onto the sheet — then the label would contradict the graph.

Do not be tempted to synthesise hourly values for the missing days by interpolating a diurnal
shape between the daily low and high. That invents data and presents it as forecast.

### Autoplay on expand is not `_togglePlayback()`

`_autoPlay()` exists because the toggle would PAUSE a map that is already running. Expanding also
has to cope with the grid arriving *after* the open, so `_ensureGrid` starts playback too if the
tile is already expanded. Both paths respect `prefers-reduced-motion`.

### The Python cache and the card must request the SAME fields

`HOURLY_VARS` / `DAILY_VARS` exist in **both** `src/hourly-source.ts` and
`pyscript/fruity_weather.py`, and the card parses the pyscript file with the same code it uses for
the API response. Add a field to one and not the other and there is no error — the field is simply
missing for anyone running the shared cache, which is the harder case to notice because it only
affects installs that have pyscript set up.

After changing either, run `pyscript.reload` then `pyscript.fruity_weather_sync` and check
`precip-hourly.json` actually gained the field before testing the card.

### Day/night comes from the sun, never the condition string

Met.no can sit on `clear-night` for the better part of an hour after sunrise. `sun.sun` is the only
authority for which artwork and which glyph to use.

## Build

```bash
npm install
npm run typecheck     # tsc --noEmit
npm run build         # vite build -> dist/
```

`dist/` is committed. **Rebuild and commit it with any source change**, or installs ship stale code.

**CI verifies the build; it must never commit `dist/`.** It used to, and the two fought: the
runner's esbuild reflows the minified output by ~430 lines per push with no functional change,
so every source push produced a spurious dist commit that then rejected the next local push. The
committed bundle is deliberately the one running on the live instance.

Vite forces **legacy** TypeScript decorators (`experimentalDecorators` + `useDefineForClassFields:
false`). Lit 3's decorators break at runtime ("Configuration error") if esbuild compiles them as
TC39 standard decorators. Do not remove that `tsconfigRaw` block.

## Working against a live Home Assistant

**This repository IS the live copy.** The checkout is `/config/www/fruity-weather-card/`, and Home
Assistant serves the same tree at `/local/fruity-weather-card/…`. There is deliberately no second
copy to keep in sync.

**Bump the resource `?v=` after every rebuild.** A hard reload with cache disabled does *not*
re-fetch a dynamically `import()`ed module; the browser keeps running the old bundle even though
fetching the same URL returns the new bytes. The same applies to the background JPEGs — they carry
their own `?v=` in the CSS URL.

**Bumping it is not sufficient on its own.** Home Assistant's frontend caches the Lovelace
*resource list*, so after changing the resource URL the page can go on requesting the OLD `?v=`
indefinitely; an ordinary navigation will not pick up the new one. It takes a reload with the cache
ignored.

This produced two **falsely passing tests** in one session: the assertion ran against the previous
bundle, found the state it expected because the old code had left it there, and reported success.
So when driving a browser to verify a change, **assert the loaded bundle URL first**:

```js
const url = [...document.querySelectorAll('script,link')]
  .map(x => x.src || x.href).filter(u => u && u.includes('fruity-weather-card'))[0];
if (!url.includes(EXPECTED_VERSION)) return { ABORT: 'stale bundle', url };
```

And prefer assertions that require a value to *change*. "Hover is never null" passed against a
stale value that simply never updated; "hover takes 8 distinct values while sweeping" did not.

### Pushing

- **Port 22 is blocked** from the agent sandbox, so SSH remotes hang. Push over HTTPS:
  `git push "https://x-access-token:$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/db-wally007/fruity-weather-card.git" main:main`
- **Never store that token in `.git/config`.** `.git/` sits under `www/`, so
  `/local/fruity-weather-card/.git/config` is publicly served by Home Assistant.
- **The global gitconfig carries a work email.** This repo pins a local
  `user.email = 160316053+db-wally007@users.noreply.github.com`. Check before committing.
- Before any push, re-scan for the owner's town, coordinates, internal domain and device brands.
  The repo was sanitised once and it would be easy to reintroduce through a copied example:

  ```bash
  git diff --cached --name-only | grep -vE '^(backgrounds|dist)/' \
    | xargs grep -niI -e '<town>' -e '<lat prefix>' -e '<lon prefix>' \
                     -e '<internal domain>' -e '<sensor brand>'
  ```

  Fill the placeholders from `hass.config` and the local entity ids rather than writing the real
  values into this file — that would put them in the public repo, which is the thing being
  prevented.

## Verifying changes

Drive a real headless browser rather than reasoning about the layout. Check the hero at a pop-up
width and standalone, the strip's sunrise/sunset insertion, and the map at more than one zoom.
