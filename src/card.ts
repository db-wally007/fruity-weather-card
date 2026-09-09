/**
 * Fruity Weather — an iOS-style Lovelace weather card.
 *
 * Layout mirrors the iOS Weather app's front page:
 *   hero (location / temperature / condition / high-low)
 *   → 24-hour scrolling strip with sunrise+sunset markers woven in
 *   → two columns: the daily list on the left, detail tiles on the right.
 *
 * Design notes:
 *  - Typography uses the system-UI font stack on purpose: on iOS/macOS that
 *    resolves to the real SF Pro, elsewhere it falls back to Inter then Roboto.
 *    No proprietary font is bundled or redistributed.
 *  - Icons are Meteocons (basmilius/weather-icons, MIT) served from
 *    `icons/` next to this bundle — see icons/LICENSE-meteocons.txt.
 *  - No `backdrop-filter` anywhere: per-card backdrop blur was removed from
 *    every dashboard in this config because it is a serious performance hog on
 *    the kiosk tablet. Panels use flat translucent fills instead.
 */
import {
  LitElement, html, svg, css, unsafeCSS, nothing,
  type PropertyValues, type TemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  fetchPrecipGrid, baseTiles, viewportFor, paintFrame, blendFrames, lonToX, latToY,
  LEGEND_GRADIENT, MAP_ATTRIBUTION, CACHE_TTL_MS,
  type PrecipGrid, type Viewport, type MapStyle,
} from './precip-map.js';
import {
  fetchHourlyDays, localDateKey, HOURLY_TTL_MS,
  type HourlyDays, type HourPoint,
} from './hourly-source.js';

/** The legend bar paints the same ramp the heat field uses. */
const unsafeGradient = unsafeCSS(LEGEND_GRADIENT);

/**
 * Below this, a day's chance of precipitation is not printed at all.
 *
 * The probability comes from a ~25 km ensemble (see hourly-source.ts), which
 * emits a few percent on days that are forecast bone dry — 3%, 8%, 16% all
 * appeared in a run where no day but one carried any rain. Printing those turns
 * the daily list into a column of meaningless small numbers. The reference app
 * shows nothing on such days either.
 */
const PROB_MIN = 20;

/**
 * Conditions whose glyph depicts falling precipitation. A cell showing one of
 * these ALWAYS prints its chance, however small.
 *
 * Needed because a provider's condition and its probability come from different
 * products: the condition is one deterministic run, the probability an ensemble
 * of perturbed ones, and they disagree. Observed on a single Open-Meteo fetch —
 * 05:00 `cloudy` at 35%, 07:00 `rainy` at 18%, 08:00 `rainy` at 8%. Thresholding
 * on the number alone printed a figure beside a dry glyph and left the two rainy
 * ones blank, which is exactly the mismatch this rule exists to prevent: in the
 * reference design every wet glyph carries a number and no dry one does.
 */
const WET_CONDITIONS = new Set([
  'rainy', 'pouring', 'snowy', 'snowy-rainy', 'hail', 'lightning', 'lightning-rainy',
]);

/** Which series the day card charts. */
type SheetMode = 'temp' | 'precip';

/**
 * Default home of the hero scene artwork. It sits outside the card's own
 * directory because the same set dresses the dashboard's weather launcher
 * button, and duplicating 2 MB of JPEGs to serve two callers is silly.
 * Override with `backgrounds_path` when a HACS install puts them elsewhere.
 */
const HERO_BASE = '/local/weather-bg';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HassEntity {
  state: string;
  attributes: Record<string, any>;
}

interface Hass {
  states: Record<string, HassEntity>;
  locale?: { language?: string; time_format?: string };
  config?: {
    unit_system?: Record<string, string>;
    latitude?: number;
    longitude?: number;
  };
  connection: {
    subscribeMessage<T>(cb: (msg: T) => void, sub: Record<string, unknown>): Promise<() => void>;
  };
  callService(
    domain: string, service: string,
    data?: Record<string, unknown>, target?: Record<string, unknown>,
  ): Promise<unknown>;
}

interface ForecastItem {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
  precipitation?: number;
  precipitation_probability?: number;
  humidity?: number;
  wind_speed?: number;
  wind_bearing?: number;
}

interface ForecastEvent {
  type: string;
  forecast: ForecastItem[];
}

/** Optional sensor overrides for the "right now" values. */
interface CurrentConfig {
  temperature?: string;
  feels_like?: string;
  humidity?: string;
  dew_point?: string;
  wind_speed?: string;
  wind_gust?: string;
  wind_bearing?: string;
  precipitation_today?: string;
}

/**
 * Home Assistant's standard action schema, so a region can be pointed at
 * anything the rest of the dashboard can do rather than only at a URL.
 */
interface ActionConfig {
  action: 'navigate' | 'more-info' | 'url' | 'toggle' | 'perform-action' | 'call-service' | 'none';
  navigation_path?: string;
  url_path?: string;
  entity?: string;
  /** `perform-action` is the current spelling; `service` is the old one. */
  perform_action?: string;
  service?: string;
  target?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

/**
 * Every tappable region of the card. One key per region so the config reads
 * the same way whichever one is being wired up, and adding a region later
 * needs no new option name.
 */
type TapRegion =
  | 'hero' | 'hourly' | 'daily' | 'sun' | 'wind'
  | 'precipitation' | 'feels_like' | 'humidity';

interface CardConfig {
  type: string;
  entity: string;
  name?: string;
  sun_entity?: string;
  /**
   * Where the forecast comes from.
   *
   * `entity` (default) renders whatever `weather.*` entity you point the card
   * at, which is the Home Assistant convention and keeps your choice of
   * integration meaningful. The day card's curve and the chance of
   * precipitation still come from Open-Meteo either way — no integration
   * publishes the latter, and met.no caps hourly data at 48 entries.
   *
   * `open-meteo` puts EVERYTHING on that one fetch: present conditions, the
   * hourly strip, the daily list and the tiles' fallbacks. That removes the
   * class of contradiction that comes from showing two models' opinions side by
   * side, and over central Europe it is the finer grid — measured 2026-09-09,
   * Open-Meteo resolves a difference 1km away where met.no returns the same
   * value across 14km, because met.no's own high-resolution model covers only
   * the Nordics and serves ~9km ECMWF elsewhere.
   *
   * The costs: `entity` stops selecting your forecast, and one provider outage
   * empties the card rather than degrading it. `entity` is still required —
   * it supplies the unit strings and is the fallback while the fetch is in
   * flight or if it fails.
   */
  forecast_source?: 'entity' | 'open-meteo';
  /**
   * Serve condition glyphs from here instead of the bundled set, e.g.
   * `/local/my-weather-icons`. Files must be named after the HA condition
   * glyph keys in ICON_DAY below, with a .svg extension. Intended for dropping
   * in SF Symbols exports.
   */
  icons_path?: string;
  /**
   * Serve the hero's scene artwork from here instead of `/local/weather-bg`,
   * e.g. when HACS has installed the set somewhere else. Files must be named
   * `hero-<condition>.jpg`, with `-night` variants where the condition looks
   * different after dark.
   */
  backgrounds_path?: string;
  /**
   * Push the hero's scene artwork this far past the card box so it can reach a
   * host's own edge — the tablet pop-up needs 30 / 24 to clear the card's 12px
   * padding plus the pop-up's 18px/24px. `hero_radius` should match whatever
   * rounds the host's top corners (42 in the pop-up, 20 standalone). Numbers
   * are px. Passed as config rather than CSS vars because Bubble rewrites
   * pop-up style selectors with a :not() that excludes cards in its grid.
   */
  hero_bleed_x?: number | string;
  hero_bleed_top?: number | string;
  /**
   * Grow the hero this many px taller. Height is added to its own box rather
   * than overhanging the strip below: the panels are translucent, so artwork
   * pushed under one shows through it instead of being hidden behind it.
   */
  hero_extend?: number | string;
  hero_radius?: number | string;
  hourly_hours?: number;
  daily_days?: number;
  current?: CurrentConfig;
  /**
   * Forecast precipitation map tile, two columns by two rows; tap expands it.
   * Home Assistant has no radar of its own — the built-in map card only plots
   * entity markers on a basemap, with no tile-layer or overlay option — so the
   * field is fetched from Open-Meteo and drawn here. Needs internet from the
   * BROWSER, not just the LAN.
   */
  map?: boolean;
  /**
   * Starting zoom for both states. Defaults to the widest the buttons allow;
   * whatever the user zooms to afterwards is remembered and overrides this.
   */
  map_zoom?: number;
  /**
   * Basemap shade. Esri publishes Gray Canvas in a Light and a Dark edition;
   * dark is the default because the rest of the card is dark and a white map
   * punched a hole in it.
   */
  map_style?: MapStyle;
  /**
   * Where each region goes when tapped, e.g.
   *
   *   tap_actions:
   *     wind:
   *       action: navigate
   *       navigation_path: /dashboard/house#wind-popup
   *     humidity:
   *       action: more-info
   *       entity: sensor.outdoor_humidity
   *
   * Regions with no entry stay inert — no cursor change, no handler. The map
   * tile is not listed because its tap already expands it.
   */
  tap_actions?: Partial<Record<TapRegion, ActionConfig>>;
}

/** One cell of the hourly strip — either a real hour or a sun event. */
type HourCell =
  | { kind: 'hour'; time: Date; label: TemplateResult; condition: string; temp?: number; prob?: number }
  | { kind: 'sun'; time: Date; label: TemplateResult; event: 'sunrise' | 'sunset' };

// ---------------------------------------------------------------------------
// Condition → icon mapping
// ---------------------------------------------------------------------------

/**
 * Glyph file names keyed by HA condition. The artwork itself is not bundled —
 * see the Icons section of the README for what a set must contain and how to
 * point the card at one.
 */
const ICON_DAY: Record<string, string> = {
  'clear-night': 'night_clear',
  cloudy: 'cloudy',
  fog: 'fog',
  hail: 'freezing_rain',
  lightning: 'thunderstorm',
  'lightning-rainy': 'thunderstorm',
  partlycloudy: 'partly_cloudy',
  pouring: 'heavy_rain',
  rainy: 'rain',
  snowy: 'snow',
  'snowy-rainy': 'freezing_rain',
  sunny: 'clear',
  windy: 'windy',
  'windy-variant': 'windy',
  exceptional: 'haze',
};

const ICON_NIGHT_OVERRIDE: Record<string, string> = {
  sunny: 'night_clear',
  partlycloudy: 'night_cloudy',
  cloudy: 'night_cloudy',
  rainy: 'night_drizzle',
};

/** Markers woven into the hourly strip at the real sunrise/sunset times. */
const ICON_SUN_EVENT = { sunrise: 'sunrise', sunset: 'sunset' } as const;

/** Compass letters: label, x, y in the dial's 96-unit viewBox, and bearing. */
const CARDINALS: ReadonlyArray<readonly [string, number, number, number]> = [
  ['N', 48, 13, 0],
  ['E', 83, 48, 90],
  ['S', 48, 83, 180],
  ['W', 13, 48, 270],
];

function iconFor(condition: string | undefined, isNight: boolean): string {
  if (!condition) return 'not-available';
  if (isNight && ICON_NIGHT_OVERRIDE[condition]) return ICON_NIGHT_OVERRIDE[condition];
  return ICON_DAY[condition] ?? 'not-available';
}

/** Human label for the current condition, in the reference wording style. */
const CONDITION_LABEL: Record<string, string> = {
  'clear-night': 'Clear',
  cloudy: 'Cloudy',
  fog: 'Foggy',
  hail: 'Hail',
  lightning: 'Thunderstorms',
  'lightning-rainy': 'Thunderstorms',
  partlycloudy: 'Partly Cloudy',
  pouring: 'Heavy Rain',
  rainy: 'Rain',
  snowy: 'Snow',
  'snowy-rainy': 'Sleet',
  sunny: 'Sunny',
  windy: 'Windy',
  'windy-variant': 'Windy',
  exceptional: 'Exceptional',
};

// ---------------------------------------------------------------------------
// Temperature colour ramp (drives the daily range bars)
// ---------------------------------------------------------------------------

const TEMP_STOPS: Array<[number, [number, number, number]]> = [
  [-10, [76, 110, 245]],
  [0, [77, 171, 247]],
  [8, [56, 217, 169]],
  [15, [169, 227, 75]],
  [21, [255, 212, 59]],
  [27, [255, 146, 43]],
  [33, [250, 82, 82]],
];

function tempColor(t: number): string {
  if (t <= TEMP_STOPS[0][0]) return `rgb(${TEMP_STOPS[0][1].join(',')})`;
  const last = TEMP_STOPS[TEMP_STOPS.length - 1];
  if (t >= last[0]) return `rgb(${last[1].join(',')})`;
  for (let i = 0; i < TEMP_STOPS.length - 1; i++) {
    const [t0, c0] = TEMP_STOPS[i];
    const [t1, c1] = TEMP_STOPS[i + 1];
    if (t >= t0 && t <= t1) {
      const f = (t - t0) / (t1 - t0);
      const c = c0.map((v, k) => Math.round(v + (c1[k] - v) * f));
      return `rgb(${c.join(',')})`;
    }
  }
  return '#ffffff';
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const num = (v: unknown): number | undefined => {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : undefined;
};

const round = (v: number | undefined): string => (v === undefined ? '--' : `${Math.round(v)}`);

// (A 16-point compass helper lived here; the wind tile's Direction row was
// dropped to match the reference, so nothing needs the abbreviation any more.)

// ---------------------------------------------------------------------------
// Tile header glyphs — stroked, 1.6 weight, sized to sit beside 12px caps the
// way SF Symbols do in the iOS tiles.
// ---------------------------------------------------------------------------

const glyph = (body: string) => html`
  <svg class="thead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="true" .innerHTML=${body}></svg>`;

const TILE_ICON = {
  sunrise: glyph(`<path d="M3 19h18"/><path d="M12 2.5v4"/><path d="M9.8 4.7 12 2.5l2.2 2.2"/>
    <path d="M6.6 15.5a5.4 5.4 0 0 1 10.8 0"/><path d="M2.5 15.5h1.6"/><path d="M19.9 15.5h1.6"/>`),
  wind: glyph(`<path d="M3 8.5h9.5a2.75 2.75 0 1 0-2.75-2.75"/>
    <path d="M3 12.5h13a2.75 2.75 0 1 1-2.75 2.75"/><path d="M3 16.5h6.5"/>`),
  drop: glyph(`<path d="M12 3.2c0 0 5.8 6.3 5.8 10.1a5.8 5.8 0 0 1-11.6 0C6.2 9.5 12 3.2 12 3.2Z"/>`),
  thermometer: glyph(`<path d="M14 14.9V5.2a2 2 0 1 0-4 0v9.7a4 4 0 1 0 4 0Z"/>`),
  humidity: glyph(`<path d="M12 3.2c0 0 5.6 6.1 5.6 9.9a5.6 5.6 0 0 1-11.2 0C6.4 9.3 12 3.2 12 3.2Z"/>
    <path d="M9.3 14.4c.7 1.2 1.9 1.8 3.3 1.7"/>`),
} as const;

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

@customElement('fruity-weather-card')
export class FruityWeatherCard extends LitElement {
  @property({ attribute: false }) public hass?: Hass;

  @state() private _config?: CardConfig;
  @state() private _hourly: ForecastItem[] = [];
  @state() private _daily: ForecastItem[] = [];

  /* --- precipitation map --- */
  @state() private _grid?: PrecipGrid;
  @state() private _mapOpen = false;
  @state() private _mapFrame = 0;
  @state() private _mapPlaying = false;

  /** Day-detail sheet: index into the rendered daily list, or null when shut. */
  @state() private _sheetDay: number | null = null;
  /** Hour being scrubbed on the sheet's curve; null restores the H/L readout. */
  @state() private _hourScrub: number | null = null;
  @state() private _hourlyDays?: HourlyDays;
  /** The entity's own forecast, kept whichever source is drawn — see _subscribe. */
  private _entityDaily: ForecastItem[] = [];
  private _entityHourly: ForecastItem[] = [];
  @state() private _hourlyError = false;
  /** Temperature on every open; sticky across day changes while the card lives. */
  @state() private _sheetMode: SheetMode = 'temp';
  private _hourlyPending = false;
  private _hourlyRetryAt = 0;
  private _hourlyBackoff = 0;
  /** '12h' steps hourly through the forecast; '1h' steps 15-minutely. */
  @state() private _mapRange: '1h' | '12h' = '12h';
  /** The user's chosen zoom; undefined = the configured default. Survives
   *  collapse/expand and reloads — see _zoom / _rememberZoom. */
  @state() private _mapZoom?: number;
  private _mapResize?: ResizeObserver;
  private _mapVisibility?: IntersectionObserver;
  private _mapSeen = false;
  /** Continuous playhead in frames. `_mapFrame` is just round(_mapT), kept as
   *  state only so the date and tick labels re-render; driving Lit from the
   *  animation loop would re-render every basemap tile 60 times a second. */
  private _mapT = 0;
  private _mapRaf?: number;
  private _mapLast = 0;
  private _mapScratch?: Float32Array;
  private _gridPending = false;
  private _gridRetryAt = 0;
  private _gridBackoff = 0;
  private _mapViewport?: Viewport;

  private _unsubHourly?: () => void;
  private _unsubDaily?: () => void;
  private _subscribedTo?: string;

  public setConfig(config: CardConfig): void {
    if (!config?.entity) throw new Error('fruity-weather-card: "entity" is required');
    if (!config.entity.startsWith('weather.')) {
      throw new Error('fruity-weather-card: "entity" must be a weather.* entity');
    }
    this._config = { hourly_hours: 24, daily_days: 10, ...config };
    this._mapZoom = FruityWeatherCard._loadZoom();
  }

  public getCardSize(): number {
    return 14;
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('pointerdown', this._outsideTap, true);
    this._unsubscribe();
    this._stopPlayback();
    this._mapResize?.disconnect();
    this._mapResize = undefined;
    this._mapVisibility?.disconnect();
    this._mapVisibility = undefined;
  }

  /**
   * Only spend API calls once the map is actually on screen.
   *
   * The card sits on dashboards that are opened and closed all day, and each
   * fetch costs 143 of a 10,000-call daily allowance. A view the user never
   * scrolls to should cost nothing.
   */
  private _watchMapVisible(): void {
    if (this._mapSeen) { this._ensureGrid(); return; }
    if (this._mapVisibility) return;
    const tile = this.renderRoot.querySelector('.tile.map');
    if (!tile) return;
    this._mapVisibility = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      this._mapSeen = true;
      this._mapVisibility?.disconnect();
      this._mapVisibility = undefined;
      this._ensureGrid();
    }, { rootMargin: '200px' });
    this._mapVisibility.observe(tile);
  }

