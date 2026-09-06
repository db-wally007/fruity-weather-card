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
