# Fruity Weather Card

An iOS-style weather card for Home Assistant: a full-bleed scene hero, a 24-hour strip with sunrise
and sunset threaded into it, a multi-day forecast with range bars, a grid of detail tiles, and a
forecast **precipitation map** — because Home Assistant has no radar of its own.

Lit + TypeScript, built with Vite into one self-contained ESM file. No chart or map library: the
strip, the range bars, the sun arc, the wind rose and the map are all drawn by the card.

## What's in it

- **Hero** — condition artwork behind the location, temperature, condition and today's high/low.
  26 scenes, one per Home Assistant condition, with separate night variants.
- **Hourly strip** — the next N hours, with `Sunrise` and `Sunset` inserted as their own cells at
  the right position in the sequence.
- **Daily list** — N days with a low→high range bar coloured by temperature.
- **Detail tiles** — sunrise/sunset arc, wind rose, precipitation, feels-like, humidity. Each can
  read a real sensor rather than the forecast, and each can be given its own tap action.
- **Day detail** — tap any row of the daily list and an hourly card opens beside it, three columns
  wide, pushing the tiles down. A notch on its edge points at the day it is showing.
- **Precipitation map** — Open-Meteo's gridded forecast drawn over an Esri basemap, with a
  server-side cache so the API budget is spent once for the whole house rather than per browser.
  It starts animating as soon as you expand it.

## Requirements

### Required