  /**
   * The open/close spring animates width and height in CSS, which fires no Lit
   * update — so without this the canvas and the basemap would keep the size
   * they had when the class flipped, and the map would only be correct for one
   * of the two states. Watching the frame also covers window resizes.
   */
  private _watchMapSize(): void {
    if (this._mapResize) return;
    const frame = this.renderRoot.querySelector('.map-frame');
    if (!frame) return;
    let queued = false;
    this._mapResize = new ResizeObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        this._paintMap();
        this.requestUpdate();
      });
    });
    this._mapResize.observe(frame);
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if ((changed.has('hass') || changed.has('_config')) && this.hass && this._config) {
      if (this._subscribedTo !== this._config.entity) this._subscribe();
      if (this._config.map) this._watchMapVisible();
    }
    if (this._config?.map) { this._paintMap(); this._syncMapBar(); this._watchMapSize(); }
    // Needed by the daily list, not just the day card, so it cannot wait for an
    // open. Cheap to call repeatedly: it returns early unless the cache is stale
    // and the backoff has elapsed.
    // Under `open-meteo` this must NOT wait for `_daily`: that list is now
    // filled BY the fetch, so gating the fetch on it deadlocks — the card sits
    // empty forever. Waiting is only right when the entity is the source, where
    // it avoids fetching before there is anything to show alongside.
    if (this._wantsOpenMeteo || this._daily.length) void this._ensureHourly();
    if (this._sheetDay !== null) { this._positionArrow(); this._positionReadout(); }
  }

  /* ------------------------------------------------ precipitation map ---- */

  /**
   * One fetch serves both the small tile and the expanded view.
   *
   * `updated()` runs on every hass state change — many times a second in a busy
   * install — so this MUST refuse to retry freely. It previously did, and a
   * single failure turned into a request storm that exhausted Open-Meteo's
   * whole daily quota: the API bills per location, so one 143-point call spends
   * 143 of the 10,000 daily allowance and the error is
   * "Daily API request limit exceeded. Please try again tomorrow." — not
   * something a retry can clear. Failures back off, doubling to 15 minutes.
   */
  private async _ensureGrid(): Promise<void> {
    const lat = this.hass?.config?.latitude;
    const lon = this.hass?.config?.longitude;
    if (lat === undefined || lon === undefined || this._gridPending) return;
    if (this._grid && Date.now() - this._grid.fetchedAt < CACHE_TTL_MS) return;
    if (Date.now() < this._gridRetryAt) return;
    this._gridPending = true;
    try {
      this._grid = await fetchPrecipGrid(lat, lon);
      this._gridBackoff = 0;
      this._gridRetryAt = 0;
      this._mapT = 0;
      this._mapFrame = 0;
      // The tile can be expanded before the grid lands — a cold cache takes a
      // moment — so pick up the autoplay the open could not start.
      if (this._mapOpen && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        await this.updateComplete;
        this._autoPlay();
      }
    } catch (err) {
      this._gridBackoff = this._gridBackoff ? Math.min(this._gridBackoff * 2, 15 * 60_000) : 60_000;
      this._gridRetryAt = Date.now() + this._gridBackoff;
      console.warn(
        `fruity-weather-card: precipitation grid failed, retrying in ${this._gridBackoff / 1000}s`,
        err,
      );
    } finally {
      this._gridPending = false;
    }
  }

  // -- day-detail sheet ------------------------------------------------------

  /**
   * Ten days of hourly data. No longer lazy: the daily list prints each day's
   * chance of precipitation, so this is needed as soon as the card renders
   * rather than when a day is opened. The module still caches for an hour
   * across reloads, and the shared pyscript file usually answers it for free.
   *
   * Because `updated()` drives this and runs on every hass state change, a
   * FAILURE MUST BACK OFF. Without it a single error turns into a request
   * storm — the same way it once exhausted the whole daily quota through
   * `_ensureGrid`, which is why that one backs off too.
   */
  private async _ensureHourly(force = false): Promise<void> {
    const lat = this.hass?.config?.latitude;
    const lon = this.hass?.config?.longitude;
    if (lat === undefined || lon === undefined || this._hourlyPending) return;
    if (!force && this._hourlyDays && Date.now() - this._hourlyDays.fetchedAt < HOURLY_TTL_MS) return;
    if (!force && Date.now() < this._hourlyRetryAt) return;
    this._hourlyPending = true;
    this._hourlyError = false;
    try {
      this._hourlyDays = await fetchHourlyDays(lat, lon, force);
      this._hourlyBackoff = 0;
      this._hourlyRetryAt = 0;
      if (this._config?.forecast_source === 'open-meteo') this._applyOpenMeteoForecast();
    } catch (err) {
      this._hourlyError = true;
      // Degrade to the entity rather than showing nothing. Under
      // `forecast_source: open-meteo` this is the whole safety net: the card
      // loses the chance of precipitation and the ten-day curve, but the hero,
      // the strip and the daily list keep working.
      if (this._wantsOpenMeteo && !this._hourlyDays) {
        if (this._entityDaily.length) this._daily = this._entityDaily;
        if (this._entityHourly.length) this._hourly = this._entityHourly;
      }
      this._hourlyBackoff = this._hourlyBackoff ? Math.min(this._hourlyBackoff * 2, 15 * 60_000) : 60_000;
      this._hourlyRetryAt = Date.now() + this._hourlyBackoff;
      console.warn(
        `fruity-weather-card: hourly forecast failed, retrying in ${this._hourlyBackoff / 1000}s`,
        err,
      );
    } finally {
      this._hourlyPending = false;
    }
  }

  /**
   * A day's peak chance of precipitation, or undefined when there is none or it
   * is too slight to print. The provider's own daily aggregate is used rather
   * than the maximum of the hours, so the figure matches what it publishes.
   */
  /** What the config asks for, regardless of whether the data has arrived. */
  private get _wantsOpenMeteo(): boolean {
    return this._config?.forecast_source === 'open-meteo';
  }

  /** True when the card should ignore the entity's forecast entirely. */
  private get _allOpenMeteo(): boolean {
    return this._wantsOpenMeteo && !!this._hourlyDays;
  }

  /**
   * Rebuild `_daily` and `_hourly` from the Open-Meteo fetch.
   *
   * Deliberately produces the same `ForecastItem` shape the weather entity's
   * subscription produces, so every consumer downstream is untouched and there
   * is only ONE place where the two sources can diverge. Called after a
   * successful fetch; the entity's own subscription keeps running and takes
   * over again the moment the source option changes back.
   */
  private _applyOpenMeteoForecast(): void {
    const h = this._hourlyDays;
    if (!h) return;

    const daily: ForecastItem[] = [];
    for (const [date, stat] of [...h.dayStat.entries()].sort()) {
      daily.push({
        datetime: `${date}T00:00:00`,
        condition: stat.condition,
        temperature: stat.hi,
        templow: stat.lo,
        precipitation: stat.precipMm,
        precipitation_probability: h.dayProb.get(date),
      });
    }
    if (daily.length) this._daily = daily;

    // The strip wants a flat run of hours from now on, where `days` is keyed
    // by date; and it labels its first cell "Now", so start at the current
    // hour rather than dropping it.
    const from = Date.now() - 3600_000;
    const hourly: ForecastItem[] = [];
    for (const [, list] of [...h.days.entries()].sort()) {
      for (const p of list) {
        if (p.time < from) continue;
        hourly.push({
          datetime: new Date(p.time).toISOString(),
          condition: p.condition,
          temperature: p.temp,
          precipitation: p.precipMm,
          precipitation_probability: p.precipProb,
        });
      }
    }
    if (hourly.length) this._hourly = hourly;
  }

  private _dayProb(index: number): number | undefined {
    const day = this._daily[index];
    if (!day || !this._hourlyDays) return undefined;
    const p = this._hourlyDays.dayProb.get(localDateKey(new Date(day.datetime)));
    return this._printableProb(day.condition, p);
  }

  /**
   * The chance to print beside a glyph, or undefined to print nothing.
   *
   * Two ways in: a figure worth reading on its own, or a glyph that depicts
   * precipitation — which must never appear over a blank, whatever the number.
   * See WET_CONDITIONS for why the two can disagree.
   */
  private _printableProb(condition: string | undefined, prob: number | undefined): number | undefined {
    if (prob === undefined) return undefined;
    if (prob >= PROB_MIN) return prob;
    return condition && WET_CONDITIONS.has(condition) ? prob : undefined;
  }

  /**
   * The Open-Meteo hour matching `t`, for the strip.
   *
   * The strip's hours come from the Home Assistant weather entity while this
   * data comes from Open-Meteo, so the two series have to be JOINED — and on
   * the hour they start, never on position. The entity's first entry is
   * whatever hour the integration happens to be publishing from, so the arrays
   * do not line up at index 0 and would silently drift by an hour or more.
   */
  private _hourAt(t: Date): HourPoint | undefined {
    if (!this._hourlyDays) return undefined;
    const list = this._hourlyDays.days.get(localDateKey(t));
    if (!list) return undefined;
    const floor = new Date(t);
    floor.setMinutes(0, 0, 0);
    return list.find((h) => h.time === floor.getTime());
  }

  private _openDaySheet(index: number): void {
    // Only the open changes the grid's shape; switching day just swaps content,
    // and reflowing then would make the tiles twitch for no reason.
    if (this._sheetDay === null) {
      window.addEventListener('pointerdown', this._outsideTap, true);
      // Every open starts on temperature; the toggle only sticks for the life
      // of this open.
      this._sheetMode = 'temp';
      void this._reflowGrid(() => { this._sheetDay = index; });
      this._hourScrub = null;
    } else {
      void this._switchDay(index);
    }
    void this._ensureHourly();
  }

  /**
   * Push the card's contents sideways when the day changes — from the arrows or
   * from a different row of the daily list. The day being left accelerates out
   * and fades; the new one settles in from the opposite side, so the direction
   * of travel says which way through the week you moved.
   *
   * Both halves move AT ONCE, which needs a clone: the live element cannot be in
   * two places, and playing the exit before the entrance would leave the card
   * blank for the length of the first half. The clone is appended AFTER the real
   * body so `querySelector` in the post-render positioning still resolves to the
   * live one.
   *
   * Travel is a fraction of the width rather than the whole of it. This is a
   * detail swap inside a card that never moves, not a page turn, and the fade
   * carries most of the change; a full-width slide across dense content reads as
   * a lurch.
   */
  private async _switchDay(next: number): Promise<void> {
    const cur = this._sheetDay;
    if (cur === null || cur === next) { this._hourScrub = null; return; }
    // The whole body moves, date included: the date is what changed.
    await this._pushSwap(next > cur ? 1 : -1, () => { this._sheetDay = next; }, '.sheet-body');
  }

  /**
   * Switch which series the day card charts. The mode is deliberately NOT reset
   * when the day changes — only when the card is closed — so stepping through
   * the week keeps showing whatever the reader asked for.
   */
  private async _setSheetMode(mode: SheetMode): Promise<void> {
    if (mode === this._sheetMode) return;
    // Only the CONTENT moves. The date has not changed, and sliding it out and
    // back in claimed it had — the animation said "new day" when the day was
    // the same.
    await this._pushSwap(
      mode === 'precip' ? 1 : -1,
      () => { this._sheetMode = mode; },
      '.sheet-content',
    );
  }

  /**
   * The card's one content transition, shared by the day change and the series
   * toggle: apply `mutate`, then push the old contents out in direction `dir`
   * while the new ones settle in from the opposite side.
   */
  private async _pushSwap(dir: 1 | -1, mutate: () => void, selector: string): Promise<void> {
    const body = this.renderRoot.querySelector(selector) as HTMLElement | null;
    const stage = body?.parentElement ?? null;
    this._hourScrub = null;

    if (!stage || !body || FruityWeatherCard._reducedMotion()) {
      mutate();
      return;
    }

    // Tapping faster than the animation runs would otherwise stack clones on
    // top of each other.
    stage.querySelectorAll(':scope > .ghost').forEach((g) => g.remove());
    const ghost = body.cloneNode(true) as HTMLElement;
    ghost.classList.add('ghost');
    // The clone is absolutely positioned, so it has to be told where the
    // original sat: not always at the top of its parent, since the content
    // swap leaves the date row above it in place.
    ghost.style.top = `${body.offsetTop}px`;
    stage.appendChild(ghost);

    const travel = Math.min(stage.getBoundingClientRect().width * 0.16, 90);

    mutate();
    await this.updateComplete;

    // Transform and opacity are animated SEPARATELY on each half. Sharing one
    // keyframe set means sharing one easing, and the spring's very fast start
    // brought the arriving day to half opacity while the leaving one was still
    // at 60% — both legible at once, which read as a smear rather than a push.
    // Split, the fades hand over in about 40ms while the slides keep their own,
    // slower curves.
    const out = ghost.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${-dir * travel}px)` }],
      { duration: 230, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
    );
    ghost.animate([{ opacity: 1 }, { opacity: 0 }],
      { duration: 150, easing: 'ease-in', fill: 'forwards' });
    const drop = () => ghost.remove();
    out.addEventListener('finish', drop);
    out.addEventListener('cancel', drop);

    // The `backwards` fill is what holds this offscreen and transparent through
    // the delay; without it the new day would sit at rest, fully opaque, until
    // its animation started, and the swap would read as a jump cut.
    body.animate(
      [{ transform: `translateX(${dir * travel}px)` }, { transform: 'translateX(0)' }],
      { duration: 380, delay: 60, easing: FruityWeatherCard.SPRING, fill: 'backwards' },
    );
    body.animate([{ opacity: 0 }, { opacity: 1 }],
      { duration: 220, delay: 110, easing: 'ease-out', fill: 'backwards' });
  }

  /**
   * Dismiss on a tap anywhere that is not the card, the daily list or the
   * hourly strip. Bound on window in the CAPTURE phase because the regions that
   * would otherwise swallow it — tiles with their own tap actions — stop
   * propagation.
   *
   * The daily list and the strip are excluded because both own a tap that
   * opens or toggles this card. Without that exclusion the capture handler
   * closes first and their own handler immediately reopens, so a tap meant to
   * dismiss plays a close and an open back to back instead of doing nothing.
   */
  private _outsideTap = (ev: Event): void => {
    if (this._sheetDay === null) return;
    const path = ev.composedPath();
    const card = this.renderRoot.querySelector('.daycard');
    const daily = this.renderRoot.querySelector('.panel.daily');
    const strip = this.renderRoot.querySelector('.panel.strip');
    if ((card && path.includes(card))
      || (daily && path.includes(daily))
      || (strip && path.includes(strip))) return;
    this._closeDaySheet();
  };

  private _closeDaySheet(): void {
    window.removeEventListener('pointerdown', this._outsideTap, true);
    this._hourScrub = null;
    void this._reflowGrid(() => { this._sheetDay = null; });
  }

  /**
   * Put the notch level with the selected row. The card itself is grid-placed
   * and never moves, so this is the only thing left to position — and it is
   * measured rather than derived, because the row height depends on how many
   * days the provider returned.
   */
  private _positionArrow(): void {
    const card = this.renderRoot.querySelector('.daycard') as HTMLElement | null;
    const arrow = this.renderRoot.querySelector('.sheet-arrow') as HTMLElement | null;
    const row = this.renderRoot.querySelectorAll('.drow')[this._sheetDay ?? 0] as HTMLElement | undefined;
    if (!card || !arrow || !row) return;
    const c = card.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    // Kept off the card's rounded corners even when the row is at an extreme.
    const y = Math.min(Math.max(r.top + r.height / 2 - c.top, 24), Math.max(c.height - 24, 24));
    // First placement must not animate from the card's top edge; every later
    // one should glide, so the notch reads as travelling to the new day.
    const firstPlacement = !arrow.style.top;
    if (firstPlacement) arrow.style.transition = 'none';
    arrow.style.top = `${Math.round(y)}px`;
    if (firstPlacement) requestAnimationFrame(() => { arrow.style.transition = ''; });
  }

  /** Hours for the day at `index` of the daily list, or [] when unavailable. */
  private _hoursForDay(index: number): HourPoint[] {
    const day = this._daily[index];
    if (!day || !this._hourlyDays) return [];
    return this._hourlyDays.days.get(localDateKey(new Date(day.datetime))) ?? [];
  }

  private get _mapSeries(): { times: number[]; frames: Float32Array[] } {
    const g = this._grid;
    if (!g) return { times: [], frames: [] };
    return this._mapRange === '1h'
      ? { times: g.quarter.times.slice(0, 5), frames: g.quarter.frames.slice(0, 5) }
      : g.hourly;
  }

  /** Map centre: the grid's origin once loaded, otherwise HA's home. The
   *  BASEMAP must not depend on the forecast — Esri tiles and Open-Meteo are
   *  unrelated services, and gating the tiles on the grid turned a missing
   *  forecast into a blank white box. */
  private get _mapCentre(): { lat: number; lon: number } | undefined {
    if (this._grid) return { lat: this._grid.lat0, lon: this._grid.lon0 };
    const lat = this.hass?.config?.latitude;
    const lon = this.hass?.config?.longitude;
    return lat === undefined || lon === undefined ? undefined : { lat, lon };
  }

  private _paintMap(): void {
    const frameEl = this.renderRoot.querySelector<HTMLElement>('.map-frame');
    const centre = this._mapCentre;
    if (!frameEl || !centre) return;
    const rect = frameEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const v = viewportFor(centre.lat, centre.lon, this._zoom, rect.width, rect.height);
    // render() draws the basemap from _mapViewport, which is only known AFTER a
    // layout pass — so the first render has no tiles. Re-render whenever the
    // viewport actually changes; comparing values keeps this from looping.
    const prev = this._mapViewport;
    this._mapViewport = v;
    if (!prev || prev.z !== v.z || prev.originX !== v.originX
        || prev.originY !== v.originY || prev.width !== v.width
        || prev.height !== v.height) {
      this.requestUpdate();
    }
    const canvas = this.renderRoot.querySelector<HTMLCanvasElement>('.map-heat');
    if (!canvas || !this._grid) return;   // basemap only until the forecast lands
    const series = this._mapSeries;
    const n = series.frames.length;
    if (!n) return;
    const t = Math.min(Math.max(this._mapT, 0), n - 1e-6);
    const i0 = Math.floor(t);
    const i1 = Math.min(i0 + 1, n - 1);
    let frame = series.frames[i0];
    if (i1 !== i0) {
      if (!this._mapScratch || this._mapScratch.length !== frame.length) {
        this._mapScratch = new Float32Array(frame.length);
      }
      frame = blendFrames(series.frames[i0], series.frames[i1], t - i0, this._mapScratch);
    }
    paintFrame(canvas, this._grid, frame, v);
  }

  /**
   * Opens/closes the map, animating the tiles it displaces.
   *
   * CSS cannot transition grid placement — a tile that moves from column 3 to
   * column 1 simply appears there — so the neighbours are animated with FLIP:
   * measure every tile First, apply the Last layout, invert each tile with a
   * transform back to where it was, then Play by removing the transform. The
   * map's own box is transitioned in CSS instead, because FLIP would scale it
   * and smear the map raster.
   */
  private async _toggleMap(): Promise<void> {
    const reduced = FruityWeatherCard._reducedMotion();
    await this._reflowGrid(
      () => {
        this._mapOpen = !this._mapOpen;
        if (!this._mapOpen) {
          this._stopPlayback();
          this._mapT = 0;
          this._mapFrame = 0;
          // Zoom is deliberately NOT reset — see _zoom.
        }
      },
      // The map tile animates its own size through CSS; FLIPping it as well
      // would fight that.
      (el) => !el.classList.contains('map'),
    );
    // Expanding IS the request to see it move — a still field asks the user to
    // hunt for a play button to find out what the tile is even for. Held back
    // only when the grid has not arrived yet, in which case _ensureGrid starts
    // it, and when the platform asks for less motion.
    if (this._mapOpen && !reduced) this._autoPlay();
  }

  private static _reducedMotion(): boolean {
    return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }

  /** Overshooting ease, so cards settle into place rather than arriving flat. */
  private static readonly SPRING = 'cubic-bezier(0.34, 1.42, 0.64, 1)';

  /**
   * FLIP the grid across a layout change: measure every child, apply `mutate`,
   * re-measure, then play each child from its old position to its new one.
   *
   * Everything that reflows the grid goes through here — opening or closing the
   * day card, expanding the map — so a card never teleports and every move uses
   * the same spring.
   */
  private async _reflowGrid(
    mutate: () => void,
    include: (el: HTMLElement) => boolean = () => true,
  ): Promise<void> {
    const grid = this.renderRoot.querySelector('.grid');
    const movers = grid ? ([...grid.children] as HTMLElement[]).filter(include) : [];
    const first = new Map(movers.map((el) => [el, el.getBoundingClientRect()]));

    mutate();
    await this.updateComplete;
    if (FruityWeatherCard._reducedMotion()) return;

    // Children present before AND after; a card that has just appeared has no
    // previous box and plays its own entrance instead.
    const survivors = movers.filter((el) => el.isConnected);
    for (const el of survivors) {
      const a = first.get(el)!;
      const b = el.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (!dx && !dy) continue;
      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    // One frame with the inverted transforms committed, then release them.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      for (const el of survivors) {
        if (!el.style.transform) continue;
        el.style.transition = `transform 420ms ${FruityWeatherCard.SPRING}`;
        el.style.transform = '';
        el.addEventListener('transitionend', () => {
          el.style.transition = '';
        }, { once: true });
      }
    }));
  }

  /** Seconds of wall clock per forecast frame while playing. */
  private static readonly FRAME_SECONDS = 0.9;

  private _togglePlayback(): void {
    if (this._mapPlaying) { this._stopPlayback(); return; }
    this._mapPlaying = true;
    this._mapLast = performance.now();
    this._mapRaf = requestAnimationFrame(this._advance);
  }

  /**
   * Start the loop from the beginning if it is not already running and there is
   * something to animate. Separate from _togglePlayback because that one is a
   * toggle: called on an already-playing map it would PAUSE, which is the
   * opposite of what expanding should do.
   */
  private _autoPlay(): void {
    if (this._mapPlaying) return;
    if (this._mapSeries.frames.length < 2) return;
    this._mapT = 0;
    this._mapFrame = 0;
    this._togglePlayback();
  }

  /**
   * Advances the playhead by real elapsed time and repaints every frame, so the
   * field morphs continuously instead of cutting between hours. The canvas and
   * the progress bar are written directly — going through Lit here would
   * re-render the whole basemap on every tick.
   */
  private _advance = (now: number): void => {
    // The playhead spans the GAPS between frames, not the frames: frame 0 sits
    // at 0% of the track and frame n-1 at 100%, so the loop is n-1 long. It
    // used to wrap at n, which ran the fill 8% past the end of the track while
    // _paintMap clamped the canvas — the picture froze for a beat, then the
    // bar snapped back from 108%.
    const span = Math.max(1, this._mapSeries.frames.length - 1);
    const dt = Math.min((now - this._mapLast) / 1000, 0.25);
    this._mapLast = now;
    this._mapT = (this._mapT + dt / FruityWeatherCard.FRAME_SECONDS) % span;
    this._paintMap();
    this._syncMapBar();
    const rounded = Math.min(Math.round(this._mapT), span);
    if (rounded !== this._mapFrame) this._mapFrame = rounded;
    this._mapRaf = requestAnimationFrame(this._advance);
  };

  /**
   * The ONLY writer of the progress fill's width — deliberately not a `style`
   * binding in render().
   *
   * With both, the two fought: this method writes the continuous position 60
   * times a second, then every crossing of a frame boundary changed _mapFrame,
   * Lit re-rendered, and its binding replaced the inline style with the
   * ROUNDED position. Measured as a +4.3% jerk forward followed 12 ms later by
   * a 4.0% snap back, once per frame — visible only in motion, which is why it
   * never showed up in a screenshot. updated() calls this after every render
   * so the bar still repaints when Lit rebuilds the element.
   */
  private _syncMapBar(): void {
    const fill = this.renderRoot.querySelector<HTMLElement>('.map-track-fill');
    if (!fill) return;
    const span = Math.max(1, this._mapSeries.frames.length - 1);
    const pct = Math.min(100, Math.max(0, (this._mapT / span) * 100));
    fill.style.width = `${pct}%`;
  }

  private _stopPlayback(): void {
    if (this._mapRaf !== undefined) cancelAnimationFrame(this._mapRaf);
    this._mapRaf = undefined;
    this._mapPlaying = false;
  }

  /**
   * Zoom bounds. The floor is set by GRID COVERAGE, not by taste: the expanded
   * map is now full grid width (878 px of frame at the 5-column popup), and at
   * z7 that is 689 km across while the 143-point grid only spans ~411 km — the
   * field would stop mid-frame. z8 shows 345 km, comfortably inside it. Above
   * 11 the forecast is magnified far past its ~34 km sample spacing, which
   * invents detail that is not there.
   */
  private static readonly ZOOM_MIN = 8;
  private static readonly ZOOM_MAX = 11;
  private static readonly ZOOM_KEY = 'fruity-weather-card:map-zoom';

  /**
   * Effective zoom, shared by both states — expanding grows the box, it does
   * not change scale. ZOOM_MIN is the default so the card opens on the widest
   * view; anything the user picks from there overrides it.
   */
  private get _zoom(): number {
    return this._mapZoom
      ?? this._config?.map_zoom
      ?? FruityWeatherCard.ZOOM_MIN;
  }

  /**
   * The chosen zoom outlives the expanded view AND the page: closing the tile
   * used to throw it away, so every glance at the map started zoomed all the
   * way out again.
   */
  private static _loadZoom(): number | undefined {
    try {
      const raw = localStorage.getItem(FruityWeatherCard.ZOOM_KEY);
      if (raw === null) return undefined;
      const z = Number(raw);
      if (!Number.isFinite(z)) return undefined;
      return Math.min(FruityWeatherCard.ZOOM_MAX,
        Math.max(FruityWeatherCard.ZOOM_MIN, Math.round(z)));
    } catch {
      return undefined;   // private mode / storage disabled
    }
  }

  private _zoomBy(delta: number): void {
    const next = Math.min(
      FruityWeatherCard.ZOOM_MAX,
      Math.max(FruityWeatherCard.ZOOM_MIN, this._zoom + delta),
    );
    if (next === this._zoom) return;
    this._mapZoom = next;
    try {
      localStorage.setItem(FruityWeatherCard.ZOOM_KEY, String(next));
    } catch { /* nothing to do — the zoom still applies for this session */ }
  }

  private _setRange(range: '1h' | '12h'): void {
    if (this._mapRange === range) return;
    this._mapRange = range;
    this._mapT = 0;
    this._mapFrame = 0;
    this._paintMap();
    this._syncMapBar();
  }

  private _scrub(ev: PointerEvent): void {
    const bar = ev.currentTarget as HTMLElement;
    const r = bar.getBoundingClientRect();
    const n = this._mapSeries.frames.length;
    const f = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
    this._stopPlayback();
    this._mapT = f * (n - 1);
    this._mapFrame = Math.round(this._mapT);
    this._paintMap();
    this._syncMapBar();
  }

  private _unsubscribe(): void {
    this._unsubHourly?.();
    this._unsubDaily?.();
    this._unsubHourly = undefined;
    this._unsubDaily = undefined;
    this._subscribedTo = undefined;
  }

  /* ---------------------------------------------------------- tap actions */

  /**
   * A click handler for one region, or `undefined` when nothing is configured
   * — returning undefined rather than a no-op keeps `?tappable=` and the
   * pointer cursor honest about which regions actually do something.
   *
   * The pointer-position check is for the hourly strip: it scrolls
   * horizontally, and a drag ends in a `click` that would otherwise navigate
   * away mid-swipe. 8px is below any deliberate tap wobble.
   */
  private _tap(region: TapRegion): ((ev: Event) => void) | undefined {
    const cfg = this._config?.tap_actions?.[region];
    if (!cfg || cfg.action === 'none') return undefined;
    return (ev: Event) => {
      ev.stopPropagation();
      const p = this._pointerDownAt;
      const e = ev as MouseEvent;
      if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8) return;
      this._runAction(cfg);
    };
  }

  private _pointerDownAt?: { x: number; y: number };

  private _markPointer = (ev: PointerEvent): void => {
    this._pointerDownAt = { x: ev.clientX, y: ev.clientY };
  };

  /** Shared with _tap: a drag that ends over a target is not a tap on it. */
  private _movedSincePointer(ev: Event): boolean {
    const p = this._pointerDownAt;
    const e = ev as MouseEvent;
    return !!p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8;
  }

  /**
   * Hand-rolled rather than pulled from custom-card-helpers: the card has no
   * runtime dependencies beyond lit, and this is the whole surface HA's own
   * handler exposes for a tap.
   */
  private _runAction(cfg: ActionConfig): void {
    switch (cfg.action) {
      case 'navigate': {
        if (!cfg.navigation_path) return;
        history.pushState(null, '', cfg.navigation_path);
        // HA's router listens for this; a bare pushState changes the URL
        // without rendering anything.
        window.dispatchEvent(new Event('location-changed', { composed: true }));
        break;
      }
      case 'more-info': {
        const entityId = cfg.entity ?? this._config?.entity;
        if (!entityId) return;
        this.dispatchEvent(new CustomEvent('hass-more-info', {
          detail: { entityId }, bubbles: true, composed: true,
        }));
        break;
      }
      case 'url':
        if (cfg.url_path) window.open(cfg.url_path, '_blank', 'noopener');
        break;
      case 'toggle':
        if (cfg.entity) {
          this.hass?.callService('homeassistant', 'toggle', { entity_id: cfg.entity });
        }
        break;
      case 'perform-action':
      case 'call-service': {
        const full = cfg.perform_action ?? cfg.service;
        if (!full?.includes('.')) return;
        const [domain, service] = full.split('.', 2);
        this.hass?.callService(domain, service, cfg.data ?? {}, cfg.target);
        break;
      }
      default:
        break;
    }
  }

  /**
   * Forecasts come over the websocket, not from entity attributes — modern HA
   * weather entities no longer carry a `forecast` attribute at all.
   */
  private async _subscribe(): Promise<void> {
    if (!this.hass || !this._config) return;
    const entity = this._config.entity;
    this._unsubscribe();
    this._subscribedTo = entity;

    const sub = async (type: 'hourly' | 'daily', assign: (f: ForecastItem[]) => void) => {
      try {
        return await this.hass!.connection.subscribeMessage<ForecastEvent>(
          (ev) => assign(ev.forecast ?? []),
          { type: 'weather/subscribe_forecast', entity_id: entity, forecast_type: type },
        );
      } catch (err) {
        // A provider that only supports one forecast type is a normal condition,
        // not a failure — the matching section just stays empty.
        console.warn(`fruity-weather-card: no ${type} forecast for ${entity}`, err);
        return undefined;
      }
    };

    // The entity's own forecast is always kept, even when it is not what gets
    // drawn: it is the fallback if the Open-Meteo fetch fails, and the card
    // switches straight back to it if the source option changes.
    //
    // Assigning `_daily`/`_hourly` unconditionally here was a bug — under
    // `forecast_source: open-meteo` an entity push would silently replace the
    // Open-Meteo data until the next hourly refetch, so the card would sit on
    // whichever provider had spoken most recently.
    this._unsubHourly = await sub('hourly', (f) => {
      this._entityHourly = f;
      if (!this._wantsOpenMeteo) this._hourly = f;
    });
    this._unsubDaily = await sub('daily', (f) => {
      this._entityDaily = f;
      if (!this._wantsOpenMeteo) this._daily = f;
    });
  }

  // -- data accessors -------------------------------------------------------

  private get _weather(): HassEntity | undefined {
    return this.hass?.states[this._config!.entity];
  }

  /** Read an optional override sensor, falling back to a weather attribute. */
  private _override(key: keyof CurrentConfig, attr?: string): number | undefined {
    const id = this._config?.current?.[key];
    if (id) {
      const s = this.hass?.states[id];
      if (s && s.state !== 'unavailable' && s.state !== 'unknown') return num(s.state);
    }
    if (this._allOpenMeteo) {
      const c = this._hourlyDays!.current;
      if (c) {
        const fromOM: Partial<Record<keyof CurrentConfig, number | undefined>> = {
          temperature: c.temp,
          feels_like: c.apparentTemp,
          humidity: c.humidity,
          wind_speed: c.windSpeed,
          wind_gust: c.windGust,
          wind_bearing: c.windBearing,
        };
        if (key in fromOM) return fromOM[key];
      }
      // dew_point and precipitation_today are not requested — the first is
      // derivable but not worth a field, the second needs a rain gauge to be
      // meaningful. Both fall through to the entity below.
    }
    return attr ? num(this._weather?.attributes[attr]) : undefined;
  }

  /**
   * Present condition slug, from whichever source is configured. The hero's
   * artwork and its caption both read this.
   */
  private get _currentCondition(): string {
    if (this._allOpenMeteo) {
      const c = this._hourlyDays!.current;
      if (c) return c.condition;
    }
    return this._weather?.state ?? '';
  }

  /**
   * Unit that belongs to whatever _override() actually returned. Critical: when
   * an override sensor supplies the value, the unit must come from that sensor
   * too — HA's `unit_system.wind_speed` describes the weather entity, not a
   * local station, and mixing them silently mislabels km/h readings as m/s.
   */
  private _overrideUnit(key: keyof CurrentConfig, weatherAttr?: string): string | undefined {
    const id = this._config?.current?.[key];
    if (id) {
      const s = this.hass?.states[id];
      if (s && s.state !== 'unavailable' && s.state !== 'unknown') {
        return s.attributes?.unit_of_measurement;
      }
    }
    return weatherAttr ? this._weather?.attributes[weatherAttr] : undefined;
  }

  private get _isNight(): boolean {
    const sun = this.hass?.states[this._config?.sun_entity ?? 'sun.sun'];
    return sun ? sun.state === 'below_horizon' : false;
  }

  private _sunTimes(): { rising?: Date; setting?: Date } {
    const sun = this.hass?.states[this._config?.sun_entity ?? 'sun.sun'];
    if (!sun) return {};
    const r = sun.attributes.next_rising ? new Date(sun.attributes.next_rising) : undefined;
    const s = sun.attributes.next_setting ? new Date(sun.attributes.next_setting) : undefined;
    return { rising: r, setting: s };
  }

  /**
   * Split a time into digits and AM/PM so the suffix can be set smaller, the
   * way iOS does ("6:22" large, "AM" small, no space between them). On 24-hour
   * locales `suffix` is empty and the digits simply render alone.
   */
  private _fmtTimeParts(d: Date, withMinutes = true): { time: string; suffix: string } {
    const lang = this.hass?.locale?.language ?? navigator.language;
    const fmt = new Intl.DateTimeFormat(lang, withMinutes
      ? { hour: 'numeric', minute: '2-digit' }
      : { hour: 'numeric' });
    let time = '';
    let suffix = '';
    for (const p of fmt.formatToParts(d)) {
      if (p.type === 'dayPeriod') suffix = p.value.toUpperCase();
      else if (p.type !== 'literal' || time) time += p.value;
    }
    return { time: time.trim(), suffix };
  }

  /**
   * Strip label in iOS form: hour and period marker closed up with no space
   * ("11PM"), the marker set smaller. On 24-hour locales the marker is empty
   * and only the hour renders.
   */
  private _timeLabel(d: Date, withMinutes = false): TemplateResult {
    const { time, suffix } = this._fmtTimeParts(d, withMinutes);
    return html`${time}${suffix ? html`<span class="ap">${suffix}</span>` : nothing}`;
  }

  /**
   * Geometry for the sun-path graphic: a full 24h cycle where daylight occupies
   * the arc above the horizon and night dips below it, plus the sun's current
   * position along that curve.
   *
   * Daylight is bracketed by a real rise/set pair. At night `next_rising` comes
   * first so the pair is (rising, setting); during the day the sun rose
   * yesterday, so we step `next_rising` back 24h to get the pair around now.
   */
  private _sunArc(): {
    dayPath: string; nightPath: string; dotX: number; dotY: number; isUp: boolean;
  } | undefined {
    const { rising, setting } = this._sunTimes();
    if (!rising || !setting) return undefined;

    const DAY_MS = 86_400_000;
    const now = Date.now();

    // iOS draws a FIXED decorative arc and only the sun marker moves along it.
    // The crossings are SYMMETRIC about the tile's centre, so the hump peaks at
    // exactly 50% — an asymmetric pair (0.11/0.76) pushed the peak left of
    // centre and read as lopsided against the reference.
    const riseF = 0.2;
    const setF = 0.8;

    // Horizon sits below centre so the daytime hump is taller than the night dip.
    const HY = 26, UP = 17, DOWN = 11, W = 100;
    const elev = (x: number): number => {
      if (x >= riseF && x <= setF) return Math.sin(Math.PI * (x - riseF) / (setF - riseF));
      if (x < riseF) return -Math.sin(Math.PI * ((riseF - x) / (2 * riseF)));
      return -Math.sin(Math.PI * ((x - setF) / (2 * (1 - setF))));
    };
    const yOf = (e: number): number => HY - e * (e >= 0 ? UP : DOWN);

    const pathBetween = (x0: number, x1: number, steps: number): string => {
      const pts: string[] = [];
      for (let i = 0; i <= steps; i++) {
        const x = x0 + ((x1 - x0) * i) / steps;
        pts.push(`${(x * W).toFixed(2)},${yOf(elev(x)).toFixed(2)}`);
      }
      return `M${pts.join(' L')}`;
    };

    // Marker position comes from the real clock: linear across daylight, then
    // wrapping right-edge → left-edge through the night.
    const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
    let xNow: number;
    if (setting < rising) {
      // Daytime: the sun rose this morning (next_rising is tomorrow's).
      const rise = rising.getTime() - DAY_MS;
      const f = clamp01((now - rise) / (setting.getTime() - rise));
      xNow = riseF + f * (setF - riseF);
    } else {
      // Night: it set at yesterday-relative `setting`, rises at `rising`.
      const set0 = setting.getTime() - DAY_MS;
      const f = clamp01((now - set0) / (rising.getTime() - set0));
      xNow = f < 0.5 ? setF + (f / 0.5) * (1 - setF) : ((f - 0.5) / 0.5) * riseF;
    }
    const eNow = elev(xNow);

    return {
      nightPath: pathBetween(0, 1, 96),
      dayPath: pathBetween(riseF, setF, 48),
      dotX: xNow * 100,
      dotY: (yOf(eNow) / 44) * 100,
      isUp: eNow >= 0,
    };
  }

  private _iconUrl(name: string): string {
    // A configured folder wins, so a personal icon set (e.g. SF Symbols
    // exports) can replace the bundled artwork without rebuilding.
    const custom = this._config?.icons_path;
    if (custom) return `${custom.replace(/\/+$/, '')}/${name}.png`;
    // Otherwise resolve against the bundle URL — Vite inlines these as data
    // URIs, so the bundled set costs no extra requests.
    return new URL(`../icons/${name}.png`, import.meta.url).href;
  }

  // -- render ---------------------------------------------------------------

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const w = this._weather;
    if (!w) {
      return html`<ha-card><div class="err">Entity ${this._config.entity} not found</div></ha-card>`;
    }

    return html`
      <ha-card class=${this._isNight ? 'night' : 'day'}>
        ${this._renderHero(w)}
        ${this._renderHourly()}
        <div class="grid">
          ${this._renderDaily()}
          ${this._renderDaySheet()}
          ${this._renderTiles()}
        </div>
      </ha-card>
    `;
  }

  /**
   * Scene artwork behind the hero, matched to the condition. HA reports most
   * conditions identically day and night, so those get a `-night` variant
   * chosen off the sun entity; `clear-night` already encodes it, and
   * `exceptional` has no artwork of its own so it borrows cloudy.
   */
  private _heroScene(state: string): string | null {
    const dayNight = [
      'partlycloudy', 'cloudy', 'fog', 'rainy', 'pouring', 'lightning',
      'lightning-rainy', 'hail', 'snowy', 'snowy-rainy', 'windy', 'windy-variant',
    ];
    const night = this._isNight;
    // The sun entity decides day/night, never the condition string: met.no can
    // sit on `clear-night` for the better part of an hour after sunrise.
    if (state === 'clear-night' || state === 'sunny') {
      return night ? 'clear-night' : 'sunny';
    }
    if (dayNight.includes(state)) return state + (night ? '-night' : '');
    if (state === 'exceptional') return night ? 'cloudy-night' : 'cloudy';
    return null;
  }

  private _renderHero(w: HassEntity): TemplateResult {
    const name = this._config!.name
      ?? w.attributes.friendly_name
      ?? this._config!.entity;
    const temp = this._override('temperature', 'temperature');
    const today = this._daily[0];
    const hi = num(today?.temperature);
    const lo = num(today?.templow);
    const state = this._currentCondition || w.state;
    const label = CONDITION_LABEL[state] ?? state;

    const tap = this._tap('hero');
    const scene = this._heroScene(state);
    const c = this._config!;
    const px = (v: number | string) => (typeof v === 'number' ? `${v}px` : v);
    const vars: string[] = [];
    const bgBase = (c.backgrounds_path ?? HERO_BASE).replace(/\/+$/, '');
    if (scene) vars.push(`--fwc-hero: url("${bgBase}/hero-${scene}.jpg?v=2")`);
    if (c.hero_bleed_x !== undefined) vars.push(`--fwc-hero-bleed-x: ${px(c.hero_bleed_x)}`);
    if (c.hero_bleed_top !== undefined) vars.push(`--fwc-hero-bleed-top: ${px(c.hero_bleed_top)}`);
    if (c.hero_extend !== undefined) vars.push(`--fwc-hero-extend: ${px(c.hero_extend)}`);
    if (c.hero_radius !== undefined) vars.push(`--fwc-hero-radius: ${px(c.hero_radius)}`);

    return html`
      <div class="hero ${scene ? 'has-bg' : ''}" ?tappable=${!!tap}
           style=${vars.join('; ')}
           @pointerdown=${this._markPointer} @click=${tap}>
        <div class="loc">${name}</div>
        <div class="temp">${round(temp)}<span class="deg">°</span></div>
        <div class="cond">${label}</div>
        <div class="hilo">H:${round(hi)}° L:${round(lo)}°</div>
      </div>
    `;
  }

  /** 24-hour strip with sunrise/sunset woven in at their real position. */
  private _renderHourly(): TemplateResult | typeof nothing {
    if (!this._hourly.length) return nothing;
    const hours = this._config!.hourly_hours ?? 24;
    const now = Date.now();
    const end = now + hours * 3600_000;

    const cells: HourCell[] = [];
    this._hourly.forEach((f, i) => {
      const t = new Date(f.datetime);
      if (t.getTime() > end) return;
      // The glyph is taken from the SAME forecast as the percentage, not from
      // the weather entity, because the two models disagree and putting both
      // opinions in one cell shows it. Observed: met.no called 04:00 `rainy`
      // with 0.5mm while Open-Meteo's ensemble put the chance at 05:00-06:00
      // and gave 04:00 5% — so the cell drew rain above a blank, and the two
      // cells that did carry a figure drew no rain. Whichever model is right,
      // one cell must speak with one voice. The temperature stays on the
      // entity: it is the card's headline source everywhere else, and a
      // temperature cannot visibly contradict a probability the way a glyph can.
      const om = this._hourAt(t);
      const condition = om?.condition ?? f.condition ?? '';
      cells.push({
        kind: 'hour',
        time: t,
        label: i === 0 ? html`Now` : this._timeLabel(t),
        condition,
        temp: num(f.temperature),
        prob: this._printableProb(condition, om?.precipProb),
      });
    });

    const { rising, setting } = this._sunTimes();
    for (const [d, ev] of [[rising, 'sunrise'], [setting, 'sunset']] as const) {
      if (d && d.getTime() > now && d.getTime() < end) {
        cells.push({ kind: 'sun', time: d, label: this._timeLabel(d, true), event: ev });
      }
    }
    cells.sort((a, b) => a.time.getTime() - b.time.getTime());

    // iOS heads the strip with a one-line plain-English summary.
    const gust = this._override('wind_gust');
    const gustUnit = this._overrideUnit('wind_gust', 'wind_speed_unit') ?? 'km/h';
    const cond = CONDITION_LABEL[this._currentCondition] ?? '';
    const summary = cond
      ? `${cond} conditions expected for the rest of the day.`
        + (gust !== undefined ? ` Wind gusts are up to ${round(gust)} ${gustUnit}.` : '')
      : '';

    // Tapping the strip opens TODAY's detail card by default — the strip and
    // that card show the same hours, so it is the obvious place to go for more
    // of what you are already looking at, and it matches tapping the first row
    // of the daily list. `tap_actions.hourly` still overrides it for anyone who
    // wants somewhere else; `action: none` disables it entirely.
    const configured = this._tap('hourly');
    const explicit = this._config?.tap_actions?.hourly;
    const tap = configured
      ?? (explicit?.action === 'none' ? undefined : (ev: Event) => {
        ev.stopPropagation();
        if (this._movedSincePointer(ev)) return;
        if (this._sheetDay === 0) this._closeDaySheet();
        else this._openDaySheet(0);
      });
    return html`
      <div class="panel strip" ?tappable=${!!tap}
           @pointerdown=${this._markPointer} @click=${tap}>
        ${summary ? html`<div class="strip-summary">${summary}</div>` : nothing}
        <div class="row">
          ${cells.map((c) => c.kind === 'sun'
            ? html`
                <div class="cell">
                  <div class="cell-label">${c.label}</div>
                  <img class="cell-icon" src=${this._iconUrl(ICON_SUN_EVENT[c.event])} alt=${c.event} />
                  <div class="cell-prob"></div>
                  <div class="cell-val sun">${c.event === 'sunrise' ? 'Sunrise' : 'Sunset'}</div>
                </div>`
            : html`
                <div class="cell">
                  <div class="cell-label">${c.label}</div>
                  <img class="cell-icon" src=${this._iconUrl(iconFor(c.condition, this._nightAt(c.time)))} alt=${c.condition} />
                  <div class="cell-prob">${c.prob === undefined ? nothing : html`${Math.round(c.prob)}%`}</div>
                  <div class="cell-val">${round(c.temp)}°</div>
                </div>`)}
        </div>
      </div>
    `;
  }

  /**
   * Whether the sun is below the horizon at `t`.
   *
   * Which of next_rising/next_setting comes first tells us the CURRENT state:
   * if the sun rises before it sets, it must be down right now. From there the
   * next event is the only boundary inside the 24h window we render.
   */
  private _nightAt(t: Date): boolean {
    // That day's OWN sunrise and sunset, when the forecast has them. This is
    // the only branch that is right beyond tomorrow morning.
    const sun = this._hourlyDays?.daySun.get(localDateKey(t));
    if (sun) {
      const ms = t.getTime();
      return ms < sun.rise || ms >= sun.set;
    }

    // Fallback for a day the forecast does not cover, or before it has loaded.
    // `sun.sun` publishes only the NEXT rising and setting — a single window —
    // so this is correct until tomorrow's sunrise and then assumes daylight
    // forever after. That is why the branch above exists: it left every night
    // hour from tomorrow evening onward wearing daytime artwork.
    const { rising, setting } = this._sunTimes();
    if (!rising || !setting) return this._isNight;
    if (rising < setting) {
      // Night now; daylight resumes at `rising` and lasts until `setting`.
      return t < rising || t >= setting;
    }
    // Daylight now; night starts at `setting` and lasts until `rising`.
    return t >= setting && t < rising;
  }

  private _renderDaily(): TemplateResult | typeof nothing {
    const days = this._daily.slice(0, this._config!.daily_days ?? 10);
    if (!days.length) return nothing;

    /*
     * The panel is a FIXED two-tile height however many rows it holds, so the
     * rows shrink as `daily_days` grows. Measured: 6 rows are 50px and take the
     * glyph and its chance comfortably; 10 rows are 30px, and the pair needs 36,
     * so the caption printed over the row beneath it.
     *
     * This only became visible when `forecast_source: open-meteo` arrived —
     * met.no publishes six daily entries, so `daily_days: 10` had never actually
     * produced ten rows before. Dropping the caption is the graceful failure:
     * more days, or the chances, but the panel cannot hold both.
     */
    const roomForProb = days.length <= 7;

    const lows = days.map((d) => num(d.templow)).filter((n): n is number => n !== undefined);
    const highs = days.map((d) => num(d.temperature)).filter((n): n is number => n !== undefined);
    const min = Math.min(...lows, ...highs);
    const max = Math.max(...lows, ...highs);
    const span = Math.max(max - min, 1);
    const nowTemp = this._override('temperature', 'temperature');
    const lang = this.hass?.locale?.language ?? navigator.language;

    const tap = this._tap('daily');
    return html`
      <div class="panel daily" ?tappable=${!!tap}
           @pointerdown=${this._markPointer} @click=${tap}>
        <div class="panel-head">${days.length}-DAY FORECAST</div>
        ${days.map((d, i) => {
          const lo = num(d.templow);
          const hi = num(d.temperature);
          const t = new Date(d.datetime);
          const day = i === 0 ? 'Today' : t.toLocaleDateString(lang, { weekday: 'short' });
          const left = lo === undefined ? 0 : ((lo - min) / span) * 100;
          const width = (lo === undefined || hi === undefined) ? 0 : ((hi - lo) / span) * 100;
          // The reference marks the current temperature on today's row only.
          const dot = i === 0 && nowTemp !== undefined
            ? ((nowTemp - min) / span) * 100
            : undefined;
          return html`
            <div class="drow" tappable
                 @pointerdown=${this._markPointer}
                 @click=${(e: Event) => {
                   // The panel may carry its own tap_action; a row tap is the
                   // more specific intent, so it wins and does not bubble.
                   e.stopPropagation();
                   if (this._movedSincePointer(e)) return;
                   // Toggle: the card has no dismiss chrome, and tapping the
                   // row that opened it is the obvious way back.
                   if (this._sheetDay === i) this._closeDaySheet();
                   else this._openDaySheet(i);
                 }}>
              <div class="dday">${day}</div>
              <div class="dcond">
                <img class="dicon" src=${this._iconUrl(iconFor(d.condition, i === 0 && this._isNight))} alt=${d.condition ?? ''} />
                ${(() => {
                  if (!roomForProb) return nothing;
                  const p = this._dayProb(i);
                  return p === undefined ? nothing : html`<span class="dprob">${Math.round(p)}%</span>`;
                })()}
              </div>
              <div class="dlo">${round(lo)}°</div>
              <div class="track">
                <div class="bar" style=${`left:${left}%;width:${width}%;background:linear-gradient(90deg, ${tempColor(lo ?? min)}, ${tempColor(hi ?? max)})`}></div>
                ${dot !== undefined
                  ? html`<div class="dot" style=${`left:${Math.min(Math.max(dot, 0), 100)}%`}></div>`
                  : nothing}
              </div>
              <div class="dhi">${round(hi)}°</div>
            </div>
          `;
        })}
      </div>
    `;
  }

  /**
   * The day-detail card: that day's high and low, a row of condition glyphs and
   * an hourly temperature curve. It is a GRID CARD, not an overlay — it takes
   * three columns beside the daily list and pushes the tiles along, so nothing
   * is hidden behind it and its position never moves. Only the notch travels,
   * to point at whichever row is selected.
   *
   * The H/L printed here come from the CURVE, not from the daily list row, so
   * the numbers and the picture always agree. They can differ by a degree or
   * two from the row because the row is the Home Assistant weather entity while
   * the curve is Open-Meteo — see hourly-source.ts for why.
   */
  private _renderDaySheet(): TemplateResult | typeof nothing {
    const index = this._sheetDay;
    if (index === null) return nothing;
    const days = this._daily.slice(0, this._config!.daily_days ?? 10);
    const day = days[index];
    if (!day) return nothing;

    const lang = this.hass?.locale?.language ?? navigator.language;
    const date = new Date(day.datetime);
    const hours = this._hoursForDay(index);
    const unit = this.hass?.config?.unit_system?.temperature ?? '°C';

    return html`
      <div class="daycard">
        <svg class="sheet-arrow" viewBox="0 0 26 36" aria-hidden="true">
          <polygon points="26,0 1,18 26,36" />
          <polyline points="26,0 1,18 26,36" />
        </svg>
          <button class="snav prev" ?disabled=${index === 0}
                  @click=${() => this._openDaySheet(index - 1)}>
            ${svg`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M15 5 L8 12 L15 19" /></svg>`}
          </button>
          <button class="snav next" ?disabled=${index >= days.length - 1}
                  @click=${() => this._openDaySheet(index + 1)}>
            ${svg`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M9 5 L16 12 L9 19" /></svg>`}
          </button>
          <button class="snav mode mtemp ${this._sheetMode === 'temp' ? 'on' : ''}"
                  title="Temperature" aria-label="Temperature"
                  aria-pressed=${this._sheetMode === 'temp'}
                  @click=${() => this._setSheetMode('temp')}>
            ${svg`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z" /></svg>`}
          </button>
          <button class="snav mode mprecip ${this._sheetMode === 'precip' ? 'on' : ''}"
                  title="Chance of precipitation" aria-label="Chance of precipitation"
                  aria-pressed=${this._sheetMode === 'precip'}
                  @click=${() => this._setSheetMode('precip')}>
            ${svg`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M12 3.5c3.2 3.6 5.5 6.6 5.5 9.4a5.5 5.5 0 0 1-11 0c0-2.8 2.3-5.8 5.5-9.4z" /></svg>`}
          </button>
          <div class="sheet-stage">
            <div class="sheet-body">
              <div class="sheet-date">
                ${date.toLocaleDateString(lang, {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </div>
              <div class="sheet-content">${this._renderSheetBody(hours, unit, day)}</div>
            </div>
          </div>
      </div>
    `;
  }

  private _renderSheetBody(
    hours: HourPoint[],
    unit: string,
    day: ForecastItem,
  ): TemplateResult {
    if (this._hourlyPending && !hours.length) {
      return html`<div class="sheet-note">Loading hourly forecast…</div>`;
    }
    if (this._hourlyError && !hours.length) {
      return html`
        <div class="sheet-note">
          Hourly forecast unavailable.
          <button class="sheet-retry" @click=${() => this._ensureHourly(true)}>Retry</button>
        </div>
      `;
    }
    if (!hours.length) {
      return html`<div class="sheet-note">No hourly forecast for this day.</div>`;
    }

    const precip = this._sheetMode === 'precip';
    const suffix = precip ? '%' : '°';
    const values = hours.map((h) => (precip ? h.precipProb : h.temp));
    const hi = Math.max(...values);
    const lo = Math.min(...values);
    const hiAt = hours[values.indexOf(hi)];
    const loAt = hours[values.indexOf(lo)];

    let axisLo: number;
    let axisHi: number;
    const ticks: number[] = [];
    if (precip) {
      // Probability is drawn against the FULL 0-100 range, never scaled to the
      // day's own values. A dry day would otherwise be rescaled until a 3%
      // wobble filled the box and looked like weather; against a fixed scale a
      // flat line along the bottom is the honest picture.
      axisLo = 0;
      axisHi = 100;
      ticks.push(100, 50, 0);
    } else {
      // Round the axis outward to whole 5s so the gridlines read as clean
      // values, and keep a floor on the span or a flat day fills the box with
      // noise.
      const step = 5;
      axisLo = Math.floor(lo / step) * step;
      axisHi = Math.ceil(hi / step) * step;

      // At most four labels. Only the LABELS are thinned — the bounds above
      // stay rounded tight to the day's own range, so the curve keeps filling
      // the box. Widening the scale instead (picking a coarser step and
      // re-rounding to it) does cut the label count, but a 31° day was scaled
      // to 40° and the curve shrank to two thirds of the height for no reason
      // the reader can see. Labels are multiples of 5 stepped down from the
      // top, so they stay whole numbers whatever the multiplier.
      const MAX_TICKS = 4;
      const span = Math.max(axisHi - axisLo, step);
      let labelStep = step;
      while (Math.floor(span / labelStep) + 1 > MAX_TICKS) labelStep += step;
      for (let v = axisHi; v >= axisLo - 0.001; v -= labelStep) ticks.push(v);
    }
    const axisSpan = Math.max(axisHi - axisLo, precip ? 1 : 5);

    const n = hours.length;
    const x = (i: number) => (n > 1 ? (i / (n - 1)) * 100 : 50);
    const y = (t: number) => ((axisHi - t) / axisSpan) * 100;

    // Hours that have already happened are drawn as history: a dashed, muted
    // curve under a colourless fill, with the glyphs, the hour labels and any
    // H/L marker behind the moment dimmed to match, and a hairline marking now.
    // Only the day containing the current time has a past, so on every other
    // row `nowIdx` stays null and the whole curve renders live.
    //
    // The split is the ACTUAL clock position, not the nearest hour: the point
    // where the two halves meet is interpolated between the hours either side,
    // so the divider tracks through the day rather than jumping every 60
    // minutes, and the seam is invisible because both halves share that point.
    const nowMs = Date.now();
    let nowIdx: number | null = null;
    if (n > 1 && nowMs > hours[0].time && nowMs < hours[n - 1].time) {
      for (let i = 0; i < n - 1; i++) {
        if (nowMs < hours[i + 1].time) {
          nowIdx = i + (nowMs - hours[i].time) / (hours[i + 1].time - hours[i].time);
          break;
        }
      }
    }
    const isPast = (i: number) => nowIdx !== null && i < nowIdx;

    const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    let pastPts = '';
    let livePts = pts;
    let pastArea = '';
    let liveArea = `0,100 ${pts} 100,100`;
    if (nowIdx !== null) {
      const cut = Math.floor(nowIdx);
      const f = nowIdx - cut;
      const nx = x(nowIdx);
      const ny = y(values[cut] + (values[cut + 1] - values[cut]) * f);
      const before = values.slice(0, cut + 1).map((v, i) => `${x(i)},${y(v)}`).join(' ');
      const after = values.slice(cut + 1).map((v, k) => `${x(cut + 1 + k)},${y(v)}`).join(' ');
      pastPts = `${before} ${nx},${ny}`;
      livePts = `${nx},${ny} ${after}`;
      pastArea = `0,100 ${pastPts} ${nx},100`;
      liveArea = `${nx},100 ${livePts} 100,100`;
    }

    // One glyph per third hour: 24 across a pop-up column overlap badly.
    const glyphStep = Math.max(1, Math.round(n / 8));

    // While the curve is being scrubbed the readout follows the finger, so the
    // day's H/L step aside rather than competing with it.
    const s = this._hourScrub !== null ? hours[this._hourScrub] : undefined;

    const sVal = this._hourScrub !== null ? values[this._hourScrub] : undefined;

    return html`
      <div class="sheet-readout ${s ? 'scrubbing' : ''}">
        ${s
          ? html`
              <div class="sheet-hilo scrubbing">
                <img class="sheet-cond"
                     src=${this._iconUrl(iconFor(s.condition, this._nightAt(new Date(s.time))))}
                     alt=${s.condition} />
                <span class="scrub-temp ${precip ? 'precip' : ''}">${round(sVal!)}${suffix}</span>
              </div>
            `
          : precip
            ? html`
                <div class="sheet-hilo">
                  <span class="sheet-hi precip">${round(hi)}%</span>
                </div>
              `
            : html`
                <div class="sheet-hilo">
                  <span class="sheet-hi">${round(hi)}°</span><span class="sheet-lo">${round(lo)}°</span>
                  <img class="sheet-cond"
                       src=${this._iconUrl(iconFor(day.condition, false))} alt="" />
                </div>
              `}
        <div class="sheet-unit">
          ${s
            ? this._clockLabel(new Date(s.time))
            : precip
              ? 'Chance of precipitation'
              : (unit === '°F' ? 'Fahrenheit (°F)' : 'Celsius (°C)')}
        </div>
      </div>

      <div class="sheet-glyphs">
        ${hours.map((h, i) => (i % glyphStep === 0
          ? html`<img class="sglyph ${i === 0 ? 'first' : i === n - 1 ? 'last' : ''} ${isPast(i) ? 'past' : ''}"
                      style=${`left:${x(i)}%`}
                      src=${this._iconUrl(iconFor(h.condition, this._nightAt(new Date(h.time))))}
                      alt=${h.condition} />`
          : nothing))}
      </div>

      <div class="sheet-chart">
        <div class="sheet-plot"
             @pointerdown=${(e: PointerEvent) => this._scrubAt(e, n)}
             @pointermove=${(e: PointerEvent) => this._scrubAt(e, n)}
             @pointerup=${() => { this._hourScrub = null; }}
             @pointercancel=${() => { this._hourScrub = null; }}
             @pointerleave=${() => { this._hourScrub = null; }}>
          ${ticks.map((v) => html`
            <div class="sgl" style=${`top:${y(v)}%`}></div>`)}
          ${nowIdx !== null
            ? html`<div class="now-line" style=${`left:${x(nowIdx)}%`}></div>`
            : nothing}
          <!-- The conditional shapes below use lit's svg tag, not html: a
               nested html template is parsed in the HTML namespace, so its
               polygon comes out as an unknown HTML element and never paints. -->
          <svg class="scurve ${precip ? 'precip' : ''}" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sfill" x1="0" y1="0" x2="0" y2="1">
                ${precip
                  ? svg`
                      <stop offset="0%" stop-color="#5ac8fa" stop-opacity="0.55" />
                      <stop offset="100%" stop-color="#5ac8fa" stop-opacity="0.06" />
                    `
                  : svg`
                      <stop offset="0%" stop-color="#f5a623" stop-opacity="0.75" />
                      <stop offset="55%" stop-color="#57c8c8" stop-opacity="0.40" />
                      <stop offset="100%" stop-color="#3f7fb0" stop-opacity="0.18" />
                    `}
              </linearGradient>
              <linearGradient id="sfillpast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#9ba4a8" stop-opacity="0.26" />
                <stop offset="55%" stop-color="#7d888d" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#68737a" stop-opacity="0.07" />
              </linearGradient>
            </defs>
            ${pastArea ? svg`<polygon points=${pastArea} fill="url(#sfillpast)" />` : nothing}
            <polygon points=${liveArea} fill="url(#sfill)" />
            ${pastPts
              ? svg`<polyline class="past" points=${pastPts} vector-effect="non-scaling-stroke" />`
              : nothing}
            <polyline points=${livePts} vector-effect="non-scaling-stroke" />
          </svg>
          ${precip ? nothing : (() => {
            // H/L belong to temperature. On a probability curve the peak is
            // already the headline figure and a "low" of 0% says nothing, so
            // the markers are dropped rather than relabelled.
            //
            // The caption sits above H and below L, but a peak near the top of
            // the band would push its label into the glyph row and a trough
            // near the bottom would push its label into the hour row. When
            // there is no room on the usual side, put it on the other one.
            const yHi = y(hi);
            const yLo = y(lo);
            const iHi = hours.indexOf(hiAt);
            const iLo = hours.indexOf(loAt);
            return html`
              <div class="smark hi ${yHi < 22 ? 'flip' : ''} ${isPast(iHi) ? 'past' : ''}"
                   style=${`left:${x(iHi)}%; top:${yHi}%`}>
                <span>H</span>
              </div>
              <div class="smark lo ${yLo > 78 ? 'flip' : ''} ${isPast(iLo) ? 'past' : ''}"
                   style=${`left:${x(iLo)}%; top:${yLo}%`}>
                <span>L</span>
              </div>
            `;
          })()}
          ${s
            ? html`
                <div class="scrub-line ${precip ? 'precip' : ''}" style=${`left:${x(this._hourScrub!)}%`}></div>
                <div class="scrub-dot" style=${`left:${x(this._hourScrub!)}%; top:${y(sVal!)}%`}></div>
              `
            : nothing}
        </div>
        <div class="sheet-yaxis">
          ${ticks.map((v) => html`<span style=${`top:${y(v)}%`}>${round(v)}${suffix}</span>`)}
        </div>
      </div>

      <div class="sheet-xaxis">
        ${hours.map((h, i) => (h.hour % 6 === 0 && h.hour !== 0
          ? html`<span class="${i === n - 1 ? 'last' : ''} ${isPast(i) ? 'past' : ''}"
                       style=${`left:${x(i)}%`}>${this._hourLabel(h.hour)}</span>`
          : nothing))}
      </div>
    `;
  }

  /**
   * Slide the scrub readout so it sits over the line it describes, clamped to
   * the sheet so it never hangs off an edge. Measured after render because it
   * needs the readout's own width, which changes with the temperature's digits.
   */
  private _positionReadout(): void {
    const readout = this.renderRoot.querySelector('.sheet-readout') as HTMLElement | null;
    const plot = this.renderRoot.querySelector('.sheet-plot') as HTMLElement | null;
    if (!readout) return;
    if (this._hourScrub === null || !plot) {
      readout.style.transform = 'translateX(0)';
      return;
    }
    const sheet = this.renderRoot.querySelector('.daycard') as HTMLElement | null;
    const n = this._hoursForDay(this._sheetDay ?? 0).length;
    if (!sheet || n < 2) return;
    const frac = this._hourScrub / (n - 1);

    // Measure from rest: a transform still in place would offset the reading.
    readout.style.transform = 'translateX(0)';
    const r = readout.getBoundingClientRect();
    const p = plot.getBoundingClientRect();
    const sh = sheet.getBoundingClientRect();
    const cs = getComputedStyle(sheet);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;

    const centre = p.left + frac * p.width;
    const min = sh.left + padL - r.left;
    const max = sh.right - padR - r.width - r.left;
    const x = Math.min(Math.max(centre - r.width / 2 - r.left, min), Math.max(max, min));
    readout.style.transform = `translateX(${Math.round(x)}px)`;
  }

  /** Nearest hour under the pointer, clamped to the series. */
  private _scrubAt(ev: PointerEvent, n: number): void {
    const box = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    if (!box.width || n < 1) return;
    const i = Math.round(((ev.clientX - box.left) / box.width) * (n - 1));
    const clamped = Math.min(Math.max(i, 0), n - 1);
    if (clamped !== this._hourScrub) this._hourScrub = clamped;
  }

  /** "2:04 PM" in the user's own clock format. */
  private _clockLabel(d: Date): string {
    const tf = this.hass?.locale?.time_format;
    const hour12 = tf === '12' ? true : tf === '24' ? false : undefined;
    const lang = this.hass?.locale?.language ?? navigator.language;
    return new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit', hour12 }).format(d);
  }

  /**
   * "6AM" / "6PM", or 24-hour when that is what the user has set. The period
   * marker is split out so it can be set smaller than the hour, the way the
   * sunrise/sunset tile prints its times.
   */
  private _hourLabel(hour: number): TemplateResult {
    const tf = this.hass?.locale?.time_format;
    const hour12 = tf === '12' ? true : tf === '24' ? false : undefined;
    const lang = this.hass?.locale?.language ?? navigator.language;
    const parts = new Intl.DateTimeFormat(lang, { hour: 'numeric', hour12 })
      .formatToParts(new Date(2000, 0, 1, hour));
    let digits = '';
    let ap = '';
    for (const p of parts) {
      if (p.type === 'dayPeriod') ap = p.value;
      else if (!(p.type === 'literal' && ap)) digits += p.value;
    }
    return html`${digits.trim()}${ap ? html`<span class="ap">${ap}</span>` : nothing}`;
  }

  /**
   * The iOS sunrise/sunset tile: heading, the next event's time with a smaller
   * AM/PM, a full-bleed horizon line crossed by the sun's daily arc, a glowing
   * dot at the sun's current position, and the opposite event underneath.
   */
  private _renderSunTile(
    sunriseFirst: boolean,
    rising?: Date,
    setting?: Date,
  ): TemplateResult {
    const primary = sunriseFirst ? rising : setting;
    const secondary = sunriseFirst ? setting : rising;
    const p = primary ? this._fmtTimeParts(primary) : { time: '--', suffix: '' };
    const s = secondary ? this._fmtTimeParts(secondary) : { time: '--', suffix: '' };
    const arc = this._sunArc();

    const tap = this._tap('sun');
    return html`
      <div class="tile sun-tile" ?tappable=${!!tap}
           @pointerdown=${this._markPointer} @click=${tap}>
        <div class="tile-head">${TILE_ICON.sunrise} ${sunriseFirst ? 'SUNRISE' : 'SUNSET'}</div>
        <div class="tile-value time">
          <span class="digits">${p.time}</span><span class="ampm">${p.suffix}</span>
        </div>
        ${arc
          ? html`
              <div class="sunarc">
                <svg viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden="true">
                  <path class="arc-night" d=${arc.nightPath}></path>
                  <path class="arc-day" d=${arc.dayPath}></path>
                </svg>
                <div class="horizon"></div>
                <div
                  class="sunglow ${arc.isUp ? 'up' : 'down'}"
                  style=${`left:${arc.dotX.toFixed(2)}%;top:${arc.dotY.toFixed(2)}%`}
                ></div>
                <div
                  class="sundot ${arc.isUp ? 'up' : 'down'}"
                  style=${`left:${arc.dotX.toFixed(2)}%;top:${arc.dotY.toFixed(2)}%`}
                ></div>
              </div>`
          : nothing}
        <div class="tile-note sun-note">
          ${sunriseFirst ? 'Sunset: ' : 'Sunrise: '}<span class="digits-sm">${s.time}</span
          ><span class="ampm-sm">${s.suffix}</span>
        </div>
      </div>
    `;
  }

  private _renderTiles(): TemplateResult {
    const { rising, setting } = this._sunTimes();
    const feels = this._override('feels_like', 'apparent_temperature');
    const temp = this._override('temperature', 'temperature');
    const humidity = this._override('humidity', 'humidity');
    const dew = this._override('dew_point', 'dew_point');
    const wind = this._override('wind_speed', 'wind_speed');
    const gust = this._override('wind_gust');
    const bearing = this._override('wind_bearing', 'wind_bearing');
    const rainToday = this._override('precipitation_today');
    const windUnit = this._overrideUnit('wind_speed', 'wind_speed_unit') ?? 'km/h';
    const gustUnit = this._overrideUnit('wind_gust') ?? windUnit;

    const sunriseFirst = rising && setting ? rising < setting : true;

    const feelsNote = (feels === undefined || temp === undefined)
      ? ''
      : Math.abs(feels - temp) < 0.5
        ? 'Similar to the actual temperature.'
        : feels > temp
          ? 'It feels warmer than the actual temperature.'
          : 'It feels cooler than the actual temperature.';

    // Next forecast day that expects any rain — drives the precipitation note.
    const nextWet = this._daily.find((d) => (num(d.precipitation) ?? 0) > 0);

    // iOS writes sub-millimetre amounts as "<1 mm" rather than rounding them
    // away to "0 mm".
    const lang = this.hass?.locale?.language ?? navigator.language;
    const wetAmt = nextWet ? (num(nextWet.precipitation) ?? 0) : undefined;
    const wetQty = wetAmt === undefined
      ? ''
      : `${wetAmt < 1 ? '<1' : Math.round(wetAmt)} mm`;
    // The headline figure is rain that has ALREADY fallen (from the station),
    // while this forecast entry may be for later the SAME day. Saying "next
    // expected … Wed" on a Wednesday next to "0 mm Today" reads as a
    // contradiction, so same-day forecasts are phrased as "more expected".
    const wetIsToday = nextWet
      ? new Date(nextWet.datetime).toDateString() === new Date().toDateString()
      : false;
    const precipNote = !wetQty
      ? 'None expected in the next 10 days.'
      : wetIsToday
        ? `${wetQty} more expected today.`
        : `Next expected is ${wetQty} ${new Date(nextWet!.datetime)
            .toLocaleDateString(lang, { weekday: 'short' })}.`;

    // Siblings of the daily panel in one shared grid — no wrapper, so the
    // arrangement reflows as whole cards rather than rescaling them.
    return html`
        ${this._renderSunTile(sunriseFirst, rising, setting)}
        ${this._renderWindTile(wind, windUnit, gust, gustUnit, bearing)}

        <div class="tile" ?tappable=${!!this._tap('precipitation')}
             @pointerdown=${this._markPointer} @click=${this._tap('precipitation')}>
          <div class="tile-head">${TILE_ICON.drop} PRECIPITATION</div>
          <div class="tile-value">${rainToday === undefined ? '--' : round(rainToday)} mm</div>
          <div class="tile-sub">Today So Far</div>
          <div class="tile-note">${precipNote}</div>
        </div>

        <div class="tile" ?tappable=${!!this._tap('feels_like')}
             @pointerdown=${this._markPointer} @click=${this._tap('feels_like')}>
          <div class="tile-head">${TILE_ICON.thermometer} FEELS LIKE</div>
          <div class="tile-value">${round(feels)}°</div>
          <div class="tile-note">${feelsNote}</div>
        </div>

        <div class="tile" ?tappable=${!!this._tap('humidity')}
             @pointerdown=${this._markPointer} @click=${this._tap('humidity')}>
          <div class="tile-head">${TILE_ICON.humidity} HUMIDITY</div>
          <div class="tile-value">${round(humidity)}%</div>
          <div class="tile-note">
            ${dew !== undefined ? html`The dew point is ${round(dew)}° right now.` : nothing}
          </div>
        </div>

        ${this._config?.map ? this._renderMapTile() : nothing}
    `;
  }

  /**
   * Precipitation map: a 2x2 tile wrapping an embedded Windy frame, centred on
   * the HA home coordinates.
   *
   * Home Assistant ships no radar imagery. Its map card takes entities, zones
   * and geolocation sources only, and no installed integration exposes a radar
   * entity, so the picture has to come from outside. Windy is the one embed
   * that frames cleanly (RainViewer's hangs on "Fetching map data").
   *
   * The frame is deliberately inert: a transparent sheet over it swallows
   * pointer events so a stray swipe on the kiosk cannot pan the map out of
   * position or start Windy's timeline animation.
   */
  private _renderMapTile(): TemplateResult {
    const grid = this._grid;
    const v = this._mapViewport;
    const temp = this._override('temperature', 'temperature');
    const lang = this.hass?.locale?.language ?? navigator.language;

    // Marker position, only once a viewport has been measured.
    let markerLeft = '50%';
    let markerTop = '50%';
    const centre = this._mapCentre;
    if (centre && v) {
      markerLeft = `${((lonToX(centre.lon, v.z) * 256 - v.originX) / v.width) * 100}%`;
      markerTop = `${((latToY(centre.lat, v.z) * 256 - v.originY) / v.height) * 100}%`;
    }

    const series = grid ? this._mapSeries : undefined;
    const idx = series ? Math.min(this._mapFrame, series.frames.length - 1) : 0;
    const frameTime = series ? new Date(series.times[idx]) : undefined;
    const style = this._config?.map_style ?? 'dark';
    const tiles = v ? baseTiles(v, style) : [];

    return html`
      <div class="tile map ${style} ${this._mapOpen ? 'open' : ''}"
           @click=${() => { if (!this._mapOpen) this._toggleMap(); }}>
        <div class="tile-head">${TILE_ICON.drop} PRECIPITATION</div>
        <div class="map-frame">
          <div class="map-base">
            ${tiles.map((t) => html`
              <img class="map-tile" src=${t.base} alt="" style=${
                `left:${t.left}px;top:${t.top}px;width:${t.size}px;height:${t.size}px`
              } />`)}
          </div>
          <canvas class="map-heat"></canvas>
          <!-- Labels ride ABOVE the heat field, as they do in the reference:
               place names stay readable through the colour. -->
          <div class="map-labels">
            ${tiles.map((t) => html`
              <img class="map-tile" src=${t.ref} alt="" style=${
                `left:${t.left}px;top:${t.top}px;width:${t.size}px;height:${t.size}px`
              } />`)}
          </div>

          <div class="map-pin" style=${`left:${markerLeft};top:${markerTop}`}>
            <div class="map-badge">${round(temp)}°</div>
            <div class="map-dot"></div>
            <div class="map-here">My Location</div>
          </div>

          ${this._mapOpen ? html`
            <div class="map-legend" @click=${(e: Event) => e.stopPropagation()}>
              <div class="map-legend-title">Precipitation</div>
              <div class="map-legend-body">
                <div class="map-legend-bar"></div>
                <div class="map-legend-labels">
                  <span>Extreme</span><span>Heavy</span>
                  <span>Moderate</span><span>Light</span>
                </div>
              </div>
            </div>
            <div class="map-zoom" @click=${(e: Event) => e.stopPropagation()}>
              <button title="Zoom in" @click=${() => this._zoomBy(1)}
                      ?disabled=${this._zoom >= FruityWeatherCard.ZOOM_MAX}>
                ${svg`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M12 5 V19 M5 12 H19" /></svg>`}
              </button>
              <button title="Zoom out" @click=${() => this._zoomBy(-1)}
                      ?disabled=${this._zoom <= FruityWeatherCard.ZOOM_MIN}>
                ${svg`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M5 12 H19" /></svg>`}
              </button>
            </div>
            <button class="map-close" title="Close"
                    @click=${(e: Event) => { e.stopPropagation(); this._toggleMap(); }}>
              ${svg`<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                <path d="M6 6 L18 18 M18 6 L6 18" />
              </svg>`}
            </button>
          ` : nothing}

          ${this._mapOpen && !series?.frames.length ? html`
            <div class="map-bar no-data" @click=${(e: Event) => e.stopPropagation()}>
              <div class="map-bar-text">
                <div class="map-bar-title">Forecast unavailable</div>
                <div class="map-bar-date">
                  ${this._gridRetryAt
                    ? 'Open-Meteo daily request limit reached — retrying automatically.'
                    : 'Loading forecast…'}
                </div>
              </div>
            </div>` : nothing}

          ${this._mapOpen && series?.frames.length && frameTime ? html`
            <div class="map-bar" @click=${(e: Event) => e.stopPropagation()}>
              <button class="map-play" @click=${this._togglePlayback}
                      title=${this._mapPlaying ? 'Pause' : 'Play'}>
                ${this._mapPlaying ? '❚❚' : '▶'}
              </button>
              <div class="map-bar-text">
                <div class="map-bar-title">Forecast</div>
                <div class="map-bar-date">
                  ${frameTime.toLocaleDateString(lang, {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div class="map-range">
                <button class=${this._mapRange === '1h' ? 'on' : ''}
                        @click=${() => this._setRange('1h')}>1h</button>
                <button class=${this._mapRange === '12h' ? 'on' : ''}
                        @click=${() => this._setRange('12h')}>12h</button>
              </div>
              <div class="map-track" @pointerdown=${this._scrub}>
                <!-- Width is set by _syncMapBar(), never bound here — see the
                     note on that method. -->
                <div class="map-track-fill"></div>
              </div>
              <div class="map-ticks">
                ${series.times.map((t, i) => {
                  // 15-minute frames all round to the same hour, so the 1h
                  // range has to label minutes; the 12h range shows every
                  // other hour to keep the row from crowding.
                  const quarter = this._mapRange === '1h';
                  if (!quarter && i % 2 !== 0) return nothing;
                  return html`<span>
                    ${i === 0 ? 'Now' : this._timeLabel(new Date(t), quarter)}
                  </span>`;
                })}
              </div>
            </div>` : nothing}

          ${!grid && !this._mapOpen ? html`<div class="map-note">
            ${this._gridRetryAt ? 'No forecast' : 'Loading…'}
          </div>` : nothing}
          ${this._mapOpen ? html`<div class="map-credit">${MAP_ATTRIBUTION}</div>` : nothing}
        </div>
      </div>
    `;
  }

  /**
   * iOS wind tile: labelled rows on the left, a ticked compass dial on the
   * right. HA's `wind_bearing` is the direction the wind comes FROM, so the
   * arrow is drawn 180° opposite — pointing where the wind is blowing to.
   */
  private _renderWindTile(
    wind?: number, windUnit?: string,
    gust?: number, gustUnit?: string,
    bearing?: number,
  ): TemplateResult {
    const C = 48;
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
    const px = (r: number, a: number): [number, number] =>
      [C + r * Math.cos(a), C + r * Math.sin(a)];

    // Tick ring, broken by a gap at each cardinal so the letter sits in it.
    let ticks = '';
    for (let i = 0; i < 72; i++) {
      const deg = i * 5;
      const atCardinal = [0, 90, 180, 270].some((c) => {
        const diff = Math.abs((((deg - c) % 360) + 540) % 360 - 180);
        return diff > 168; // within ~12° of the cardinal
      });
      if (atCardinal) continue;
      const a = toRad(deg);
      const [x1, y1] = px(31, a);
      const [x2, y2] = px(39, a);
      ticks += `M${x1.toFixed(2)},${y1.toFixed(2)}L${x2.toFixed(2)},${y2.toFixed(2)}`;
    }

    const hasDir = bearing !== undefined;
    // HA reports the direction the wind comes FROM; the arrow shows where it
    // is going, with the tail circle marking the origin.
    const blowTo = hasDir ? bearing! + 180 : 0;
    const aTo = toRad(blowTo);
    const aFrom = toRad(blowTo + 180);
    // Both ends anchor ON the tick ring (r 31-39) and run inward, leaving a gap
    // across the middle for the readout. The tail circle sits on the ring, not
    // floating inside it, and the head is a slim chevron rather than a blob.
    // Both strokes were trimmed ~30% at their inner ends, widening the gap
    // across the readout while keeping both anchored on the ring.
    const RING = 38;
    const [tx, ty] = px(RING, aFrom);    // tail circle, on the ring
    const [sx, sy] = px(RING - 3, aFrom); // tail line, from just inside it
    const [ex, ey] = px(24.5, aFrom);    // tail line end (was 20)
    const [ax, ay] = px(22.5, aTo);      // head shaft start (was 19)
    const [bx, by] = px(30, aTo);        // where the thin line stops
    // The head and the tail circle are 32% larger than the lines they cap
    // (10%, then another 20%). The head is scaled about its OWN midpoint rather
    // than grown inward from the tip: growing inward alone would push the base
    // down to r=26.8 and swallow most of the 22.5->30 shaft, which must keep
    // its length. This way the tip lands just past the ring and the tail circle
    // reaches the same radius, so the two ends stay visually balanced.
    const HEAD_SCALE = 1.32;
    const HEAD_MID = (RING + 2 + 30) / 2;
    const HEAD_HALF = ((RING + 2 - 30) / 2) * HEAD_SCALE;
    const [hx, hy] = px(HEAD_MID + HEAD_HALF, aTo); // arrowhead tip
    const [gx, gy] = px(HEAD_MID - HEAD_HALF, aTo); // arrowhead base
    // True perpendicular for the arrowhead wings — the previous version offset
    // by an angle, which skewed the triangle as the bearing changed.
    const perpX = -Math.sin(aTo);
    const perpY = Math.cos(aTo);
    const halfW = 3.4 * HEAD_SCALE;
    const w1x = gx + perpX * halfW, w1y = gy + perpY * halfW;
    const w2x = gx - perpX * halfW, w2y = gy - perpY * halfW;

    // Same ~12° window the tick ring uses, measured against where the arrow
    // points. NOTE the tick loop above tests `> 168`, i.e. "nearly OPPOSITE a
    // cardinal" — harmless there only because the cardinal set is closed under
    // opposites. Copying that test here dropped the letter across the dial from
    // the arrow, so this states the angular distance directly.
    const nearArrow = (deg: number) => {
      const d = Math.abs(((blowTo - deg) % 360 + 360) % 360);
      return (d > 180 ? 360 - d : d) < 12;
    };

    const tap = this._tap('wind');
    return html`
      <div class="tile wide" ?tappable=${!!tap}
           @pointerdown=${this._markPointer} @click=${tap}>
        <div class="tile-head">${TILE_ICON.wind} WIND</div>
        <div class="wind-body">
          <div class="wind-rows">
            <div class="wrow"><span>Wind</span><b>${round(wind)} ${windUnit}</b></div>
            <div class="wrow"><span>Gusts</span><b>${round(gust)} ${gustUnit}</b></div>
          </div>
          <svg class="dial" viewBox="0 0 96 96" aria-hidden="true">
            <path class="dial-ticks" d=${ticks}></path>
            <!--
              MUST use lit's svg\`\` tag, not html\`\`. A nested html template is
              parsed standalone as HTML, so line/circle/polygon are created in
              the HTML namespace: they appear in the DOM and report computed
              styles, but never render as geometry (getBBox throws). That is
              why the direction arrow was silently invisible.
            -->
            ${hasDir ? svg`
              <line class="dial-shaft" x1=${sx.toFixed(2)} y1=${sy.toFixed(2)}
                    x2=${ex.toFixed(2)} y2=${ey.toFixed(2)}></line>
              <line class="dial-shaft" x1=${ax.toFixed(2)} y1=${ay.toFixed(2)}
                    x2=${bx.toFixed(2)} y2=${by.toFixed(2)}></line>
              <circle class="dial-tail" cx=${tx.toFixed(2)} cy=${ty.toFixed(2)}
                      r=${(3.2 * HEAD_SCALE).toFixed(2)}></circle>
              <polygon class="dial-head" points=${
                `${hx.toFixed(2)},${hy.toFixed(2)} ${w1x.toFixed(2)},${w1y.toFixed(2)} ${w2x.toFixed(2)},${w2y.toFixed(2)}`
              }></polygon>` : nothing}
            <!-- Labels and readout draw last so the shaft passes behind them.
                 The letters sit INSIDE the tick ring (r 35, ticks 31-39), so a
                 cardinal-pointing arrow lands right on top of one; both are
                 solid white, and the glyph vanished. The letter the arrow is
                 aimed at is dropped instead — the arrow already occupies that
                 gap in the tick ring and reads as the direction marker. -->
            ${CARDINALS.map(([label, x, y, deg]) => (hasDir && nearArrow(deg))
              ? nothing
              : svg`
                  <text class="dial-card" x=${x} y=${y} text-anchor="middle"
                        dominant-baseline="middle">${label}</text>`)}
            <!-- y is in viewBox units: the dial renders at 0.80x the tile
                 width (136px for a 96 unit box), so 1 unit ~ 1.42 screen px.
                 41 -> 42.4 drops the readout the requested 2px. -->
            <text class="dial-val" x="48" y="42.4" text-anchor="middle"
                  dominant-baseline="middle">${round(wind)}</text>
            <text class="dial-unit" x="48" y="58" text-anchor="middle"
                  dominant-baseline="middle">${windUnit}</text>
          </svg>
        </div>
      </div>
    `;
  }

  static styles = css`
    /* Fixed card widths are stated as the OUTER size, so padding and the
       hairline border must sit inside them — otherwise every card overflows its
       grid track by its padding and swallows the gap. */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    :host {
      --fwc-font: system-ui, 'SF Pro Display', 'SF Pro Text', Inter,
        'Helvetica Neue', Roboto, sans-serif;
      --fwc-panel: rgba(255, 255, 255, 0.13);
      /* One source for the sheet's fill so its notch cannot drift from it. */
      --sheet-bg: #16161a;
      /* Shared by the day card's temperature scale and its hour row, so the
         two axes always read as one set of labels. */
      --sheet-axis: rgba(255, 255, 255, 0.75);
      /* Same labels once their hour has passed. */
      --sheet-axis-past: rgba(255, 255, 255, 0.34);
      /* Day card header geometry. The date box has a FIXED width so the next
         button never shifts as the date changes length — it is the widest
         string the format can produce (measured: "Wednesday, September 23,
         2026" at 266px in en), plus a little slack. Short dates simply leave
         space before the button rather than dragging it left. A wider locale
         will overflow into the free area on the right, which is the intended
         failure direction; override the token to suit. */
      --daycard-pad-x: 14px;
      --snav-size: 30px;
      --sheet-date-w: 272px;
      --fwc-hairline: rgba(255, 255, 255, 0.14);
      --fwc-dim: rgba(255, 255, 255, 0.62);
      --fwc-dimmer: rgba(255, 255, 255, 0.45);
      /* Precipitation reads in its own colour wherever it appears — the daily
         list's chance, the day card's curve and its scrub readout — so the eye
         can pick it out without a legend. */
      --fwc-precip: #5ac8fa;
      /*
       * Card geometry is FIXED; only the column count reflows.
       *
       * 170px is not arbitrary: the reference layout fits SIX tile columns
       * across its width (tile ≈ 15.5% of the layout). At 275px this card only
       * reached three columns on the same screen, which is why it read as
       * bloated next to the reference no matter how correct the internal
       * ratios were.
       */
      --fwc-tile: 170px;
      --fwc-gap: 14px;
      /*
       * Daily-list metrics, also expressed against the tile so they track it.
       * Reference ratios are relative to the LIST width (2 tiles + gap = 564):
       *   row height 95/595 = 16% · day text 30/595 = 5% · bar 10/595 = 1.7%.
       * Restated against one 275px tile: 32.7%, 10.2%, 3.5%.
       */
      --d-row: calc(var(--fwc-tile) * 0.327);
      --d-font: calc(var(--fwc-tile) * 0.102);
      --d-bar: calc(var(--fwc-tile) * 0.035);
      /* ONE condition-icon size shared by the daily list and the hourly strip —
         they were 23px and a hardcoded 38px, which read as two different
         designs. This lands between the two, then 10% smaller twice over. */
      --fwc-icon: calc(var(--fwc-tile) * 0.142);
    }

    /*
     * No background of its own: the dashboard's, or failing that the theme's,
     * shows through. The card used to paint a fixed blue sky here (and a darker
     * variant on .night), which ignored whatever the dashboard was set to.
     *
     * The day/night class is still set on the host — it is what a sun-driven
     * dynamic sky would hang off in v2 — it just paints nothing now.
     */
    ha-card {
      font-family: var(--fwc-font);
      color: var(--primary-text-color, #fff);
      border: none;
      border-radius: 20px;
      padding: 0 12px 14px;
      /* visible so the hero artwork can bleed past the card box when a host
         (the tablet pop-up) sets --fwc-hero-bleed-*; nothing else paints at
         the card edge, since the card has no background, border or shadow. */
      overflow: visible;
      background: none;
      box-shadow: none;
    }

    .err { padding: 16px; color: var(--error-color, #ff6b6b); }

    /* ---- day-detail sheet ---- */
    /* Covers the card rather than the viewport: the card is often hosted in a
       pop-up that owns the screen, and a second full-screen layer inside it
       fights the host's own backdrop and scroll lock. */
    /*
     * The day card lives IN the grid: three columns beside the daily list, the
     * same two rows tall, so the tiles simply flow after it. Nothing overlays
     * anything, so its position is fixed and only the notch moves.
     */
    .daycard {
      position: relative;
      /*
       * EXPLICIT placement, never auto. As an auto-placed 3x2 item under dense
       * auto-flow the browser first resolved it into the bottom
       * row and only later settled it beside the daily list, so on every open
       * the card and the tiles visibly swapped places and swapped back — the
       * flicker at each end of the shuffle. The daily list is two columns wide
       * and starts at line 1, so this card starts at line 3, always.
       */
      grid-column: 3 / span 3;
      grid-row: 1 / span 2;
      height: calc(var(--fwc-tile) * 2 + var(--fwc-gap));
      /*
       * min-height:auto is the default for a grid item, which means its CONTENT
       * can push the row taller than the height above. While the hourly data
       * was loading the body briefly measured taller than two rows, the grid
       * grew by a whole row, and every tile jumped down and back — the flicker
       * at each end of the shuffle. Pinning min-height to 0 and clipping makes
       * the declared height authoritative.
       */
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: 10px var(--daycard-pad-x) 12px;
      border-radius: 18px;
      background: var(--sheet-bg);
      border: 0.5px solid var(--fwc-hairline);
      transform-origin: left center;
      animation: daycard-in 420ms cubic-bezier(0.34, 1.42, 0.64, 1);
    }
    /* Below the breakpoint there is no room for three columns beside a
       two-column list, so the card becomes a full-width block instead. */
    @media (max-width: 620px) {
      .daycard { grid-column: 1 / -1; grid-row: auto / span 2; }
    }
    /* Grows out of the daily list it belongs to rather than blinking into
       existence, on the same spring the reflowing tiles use. */
    @keyframes daycard-in {
      from { opacity: 0; transform: scale(0.92); }
      to { opacity: 1; transform: scale(1); }
    }
    @media (prefers-reduced-motion: reduce) {
      .daycard { animation: none; }
      .sheet-arrow { transition: none !important; }
    }
    /*
     * The notch that ties the card to its row. An SVG rather than the usual CSS
     * border triangle: that trick cannot carry a stroke, and faking one with a
     * second triangle behind it left the fill and the card drifting to
     * different darks. Here the fill reads the SAME custom property the card
     * paints with, and only the two slanted sides are stroked, so the notch is
     * literally an extension of the card's own edge. Its top is set by script.
     */
    .sheet-arrow {
      position: absolute;
      left: -26px;
      width: 26px;
      height: 36px;
      transform: translateY(-50%);
      overflow: visible;
      transition: top 420ms cubic-bezier(0.34, 1.42, 0.64, 1);
    }
    .sheet-arrow polygon { fill: var(--sheet-bg); }
    .sheet-arrow polyline {
      fill: none;
      stroke: rgba(255, 255, 255, 0.26);
      stroke-width: 1;
      stroke-linejoin: round;
    }

    /* The stage clips nothing itself — the card's own overflow does that — but
       it gives the outgoing clone something to be absolutely positioned in. */
    .sheet-stage { position: relative; flex: 1 1 auto; min-height: 0; }
    .sheet-body { position: relative; display: flex; flex-direction: column; }
    /* Everything below the date row. Its own element so a series toggle can
       move it while the date, which has not changed, stays put. */
    .sheet-content { display: flex; flex-direction: column; }
    /* The outgoing clone, whichever of the two is being pushed. Its top offset
       is set inline from the original's position within its parent. */
    .ghost { position: absolute; left: 0; width: 100%; pointer-events: none; }
        /* Typography below is matched to its counterpart in the daily list, so the
       two cards read as one: date to .dday, the scale to .dlo, the hour row to
       .dhi. Sizes come from the same --d-font token rather than being restated. */
    /* Sized to occupy exactly the row the nav buttons sit on, and indented past
       the previous-day button. It belongs to the sliding body rather than to a
       nav row so that it travels with the day it names, while the buttons —
       chrome, not content — stay put; that is why they are positioned out of
       flow above. The header is packed to the left, leaving the right of the
       row free for further controls. */
    .sheet-date {
      height: var(--snav-size);
      display: flex;
      align-items: center;
      /* Centred in its reserved box, not left-aligned in it: the box is a fixed
         width so the next button cannot move, and parking all of that slack on
         one side left a lopsided gap before the button. Centred, the two gaps
         match and the header reads as one deliberate group. */
      justify-content: center;
      margin-left: calc(var(--snav-size) + 10px);
      width: var(--sheet-date-w);
      font-size: var(--d-font);
    }
    .snav {
      position: absolute;
      top: 10px;
      z-index: 1;
      display: grid;
      place-items: center;
      width: var(--snav-size);
      height: var(--snav-size);
      border: none;
      border-radius: 9px;
      cursor: pointer;
      color: inherit;
      background: rgba(255, 255, 255, 0.1);
    }
    .snav.prev { left: var(--daycard-pad-x); }
    /* Sits just past the date box. Both read the same width token, so the
       button and the space reserved for the date cannot drift apart. */
    .snav.next {
      left: calc(var(--daycard-pad-x) + var(--snav-size) + 10px + var(--sheet-date-w) + 10px);
    }
    /* The series toggle, in the space kept free at the right of the header. */
    .snav.mtemp { right: calc(var(--daycard-pad-x) + var(--snav-size) + 8px); }
    .snav.mprecip { right: var(--daycard-pad-x); }
    .snav.mode { opacity: 0.45; }
    .snav.mode.on { opacity: 1; background: rgba(255, 255, 255, 0.22); }
    .snav.mode.mprecip.on { color: var(--fwc-precip); }
    .snav[disabled] { opacity: 0.3; cursor: default; }
    .snav svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .sheet-hilo {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 14px;
      font-size: 34px;
      font-weight: 500;
      letter-spacing: -0.5px;
    }
    .sheet-lo { color: var(--fwc-dim); }
    /* 30% over the strip's glyph size: beside 34px digits the standard icon
       reads undersized, and this is the one place the two sit together. */
    .sheet-cond {
      width: calc(var(--fwc-icon) * 1.3);
      height: calc(var(--fwc-icon) * 1.3);
      object-fit: contain;
      margin-left: 6px;
    }
    .sheet-unit { font-size: calc(var(--d-font) * 0.85); color: var(--fwc-dim); margin-top: 1px; }

    /* The bottom margin is the one that matters: it used to be 2px, which let a
       glyph very nearly touch a curve reaching the top of its band — most
       visible on a 100% chance of precipitation. Widened to 11px, taking 5px
       from the top margin and spending the rest on height. That pushes the plot
       and the hour row down with it, which the card can afford: the hour labels
       still finish well inside the bottom padding, and the card's hidden
       overflow clips at the padding box, not the content box. */
    .sheet-glyphs {
      position: relative;
      height: var(--fwc-icon);
      margin: 7px 42px 11px 0;
    }
    .sglyph {
      position: absolute;
      transform: translateX(-50%);
      width: var(--fwc-icon);
      height: var(--fwc-icon);
      object-fit: contain;
    }
    .sheet-chart { display: flex; height: 150px; }
    .sheet-plot { position: relative; flex: 1 1 auto; }
    .sgl {
      position: absolute;
      left: 0;
      right: 0;
      border-top: 0.5px solid rgba(255, 255, 255, 0.1);
    }
    .scurve { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .scurve polyline {
      fill: none;
      stroke: #f0a93b;
      stroke-width: 4;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    /* The elapsed part of today. Round caps grow a dash by half the stroke
       width at each end, so the dasharray is stated in the pre-cap geometry:
       4 and 9 paint as an 8px capsule with a 5px gap. The non-scaling-stroke
       vector-effect is what keeps that in screen pixels — the viewBox is
       stretched to the plot, so a plain dasharray would be squashed
       horizontally. */
    .scurve polyline.past {
      stroke: rgba(255, 255, 255, 0.4);
      stroke-dasharray: 4 9;
    }
    /* Precipitation mode. Only the colour changes — geometry, dashing, the
       elapsed-hours treatment and the scrub marker are all shared with the
       temperature curve, so the two read as the same chart showing a different
       thing rather than as two different charts. */
    .scurve.precip polyline { stroke: var(--fwc-precip); }
    .scurve.precip polyline.past { stroke: rgba(255, 255, 255, 0.4); }
    .scrub-line.precip { border-left-color: var(--fwc-precip); }
    .sheet-hi.precip, .scrub-temp.precip { color: var(--fwc-precip); }
    .now-line {
      position: absolute;
      /* Reaches the top of the glyph row: the glyph height plus its bottom
         margin. Keep in step with .sheet-glyphs. */
      top: calc(-1 * (var(--fwc-icon) + 11px));
      bottom: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.16);
      pointer-events: none;
    }
    .sglyph.past { opacity: 0.42; }
    /* The meridiem is its own span and so carries its own colour declaration —
       it does not inherit the dimmed one from the label around it. */
    .sheet-xaxis span.past, .sheet-xaxis span.past .ap { color: var(--sheet-axis-past); }
    .smark.past { background: rgba(255, 255, 255, 0.5); }
    .smark {
      position: absolute;
      width: 11px;
      height: 11px;
      margin: -5.5px 0 0 -5.5px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35);
    }
    .smark span {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: var(--d-font);
      color: var(--fwc-dimmer);
      /* These sit over the fill at one end of the curve and over the card at
         the other, so neither a light nor a dark colour alone stays legible.
         A soft dark halo — wide and diffuse rather than a tight outline, which
         read as a hard edge — darkens whatever is behind the glyph without
         changing its colour, which is matched to the temperature scale. The
         smallest radius is deliberately large and the middle one is repeated:
         stacking layers deepens the shade without adding a crisp edge, which is
         how it gets darker AND softer at once rather than trading one for the
         other. */
      text-shadow:
        0 0 9px rgba(0, 0, 0, 0.9),
        0 0 16px rgba(0, 0, 0, 0.85),
        0 0 16px rgba(0, 0, 0, 0.7),
        0 0 26px rgba(0, 0, 0, 0.75),
        0 0 38px rgba(0, 0, 0, 0.5);
    }
    .smark.hi span { bottom: 13px; }
    .smark.lo span { top: 13px; }
    .smark.hi.flip span { bottom: auto; top: 13px; }
    .smark.lo.flip span { top: auto; bottom: 13px; }
    .sheet-yaxis { position: relative; width: 42px; flex: none; }
    .sheet-yaxis span {
      position: absolute;
      right: 0;
      transform: translateY(-50%);
      font-size: var(--d-font);
      font-variant-numeric: tabular-nums;
      color: var(--sheet-axis);
    }
    .sheet-xaxis {
      position: relative;
      height: 18px;
      /* Dropped clear of the plot: an L marker sitting on the bottom gridline
         was crowding the hour beneath it. */
      margin: 11px 42px 0 0;
    }
    .sheet-xaxis span {
      position: absolute;
      transform: translateX(-50%);
      font-size: var(--d-font);
      color: var(--sheet-axis);
      white-space: nowrap;
    }
    /* Between the sunrise/sunset tile's proportion (0.67), which read too small
       here, and a 2px drop, which barely read at all. */
    .sheet-xaxis .ap {
      position: static;
      transform: none;
      font-size: calc(var(--d-font) * 0.75);
    }
    /* Edge labels are pinned inward; centred on 0% or 100% half of each would
       fall outside the sheet's padding box and be clipped. */
    .sheet-xaxis span.first, .sglyph.first { transform: none; }
    .sheet-xaxis span.last { transform: translateX(-100%); }
    .sglyph.last { transform: translateX(-100%); }
    .sheet-note {
      padding: 26px 0 10px;
      text-align: center;
      font-size: 14px;
      color: var(--fwc-dim);
    }
    /* Scrub readout — replaces the H/L block while a finger is on the curve. */
    /*
     * The readout rides along under the cursor, as in the reference: caption
     * over value, translated horizontally by script. A transform is used rather
     * than a margin or an absolute position so it costs no layout and the block
     * keeps reserving its own height — that is what stops the sheet resizing
     * as a finger crosses the curve.
     */
    /*
     * inline-block in BOTH states, never only while scrubbing. Two reasons:
     * its width must equal its content width or there is nothing to slide
     * under the cursor, and — the subtle one — inline-block establishes a block
     * formatting context, which CONTAINS the child's margin-top instead of
     * letting it collapse out. Switching display between states therefore
     * changed the readout's height by that margin, which used to move the whole
     * sheet. Same box model in both states, no jump.
     */
    .sheet-readout {
      /*
       * align-self, NOT display:inline-block — the day card is a flex column and
       * flex items are BLOCKIFIED, so inline-block silently computed to block,
       * the readout filled the card's width, and the tracking clamp pinned it to
       * the left edge. Cross-axis start sizing gives it its content width, which
       * is what makes it slidable. Flex items never collapse margins either, so
       * the height stays stable between states for free.
       */
      align-self: flex-start;
      transform: translateX(0);
    }
    .sheet-readout.scrubbing { will-change: transform; }
    .scrub-temp { font-size: 34px; font-weight: 500; letter-spacing: -0.5px; }
    .sheet-hilo.scrubbing { display: flex; align-items: center; }
    .sheet-hilo.scrubbing .sheet-cond { margin-left: 0; margin-right: 2px; }
    /* Climbs out of the plot, past the glyph row, to meet the readout it is
       driving — the plot sets no overflow, so the overhang paints. The offset
       is the glyph row plus its margins, kept in the same terms as they are. */
    .scrub-line {
      position: absolute;
      top: calc(-1 * (var(--fwc-icon) + 12px));
      bottom: 0;
      width: 0;
      border-left: 3px solid #fff;
      pointer-events: none;
    }
    .scrub-dot {
      position: absolute;
      width: 16px;
      height: 16px;
      margin: -8px 0 0 -8px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35);
      pointer-events: none;
    }
    /* The plot owns the gesture, so a drag across it must not also pan the
       pop-up it lives in. */
    .sheet-plot { touch-action: none; cursor: crosshair; }
    .sheet-retry {
      margin-left: 8px;
      padding: 3px 10px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font: inherit;
      color: inherit;
      background: rgba(255, 255, 255, 0.14);
    }
    .drow[tappable] { cursor: pointer; }
    .drow[tappable]:active { filter: brightness(1.12); }

    /* ---- hero ---- */
    /*
     * The scene artwork bleeds past the hero's content box by
     * --fwc-hero-bleed-x / -top, so a host can push it out to its own edge:
     * the tablet pop-up sets 30px/24px to clear the card's 12px padding plus
     * the pop-up's 18px/24px padding. Padding grows by the same amount the
     * margin pulls back, so the text never moves. Defaults reach the card edge.
     * z-index:0 makes .hero a stacking context so ::before sits behind the text.
     */
    .hero {
      text-align: center;
      padding: calc(18px + var(--fwc-hero-bleed-top, 0px))
               var(--fwc-hero-bleed-x, 12px)
               calc(20px + var(--fwc-hero-extend, 0px));
      margin: calc(-1 * var(--fwc-hero-bleed-top, 0px))
              calc(-1 * var(--fwc-hero-bleed-x, 12px)) 0;
      position: relative;
      z-index: 0;
    }
    .hero.has-bg::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background-image: var(--fwc-hero);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      opacity: 0.8;
      /* Match whatever rounds the host's top corners (42px in the pop-up). */
      border-radius: var(--fwc-hero-radius, 20px) var(--fwc-hero-radius, 20px) 0 0;
      /* Fade out into the card instead of ending on a hard horizontal edge. */
      -webkit-mask-image: linear-gradient(to bottom,
        #000 45%,
        rgba(0, 0, 0, 0.98) 50%, rgba(0, 0, 0, 0.91) 55%,
        rgba(0, 0, 0, 0.81) 60%, rgba(0, 0, 0, 0.69) 65%,
        rgba(0, 0, 0, 0.57) 70%, rgba(0, 0, 0, 0.43) 75%,
        rgba(0, 0, 0, 0.31) 80%, rgba(0, 0, 0, 0.19) 85%,
        rgba(0, 0, 0, 0.10) 90%, rgba(0, 0, 0, 0.03) 95%,
        transparent 100%);
      mask-image: linear-gradient(to bottom,
        #000 45%,
        rgba(0, 0, 0, 0.98) 50%, rgba(0, 0, 0, 0.91) 55%,
        rgba(0, 0, 0, 0.81) 60%, rgba(0, 0, 0, 0.69) 65%,
        rgba(0, 0, 0, 0.57) 70%, rgba(0, 0, 0, 0.43) 75%,
        rgba(0, 0, 0, 0.31) 80%, rgba(0, 0, 0, 0.19) 85%,
        rgba(0, 0, 0, 0.10) 90%, rgba(0, 0, 0, 0.03) 95%,
        transparent 100%);
    }
    /* Diffuse haze rather than an offset shadow: an offset reads as a drop
       shadow and its hard edge shows as an outline around every glyph. */
    .hero.has-bg .loc,
    .hero.has-bg .cond,
    .hero.has-bg .hilo {
      text-shadow: 0 0 14px rgba(0, 0, 0, 0.85), 0 0 28px rgba(0, 0, 0, 0.55);
    }
    .hero.has-bg .temp {
      text-shadow: 0 0 24px rgba(0, 0, 0, 0.85), 0 0 48px rgba(0, 0, 0, 0.55);
    }
    .loc { font-size: 30px; font-weight: 400; letter-spacing: 0.2px; }
    .temp {
      font-size: 88px;
      font-weight: 200;
      line-height: 1.02;
      letter-spacing: -3px;
      margin-left: 14px; /* optically centre the glyphs, not the degree sign */
    }
    .temp .deg { font-weight: 200; }
    .cond { font-size: 19px; color: var(--fwc-dim); margin-top: 2px; }
    .hilo { font-size: 19px; margin-top: 1px; }

    /* ---- shared panel ---- */
    .panel {
      background: var(--fwc-panel);
      border-radius: 16px;
      border: 0.5px solid var(--fwc-hairline);
      padding: 10px 12px 12px;
    }
    .panel-head {
      /* Same 6.9%-of-tile ratio as a tile heading, so the two read alike. */
      font-size: calc(var(--fwc-tile) * 0.069);
      font-weight: 600;
      letter-spacing: 0.5px;
      color: var(--fwc-dim);
      padding-bottom: 10px;
      border-bottom: 0.5px solid var(--fwc-hairline);
      margin-bottom: 2px;
    }

    /* ---- hourly strip ---- */
    .strip { margin-bottom: var(--fwc-gap); }
    .strip-summary {
      font-size: calc(var(--fwc-tile) * 0.088);
      line-height: 1.3;
      padding: 2px 2px 10px;
      border-bottom: 0.5px solid var(--fwc-hairline);
      margin-bottom: 8px;
    }
    .row {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .row::-webkit-scrollbar { display: none; }
    /* Widened from 0.40 to give the glyph and a three-character percentage room
       to sit under each other without either touching the neighbouring cell. */
    .cell {
      flex: 0 0 auto;
      min-width: calc(var(--fwc-tile) * 0.46);
      text-align: center;
      padding: 2px 0;
    }
    /* Sized DOWN from the daily list: the strip is far wider than the daily
       panel, so type at the list's own size reads oversized across it. */
    .cell-label {
      font-size: calc(var(--d-font) * 0.85);
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
    }
    /* em-relative so the period marker stays ~2px under the hour at any size. */
    .cell-label .ap { font-size: 0.82em; }
    /* Vertical rhythm is stated as fractions of the GLYPH, not in pixels, so the
       proportions hold at any tile size. They are measured off the reference:
       the chance of precipitation sits FLUSH under the glyph — zero gap — and
       all the breathing room goes between that pair and the temperature.
       Spacing the three evenly instead reads as three unrelated rows; grouped
       this way the percentage is plainly an annotation OF the glyph. */
    .cell-icon {
      width: var(--fwc-icon);
      height: var(--fwc-icon);
      display: block;
      margin: calc(var(--fwc-icon) * 0.79) auto 0;
    }
    /* Rendered in EVERY cell, empty where there is nothing to say, so its height
       is spent whether or not an hour carries a figure. Without that the
       temperatures would sit at different heights from cell to cell and the
       strip would lose its baseline — the row of temperatures reading straight
       across is what makes it scannable. */
    .cell-prob {
      height: calc(var(--d-font) * 0.86);
      line-height: calc(var(--d-font) * 0.86);
      font-size: calc(var(--d-font) * 0.72);
      font-weight: 600;
      color: var(--fwc-precip);
    }
    /* The sunrise/sunset caption is deliberately NOT dimmed or shrunk: it reads
       as one continuous row of labels with the hourly temperatures. */
    .cell-val {
      margin-top: calc(var(--fwc-icon) * 0.5);
      font-size: calc(var(--d-font) * 0.92);
      font-weight: 600;
    }

    /* ---- two-column body ---- */
    /*
     * Cards are a FIXED size; only the arrangement is responsive. The track
     * size is a literal length (not 1fr and not a minmax), so auto-fill changes
     * the COLUMN COUNT as the card resizes and never rescales a card. If even
     * one column will not fit, the grid scrolls horizontally rather than
     * shrinking anything. Daily list and wind span two columns, as in iOS.
     */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, var(--fwc-tile));
      gap: var(--fwc-gap);
      /* Flush left: the daily list pins to the card edge and the squares flow
         out from it, rather than the whole block floating in the middle. */
      justify-content: start;
      align-items: start;
      align-content: start;
      /* dense lets single tiles backfill the column beside the tall daily list
         instead of leaving a hole under it. */
      grid-auto-flow: row dense;
      overflow-x: auto;
      scrollbar-width: thin;
    }
    .daily,
    .tile.wide,
    .tile.map {
      grid-column: span 2;
      width: calc(var(--fwc-tile) * 2 + var(--fwc-gap));
    }
    /* Same footprint as the daily list: two columns by two rows.
       NOTE: no padding-bottom override here. It used to be 0, which ran the map
       to the tile's bottom edge while the sides kept 14px — measured 15/15/1. */
    .tile.map {
      /*
       * A FIXED cell, so opening the day card reflows everything around the
       * radar instead of dragging the largest tile across the grid. Static
       * rather than pinned from script: an earlier dynamic pin rewrote the
       * spans below with its own read-back value and degraded them to span 1,
       * which let this 354px tile sit in a 170px cell and overlap its
       * neighbours. The .open rule is more specific and still wins.
       */
      grid-column: 1 / span 2;
      grid-row: 3 / span 2;
      height: calc(var(--fwc-tile) * 2 + var(--fwc-gap));
    }
    /*
     * Expanded: the map claims every column and four rows. The grid uses
     * grid-auto-flow row dense, so the tiles it displaces reflow underneath on
     * their own rather than leaving a hole. (Never put a backtick in here: it
     * closes the css tagged template, and the error points at the wrong line.)
     */
    /*
     * Expanded is the FULL WIDTH of the grid and three tiles tall. Placed
     * 1 / -1 rather than span N so it adapts to whatever column count the card
     * is rendered at; width 100% then resolves against the spanned area, and
     * Chrome still interpolates the 354px -> 100% transition.
     */
    .tile.map.open {
      grid-column: 1 / -1;
      grid-row: span 3;
      width: 100%;
      height: calc(var(--fwc-tile) * 3 + var(--fwc-gap) * 2);
      cursor: default;
    }
    /*
     * Open/close springs past the target and settles — the standard iOS
     * easing. Grid PLACEMENT cannot be transitioned, only the box, so any
     * displaced neighbours are animated separately by the FLIP pass in
     * _toggleMap(); both run over the same duration so they read as one move.
     *
     * The map is deliberately the LAST tile in the grid, so in practice there
     * is nothing after it to displace and the FLIP pass is a no-op. That is the
     * point: the user found the reshuffle "extremely confusing". The FLIP code
     * stays because a narrow card can still wrap a tile past the map.
     */
    .tile.map {
      transition:
        width 420ms cubic-bezier(0.34, 1.42, 0.64, 1),
        height 420ms cubic-bezier(0.34, 1.42, 0.64, 1);
    }
    @media (prefers-reduced-motion: reduce) {
      .tile.map { transition: none; }
    }
    .tile.map { cursor: pointer; }
    /* Expanded drops the heading, so the inset is uniform on all four sides
       rather than the 12px top / 14px sides a headed tile uses. */
    .tile.map.open { padding: 14px; }
    .tile.map.open .tile-head { display: none; }
    .tile.map.open .map-frame { margin-top: 0; }
    /*
     * Map chrome palette. Every legend, pill and button below reads from these
     * so the whole overlay follows the basemap shade in one place — Esri
     * publishes Gray Canvas as Light and Dark, and a light-grey control panel
     * floating over the dark map looked like a leftover.
     */
    .tile.map {
      --m-ground: #e9edf2;      /* shown until the tiles arrive */
      --m-panel: rgba(247, 249, 252, 0.985);
      --m-chip: rgba(210, 215, 224, 0.92);
      --m-chip-on: #fff;
      --m-ink: rgba(25, 32, 48, 0.92);
      --m-ink-2: rgba(40, 48, 66, 0.78);
      --m-ink-3: rgba(40, 48, 66, 0.45);
      /* The timeline labels are the one thing read WHILE scrubbing, so they
         run at full contrast rather than sharing the secondary ink. */
      --m-tick: rgba(8, 12, 20, 1);
      --m-glyph: rgba(8, 12, 20, 0.9);
      --m-rule: rgba(120, 130, 150, 0.28);
      --m-shadow: rgba(20, 30, 50, 0.16);
      --m-halo: #fff;           /* text-shadow behind the pin label */
    }
    .tile.map.dark {
      --m-ground: #2f3237;
      --m-panel: rgba(30, 33, 40, 0.955);
      --m-chip: rgba(70, 76, 88, 0.92);
      --m-chip-on: rgba(122, 130, 146, 0.95);
      --m-ink: rgba(240, 243, 250, 0.95);
      --m-ink-2: rgba(220, 226, 240, 0.78);
      --m-ink-3: rgba(225, 232, 245, 0.45);
      --m-tick: #fff;
      --m-glyph: rgba(250, 252, 255, 0.95);
      --m-rule: rgba(150, 160, 180, 0.26);
      --m-shadow: rgba(0, 0, 0, 0.4);
      --m-halo: rgba(18, 20, 25, 0.95);
    }
    /* Inset frame with its own radius, as in the reference — the map does not
       bleed to the tile edge, it sits inside it like a photo. */
    .map-frame {
      position: relative;
      flex: 1 1 auto;
      margin: 8px 0 0;
      border-radius: 12px;
      overflow: hidden;
      background: var(--m-ground);
      contain: paint;
    }
    .map-base,
    .map-labels { position: absolute; inset: 0; pointer-events: none; }
    /* Size comes from the tile record, not CSS — see baseTiles(). */
    .map-tile { position: absolute; }
    /* The blur is what turns a 27x17 sample grid into the reference's soft
       blobs; without it the bilinear upscale shows facets. */
    .map-heat {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      filter: blur(9px);
    }
    .map-credit {
      position: absolute;
      right: 6px;
      bottom: 2px;
      z-index: 2;
      font-size: 9px;
      color: var(--m-ink-3);
      pointer-events: none;
    }
    .map-pin {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
    }
    .map-badge {
      background: rgba(72, 92, 130, 0.92);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      line-height: 1;
      padding: 6px 9px;
      border-radius: 999px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    }
    .map-dot {
      width: 7px;
      height: 7px;
      margin-top: 3px;
      border-radius: 50%;
      background: #fff;
      border: 1.5px solid rgba(60, 70, 95, 0.75);
    }
    .map-here {
      margin-top: 2px;
      font-size: 11px;
      font-weight: 600;
      color: var(--m-ink);
      white-space: nowrap;
      /* Three stacked shadows, not one: the label sits directly on the map and
         needs to survive both pale land and a saturated rain blob. */
      text-shadow: 0 0 3px var(--m-halo), 0 0 3px var(--m-halo), 0 0 2px var(--m-halo);
    }
    /* A small pill, not a full-frame overlay — the basemap is fine, it is only
       the forecast layer that is missing. */
    .map-note {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
      padding: 5px 12px;
      border-radius: 999px;
      background: var(--m-panel);
      box-shadow: 0 1px 5px var(--m-shadow);
      font-size: 12px;
      font-weight: 600;
      color: var(--m-ink-2);
      white-space: nowrap;
    }
    .map-bar.no-data {
      grid-template-columns: 1fr;
      grid-template-areas: 'text';
    }

    /* ---- expanded chrome ---- */
    .map-legend {
      position: absolute;
      left: 10px;
      top: 10px;
      background: var(--m-panel);
      border-radius: 14px;
      padding: 11px 14px 13px;
      z-index: 3;
      box-shadow: 0 1px 6px var(--m-shadow);
      color: var(--m-ink);
    }
    /*
     * Proportions taken off the reference: a tall bar with the four labels
     * spread the full height, not a short chip with the names bunched at the
     * top. Height is a fraction of the tile so it tracks the rest of the card.
     */
    .map-legend-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      color: var(--m-ink);
    }
    .map-legend-body { display: flex; gap: 11px; }
    .map-legend-bar {
      width: 6px;
      border-radius: 3px;
      /* 0.88 read as over-stretched; 20% shorter. */
      height: calc(var(--fwc-tile) * 0.704);
      background: linear-gradient(to top, ${unsafeGradient});
    }
    .map-legend-labels {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 500;
      color: var(--m-ink-2);
      line-height: 1.2;
      padding: 1px 0;
    }
    .map-close,
    .map-play,
    .map-range button {
      font: inherit;
      border: 0;
      cursor: pointer;
      color: var(--m-ink);
      background: var(--m-chip);
    }
    /* Same diameter and fill as the play button — it was a 30px near-invisible
       chip before — and the X is drawn as a stroked path so it can be properly
       heavy and high-contrast rather than relying on a font glyph. */
    .map-close {
      position: absolute;
      box-shadow: 0 1px 5px var(--m-shadow);
      right: 10px;
      top: 10px;
      z-index: 3;
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--m-chip);
      line-height: 0;
    }
    /* Stacked +/- pill, mirroring the close button's treatment. */
    .map-zoom {
      position: absolute;
      right: 10px;
      top: 56px;
      z-index: 3;
      display: flex;
      flex-direction: column;
      border-radius: 19px;
      overflow: hidden;
      background: var(--m-chip);
      box-shadow: 0 1px 5px var(--m-shadow);
    }
    .map-zoom button {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border: 0;
      background: transparent;
      cursor: pointer;
      line-height: 0;
    }
    .map-zoom button + button { border-top: 1px solid var(--m-rule); }
    .map-zoom button[disabled] { opacity: 0.35; cursor: default; }
    .map-zoom svg,
    .map-close svg {
      fill: none;
      stroke: var(--m-glyph);
      stroke-width: 2.6;
      stroke-linecap: round;
    }
    .map-bar {
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 10px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-areas: 'play text range' 'track track track' 'ticks ticks ticks';
      align-items: center;
      gap: 8px 12px;
      padding: 10px 14px 12px;
      border-radius: 16px;
      background: var(--m-panel);
      z-index: 3;
      box-shadow: 0 2px 10px var(--m-shadow);
      color: var(--m-ink);
    }
    .map-play {
      grid-area: play;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      font-size: 13px;
      background: var(--m-chip);
    }
    .map-bar-text { grid-area: text; }
    .map-bar-title { font-size: 15px; font-weight: 700; line-height: 1.15; }
    .map-bar-date { font-size: 13px; color: var(--m-ink-2); }
    .map-range {
      grid-area: range;
      display: flex;
      gap: 2px;
      padding: 2px;
      border-radius: 999px;
      background: var(--m-chip);
    }
    .map-range button {
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      background: transparent;
    }
    .map-range button.on { background: var(--m-chip-on); }
    .map-track {
      grid-area: track;
      height: 5px;
      border-radius: 3px;
      background: var(--m-rule);
      cursor: pointer;
    }
    .map-track-fill {
      height: 100%;
      border-radius: 3px;
      background: var(--m-ink);
    }
    .map-ticks {
      grid-area: ticks;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 600;
      color: var(--m-tick);
    }
    /*
     * The daily list claims two grid rows, and its height is pinned to EXACTLY
     * two tiles plus one gap. Without that pin its natural height overshot the
     * two rows, both rows grew to absorb the difference, and the vertical gaps
     * between squares ended up ~17px wider than the horizontal ones. Rows flex
     * to share whatever space is left, so any number of forecast days fits.
     */
    .daily {
      grid-row: span 2;
      height: calc(var(--fwc-tile) * 2 + var(--fwc-gap));
      display: flex;
      flex-direction: column;
    }
    .daily .drow {
      flex: 1 1 0;
      height: auto;
      min-height: 0;
    }
    @media (max-width: 640px) {
      .columns { grid-template-columns: minmax(0, 1fr); }
    }

    /* ---- daily list ---- */
    /*
     * Column split measured off the reference row: day 25% · icon 11% ·
     * low 14% · bar 25% · high 25% of the list's inner width. The bar must NOT
     * be a 1fr track — letting it absorb the slack made it 2.5x too long and
     * left the row looking stretched and empty.
     */
    /*
     * The bar column now spans the WHOLE gap between the low and high temps and
     * the track is centred inside it. Previously the bar column started at the
     * low temp and all the slack piled up before the high temp, so the track
     * sat hard left instead of centred between the two readings.
     */
    /*
     * Icon column position, measured rather than guessed. Each row is its own
     * grid, so the column cannot shrink-wrap the widest weekday — one fixed x
     * has to serve every row, and the true midpoint between the day text and
     * the low temperature moves with the label ("Today" 105px, "Fri" 92px).
     * 26% is the mean of all six rows, i.e. the least-squares centre: worst
     * case is ~8px off instead of 20px. The low column still ENDS at 50% and
     * .dlo is right-aligned, so no text moves — only the icon.
     */
    .drow {
      display: grid;
      grid-template-columns: 20.5% 11% 18.5% 39% 11%;
      align-items: center;
      height: var(--d-row);
      border-bottom: 0.5px solid var(--fwc-hairline);
    }
    .drow:last-child { border-bottom: none; }
    .dday { font-size: var(--d-font); }
    /* A flat 5px nudge on top of the column centring, by eye rather than by
       measurement: the least-squares centre reads slightly left on the "Today"
       row, which is the one the eye lands on first. Absolute, not a percentage,
       so it does not scale with the tile. */
    /* The glyph and its chance of precipitation share one column and are
       centred together. The row has 26px of slack around a 24px icon, so the
       caption costs no height — rows stay put whether or not a day carries a
       figure, which matters because only some days do. */
    .dcond {
      justify-self: center;
      transform: translateX(5px);
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
    }
    .dicon {
      width: var(--fwc-icon);
      height: var(--fwc-icon);
    }
    .dprob {
      margin-top: 1px;
      font-size: calc(var(--d-font) * 0.72);
      font-weight: 500;
      color: var(--fwc-precip);
      white-space: nowrap;
    }
    .dlo {
      font-size: var(--d-font);
      color: var(--fwc-dimmer);
      text-align: right;
    }
    .dhi { font-size: var(--d-font); text-align: right; }
    .track {
      position: relative;
      /* 63% of a 39% column = 24.6% of the row, matching the reference bar
         length; auto side margins centre it between the two temperatures. */
      width: 63%;
      margin: 0 auto;
      height: var(--d-bar);
      border-radius: calc(var(--d-bar) / 2);
      background: rgba(255, 255, 255, 0.18);
    }
    .bar {
      position: absolute;
      top: 0;
      height: var(--d-bar);
      border-radius: calc(var(--d-bar) / 2);
    }
    .dot {
      position: absolute;
      top: 50%;
      width: calc(var(--d-bar) * 1.7);
      height: calc(var(--d-bar) * 1.7);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.3);
    }

    /* ---- tiles ---- */
    /*
     * Two fixed sizes, one per device class — the same thing iOS does between
     * iPad and iPhone. Within a class nothing rescales.
     */
    @media (max-width: 620px) {
      :host {
        /* Sized so two columns (plus a 2-wide daily) fit a 390px phone. */
        --fwc-tile: 155px;
        --fwc-gap: 10px;
      }
      /* Nothing else to restate — every metric is derived from --fwc-tile. */
      .wind-body { gap: 10px; }
    }
    /*
     * Every square shares ONE set of type tokens so no tile can drift, and the
     * sizes are the literal reference values measured off a 275px iOS tile.
     */
    .tile {
      /*
       * Derived from the tile width so the RATIOS are exact by construction and
       * cannot drift when --fwc-tile changes. Percentages measured off the
       * reference screenshot at its native 275px tile:
       *   heading 19px = 6.9% · value 58px = 21% · bold sub 26px = 9.5% ·
       *   note 22px = 8%.
       */
      --t-head: calc(var(--fwc-tile) * 0.069);
      --t-value: calc(var(--fwc-tile) * 0.21);
      --t-sub: calc(var(--fwc-tile) * 0.095);
      --t-note: calc(var(--fwc-tile) * 0.08);
      width: var(--fwc-tile);
      height: var(--fwc-tile);
      background: var(--fwc-panel);
      border: 0.5px solid var(--fwc-hairline);
      border-radius: 18px;
      padding: 12px 14px 14px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    /*
     * Only regions with a configured tap_action are interactive, so the cursor
     * and the press feedback are driven off the same attribute the handler is.
     * The map tile is excluded — it is always tappable and expands in place.
     */
    [tappable] { cursor: pointer; }
    [tappable]:active { filter: brightness(1.12); }
    .tile-head {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: var(--t-head);
      font-weight: 600;
      letter-spacing: 0.5px;
      color: var(--fwc-dim);
      margin-bottom: 10px;
    }
    .thead-icon { width: 16px; height: 16px; flex: 0 0 auto; }
    /* Units are set at FULL value size in iOS ("0 mm", "66%") — only the
       AM/PM period marker is reduced. */
    .tile-value {
      font-size: var(--t-value);
      font-weight: 400;
      letter-spacing: -0.6px;
      line-height: 1.06;
      white-space: nowrap;
    }
    .tile-sub { font-size: var(--t-sub); font-weight: 700; margin-top: 1px; }
    .tile-value.time .digits { font-size: var(--t-value); font-weight: 400; }
    .tile-value.time .ampm {
      font-size: 24px;
      font-weight: 500;
      margin-left: 1px;
    }

    /* ---- sunrise / sunset arc ---- */
    /* Negative margins bleed the horizon to the tile edges, as iOS does. */
    .sunarc { position: relative; flex: 1; min-height: 0; margin: 6px -14px 8px; }
    .sunarc svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    /* non-scaling-stroke keeps the line even once the viewBox is stretched. */
    /*
     * Below the horizon the arc goes DARKER THAN THE TILE, not merely dimmer.
     * That inversion is the whole read of the reference: the curve is lit while
     * the sun is up and in shadow once it is down. A translucent-white night
     * stroke keeps it lighter than its surroundings whatever the alpha, so it
     * never stops looking like the daytime line turned down.
     *
     * Black-on-alpha rather than a fixed colour so it darkens whatever theme
     * background shows through the panel.
     */
    .arc-night {
      fill: none;
      stroke: rgba(0, 0, 0, 0.45);
      stroke-width: 2.8;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
    }
    .arc-day {
      fill: none;
      stroke: rgba(255, 255, 255, 0.72);
      stroke-width: 2.8;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
    }
    .horizon {
      position: absolute;
      left: 0;
      right: 0;
      top: 59.09%; /* horizon y=26 of the 44-unit viewBox */
      /* The day/night divider is a HAIRLINE — it was the arc that needed
         weight, not this. */
      height: 1px;
      background: rgba(255, 255, 255, 0.9);
    }
    /*
     * The halo is an ADDITIVE bloom, not a box-shadow: plus-lighter lets it
     * brighten whatever sits underneath, so the arc and the horizon line wash
     * to white as they pass behind the sun — exactly what iOS does. A drop
     * shadow would just paint a flat disc on top and look pasted on.
     */
    .sunglow {
      position: absolute;
      width: 120px;
      height: 120px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      pointer-events: none;
      mix-blend-mode: plus-lighter;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.6) 0%,
        rgba(255, 248, 228, 0.34) 15%,
        rgba(255, 244, 214, 0.15) 33%,
        rgba(255, 242, 206, 0.05) 54%,
        rgba(255, 242, 206, 0) 72%
      );
    }
    .sundot {
      position: absolute;
      width: 13px;
      height: 13px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      box-sizing: border-box;
    }
    /* Above the horizon the sun is a lit disc; the thin dark ring keeps it
       readable inside its own glow. */
    .sundot.up {
      background: #fff;
      box-shadow: 0 0 0 1.5px rgba(18, 24, 46, 0.55);
    }
    /* Below the horizon iOS draws it HOLLOW — an unlit ring, not a lamp. */
    .sundot.down {
      background: rgba(18, 24, 46, 0.9);
      border: 2px solid rgba(255, 255, 255, 0.9);
    }
    /* ...and the bloom drops right back once the sun has set. */
    .sunglow.down {
      width: 76px;
      height: 76px;
      opacity: 0.4;
    }
    .sun-note { font-size: var(--t-note); }
    .sun-note .digits-sm { font-size: var(--t-note); }
    .sun-note .ampm-sm { font-size: 13px; margin-left: 1px; }
    .tile-note {
      margin-top: auto;
      font-size: var(--t-note);
      font-weight: 400;
      line-height: 1.24;
      color: rgba(255, 255, 255, 0.92);
    }

    /* ---- wind ---- */
    /* The iOS wind tile is TWO columns wide: labelled rows on the left, dial on
       the right. Squeezed into one column the two collide, which is why this
       tile carries .wide. */
    .wind-body {
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: center;
      gap: 18px;
      /* Pulled up so the dial can rise alongside the heading rather than being
         boxed in beneath it — that is what lets it be this large. */
      margin-top: calc(var(--fwc-tile) * -0.11);
    }
    .wind-rows { flex: 1 1 auto; min-width: 0; }
    .wrow {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 10px;
      /* Same token as every other square's body text, so the wind tile reads
         at the same weight and scale as its neighbours. */
      font-size: var(--t-note);
      padding: calc(var(--fwc-tile) * 0.05) 0;
      border-bottom: 0.5px solid var(--fwc-hairline);
      white-space: nowrap;
    }
    .wrow:last-child { border-bottom: none; }
    /* Reference emphasises the LABEL and dims the value — the opposite of the
       usual convention, and the opposite of what this card did before. */
    .wrow span { color: #fff; font-weight: 600; }
    .wrow b { color: var(--fwc-dim); font-weight: 400; }
    /* Nearly fills the tile's height below the heading, as it does in the
       reference — the previous 0.61 left it looking undersized. */
    .dial {
      flex: 0 0 auto;
      width: calc(var(--fwc-tile) * 0.80);
      height: calc(var(--fwc-tile) * 0.80);
    }
    /* Ticks sit well back so the arrow is the only bright thing on the dial. */
    .dial-ticks { stroke: rgba(255, 255, 255, 0.22); stroke-width: 1; }
    .dial-card { fill: rgba(255, 255, 255, 0.75); font-size: 9.5px; font-weight: 600; }
    .dial-val { fill: #fff; font-size: 18px; font-weight: 600; }
    .dial-unit { fill: rgba(255, 255, 255, 0.6); font-size: 9px; font-weight: 500; }
    .dial-shaft { stroke: #fff; stroke-width: 2.9; stroke-linecap: round; }
    .dial-head { fill: #fff; }
    .dial-tail { fill: #fff; }
  `;
}

declare global {
  interface Window { customCards?: Array<Record<string, unknown>>; }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'fruity-weather-card',
  name: 'Fruity Weather Card',
  description: 'iOS-style weather card: hero, 24h strip, daily list and detail tiles',
  preview: false,
});