| | |
| --- | --- |
| A `weather.*` entity | Must support `weather/subscribe_forecast` for both `hourly` and `daily`. Met.no (built in) does. |
| `sun.sun` | Enabled by default in Home Assistant. Override with `sun_entity`. |
| An icon set | **Not bundled** — see [Icons](#icons). The card fetches PNGs at runtime and has no fallback. |

### Optional

| | |
| --- | --- |
| Scene backgrounds | Included in [`backgrounds/`](backgrounds/). Without them the hero falls back to a plain panel. |
| Detail sensors | Any numeric sensors, wired through `current:`. Without them the tiles use the forecast. |
| `pyscript` | Only for the precipitation map's shared cache — see [Precipitation map](#precipitation-map). |
| `homeassistant/weather_today.yaml` | Only for the example launcher button, not for the card. |

## Install

**HACS (custom repository)**

1. HACS → ⋮ → **Custom repositories** → add `db-wally007/fruity-weather-card`, type **Dashboard**.
2. **Install**, then hard-refresh the browser.

**Manual** — `dist/` is committed, so there is no build step:

```bash
cp dist/fruity-weather-card.js /config/www/
cp -r backgrounds /config/www/weather-bg
```

Then add it under **Settings → Dashboards → Resources** as a *JavaScript module* and hard-refresh.

## Usage

Minimal:

```yaml
type: custom:fruity-weather-card
entity: weather.forecast_home
name: Home
```

Everything below is optional. The defaults are the ones baked into the code, so omitting an option
is identical to setting it to its default.

## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | string | – | `custom:fruity-weather-card` |
| `entity` | string | **required** | The weather entity. |
| `name` | string | entity name | Location label in the hero. |
| `sun_entity` | string | `sun.sun` | Drives day/night artwork and the sun arc. |
| `icons_path` | string | bundle-relative `../icons` | Folder of condition PNGs. See [Icons](#icons). |
| `backgrounds_path` | string | `/local/weather-bg` | Folder of `hero-*.jpg` scenes. |
| `hourly_hours` | number | `24` | Cells in the hourly strip. |
| `daily_days` | number | `10` | Rows in the daily list. |
| `current` | object | – | Real sensors for the tiles (see below). |
| `map` | boolean | `false` | Show the precipitation map tile. |
| `map_zoom` | number | widest | Starting zoom; whatever the user picks afterwards is remembered. |
| `map_style` | `dark` \| `light` | `dark` | Esri Gray Canvas edition. |
| `tap_actions` | object | – | Per-region actions (see below). |
| `hero_bleed_x` / `hero_bleed_top` | number \| string | – | Push the hero artwork past the card box to reach a host's own edge. |
| `hero_extend` | number \| string | – | Grow the hero taller. |
| `hero_radius` | number \| string | – | Round the hero's top corners to match the host. |

### `current`

Each key takes an entity id. Anything omitted falls back to the forecast.

```yaml
current:
  temperature: sensor.outdoor_temperature
  feels_like: sensor.feels_like
  humidity: sensor.outdoor_humidity
  dew_point: sensor.dewpoint
  wind_speed: sensor.wind_speed
  wind_gust: sensor.wind_gust
  wind_bearing: sensor.wind_direction
  precipitation_today: sensor.daily_rain
```

### `tap_actions`

Regions: `hero`, `hourly`, `daily`, `sun`, `wind`, `precipitation`, `feels_like`, `humidity`.
Regions with no entry stay inert — no cursor change, no handler. The map tile is not listed because
its tap already expands it.

```yaml
tap_actions:
  wind:
    action: navigate
    navigation_path: /dashboard/house#wind-popup
  humidity:
    action: more-info
    entity: sensor.outdoor_humidity
```

### Embedding in a pop-up

The hero is designed to bleed to its host's edges. Inside a Bubble Card pop-up 966px wide:

```yaml
hero_bleed_x: 30
hero_bleed_top: 46
hero_extend: 20
hero_radius: 42
```

These are config rather than CSS variables on purpose: Bubble rewrites pop-up style selectors with
a `:not()` that excludes cards in its grid, so custom properties set there never reach the card.

## Icons

**The card needs a set of condition PNGs and none are bundled.** The set used during development
arrived without a licence, and this repository is MIT, so shipping it would be careless.

Point `icons_path` at your own folder:

```yaml
icons_path: /local/my-weather-icons
```

The files are looked up as `<icons_path>/<name>.png` and the set must contain:

```
clear  cloudy  drizzle  fog  freezing_rain  haze  heavy_rain  heavy_snow
night_clear  night_cloudy  night_drizzle  partly_cloudy  rain  snow
sunrise  sunset  thunderstorm  windy
```

96×90 works well. With no set present the card still lays out correctly, but every glyph is a
broken image.

### Where to get a set

Four freely-licensed sets were rendered side by side at 30px before this card settled on its own
artwork. The notes below are from that comparison, not from reading their READMEs — at the size
the hourly strip uses, **whether the sun disc is visible beside the cloud on `partly_cloudy`** is
the single thing that decides legibility.

| Set | Licence | How it looked at 30px |
| --- | --- | --- |
| [basmilius/weather-icons](https://github.com/basmilius/weather-icons) (Meteocons) | MIT, © 2020– Bas Milius | The obvious first stop — large, well drawn, animated and static SVG plus PNG. But it tucks the sun **behind** the cloud on partly-cloudy, so partly-cloudy and cloudy were indistinguishable at this size. |
| [googlefonts/noto-emoji](https://github.com/googlefonts/noto-emoji) | SIL OFL 1.1, © 2013 Google | Best small-size legibility of the four: white/grey clouds, blue rain, and the sun disc clearly beside the cloud. Two catches — there is **no moon-behind-cloud emoji**, so `night_cloudy` has to be faked, and files are named by codepoint (`emoji_uXXXX.svg`), not by condition. |
| [microsoft/fluentui-emoji](https://github.com/microsoft/fluentui-emoji) | MIT, © Microsoft | Good sun separation, but the clouds are purple-tinted and clash with a neutral card. |
| [makin-things/weather-icons](https://github.com/makin-things/weather-icons) | MIT, © 2019 Custom cards for Home Assistant | Built for Home Assistant, big clear sun disc — but blue clouds and an orange moon, which washed out once recoloured. |

For the iOS look specifically, the reference artwork is not distributed and cannot be extracted.
The legitimate route is **SF Symbols** — a free download from
[developer.apple.com/sf-symbols](https://developer.apple.com/sf-symbols/), which contains
`cloud.sun.fill` and friends. Export to PNG and rename to the list above. Apple's own
[guide to the weather icons](https://support.apple.com/guide/iphone/learn-the-weather-icons-iph4305794fb/ios)
is a useful reference for which glyph each condition should get.

### Normalising a set

Whatever you pick, check the **ink** rather than the canvas. Sets routinely carry very different
padding inside the same nominal size — in one set the rain glyph filled 83×84 of its 96×90 canvas
while the cloud filled 87×58 — so `background-size: contain` renders each condition at a visibly
different size. Trim and re-pad them to a common ink fraction first:

```bash
for f in *.png; do
  magick "$f" -trim +repage -resize 94x94 \
          -background none -gravity center -extent 100x100 "normalised/$f"
done
```

## Backgrounds

The 26 hero scenes in [`backgrounds/`](backgrounds/) are **derived from
[Thyraz/weather-forecast-extended](https://github.com/Thyraz/weather-forecast-extended)** (MIT,
© 2025 Thyraz) — see [NOTICE](NOTICE). Each source illustration was zoomed and re-cropped to the
card's aspect ratio, with the horizon and the focal element (sun or moon) detected and positioned
so the artwork reads at hero size and nothing bright sits behind the text.

Two sizes ship:

- `hero-<condition>.jpg` — 1536×394, for the card's hero.
- `scene-<condition>.jpg` — 480×272, for a dashboard launcher button
  ([example](homeassistant/example-launcher-card.yaml)).

Conditions with a night variant carry a `-night` suffix. `exceptional` has no artwork of its own
and falls back to `cloudy`.

The hero applies its own scrim: the image sits at 80% opacity under a mask that eases to
transparent toward the bottom, and the text carries a wide, soft shadow rather than a hard one.

## Day detail

Tapping a row of the daily list opens an hourly card beside it — three tile columns wide and the
same height as the list, so the detail tiles simply flow underneath. It is a grid card rather than
an overlay: nothing is hidden behind it, its position never changes, and only the notch on its left
edge moves, to point at whichever day is selected. Tap the same row again to close it.

It carries that day's hourly temperature curve, a condition glyph every few hours, and the day's
high and low. Drag or hover across the curve for the time, temperature and condition at that hour.

**The curve does not come from your weather entity.** Home Assistant serves whatever the
integration publishes, and met.no publishes exactly **48 hourly entries** — today, tomorrow and a
partial day after. Seven of the ten rows would have nothing to show. The sheet therefore fetches
ten days of hourly temperature from Open-Meteo in a single request (240 points, one API call,
cached for an hour in the browser).

The consequence to know about: a row's high in the list comes from your weather entity, while the
peak of its curve comes from Open-Meteo, so the two can differ by a degree or so. The sheet labels
its **own** high and low from the curve it is drawing, so what is shown and what is labelled always
agree with each other.

Precipitation probability is deliberately absent — see the note in `hourly-source.ts`; it will
arrive with the wider precipitation-chance work.

## Precipitation map

Home Assistant has no radar — the built-in map card plots entity markers on a basemap with no tile
or overlay support — so the field is fetched from Open-Meteo and drawn by the card.

Set `map: true` and the card will fetch the grid itself. That is fine for one browser, but
**Open-Meteo bills per location** and a 143-point grid spends 143 of the 10,000 free daily calls.
Every browser profile keeps its own cache, so a tablet, a phone and a desktop each pay full price.

[`pyscript/fruity_weather.py`](pyscript/fruity_weather.py) fetches it once for the whole house
instead, on a timer, and writes `precip-grid.json` next to the card. At the default refresh that is
a flat ~6.9k calls a day no matter how many dashboards are open. Setup is in the file's docstring.

The map needs internet **from the browser**, not just from Home Assistant.

## Building

```bash
npm install
npm run typecheck
npm run build
```

`dist/` is committed so HACS installs without a build step, and the committed bundle is the one
actually running on the author's Home Assistant. Rebuild and commit it alongside any source
change; CI verifies the build but deliberately does not commit it.

## Licence

MIT — see [LICENSE](LICENSE). Bundled artwork is credited in [NOTICE](NOTICE).
