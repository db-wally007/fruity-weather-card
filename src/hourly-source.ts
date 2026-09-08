/**
 * Ten-day hourly forecast for the day-detail sheet.
 *
 * WHY THIS EXISTS
 * ---------------
 * Home Assistant's `weather/subscribe_forecast` gives whatever the integration
 * publishes, and met.no publishes exactly 48 hourly entries — today, tomorrow,
 * and a partial day after. The 10-day list therefore has hourly detail for
 * three of its rows and nothing for the other seven, which is precisely the gap
 * the day sheet is meant to fill.
 *
 * Open-Meteo returns all 240 hours in ONE request, so that is where the sheet's
 * curve comes from. Unlike the precipitation grid this is a single point, so it
 * costs one call against the free tier's 10,000/day rather than 143 — cheap
 * enough to fetch per browser without the pyscript cache the grid needs.
 *
 * CAVEAT worth knowing: the daily list stays on the Home Assistant weather
 * entity while the sheet's curve comes from Open-Meteo, so a row's high and the
 * peak of its curve can differ by a degree or two. The sheet therefore labels
 * its own H/L from the curve it is drawing, so what you see and what is
 * labelled always agree with each other.
 */

/** One hour of the sheet's curve. */
export interface HourPoint {
  /** Local wall-clock hour, 0-23. */
  hour: number;
  time: number;
  temp: number;
  /** Home Assistant condition slug, already resolved for day/night. */
  condition: string;
  /**
   * Chance of more than 0.1 mm falling in the preceding hour, 0-100.
   *
   * NOT the same resolution as `temp`. Temperature comes from the best
   * high-resolution model for the area (ICON-D2, ~2.2 km over central Europe);
   * probability can only come from an ENSEMBLE — many perturbed runs, counted —
   * and the free ensemble is ~0.25°, about 25 km. Measured 2026-09-08: points
   * 1 km and 6 km apart return different temperatures but identical
   * probabilities. Expect this to disagree with the precipitation map, which is
   * drawn from the high-resolution field. Neither is wrong.
   */
  precipProb: number;
  /** Accumulation in the preceding hour, mm. */
  precipMm: number;
}

export interface HourlyDays {
  fetchedAt: number;
  /** Keyed by local `YYYY-MM-DD`. */
  days: Map<string, HourPoint[]>;
  /**
   * Peak precipitation probability per local date, 0-100, straight from the
   * provider's own daily aggregate rather than recomputed from the hours.
   */
  dayProb: Map<string, number>;
}

/** Bumped from v1: HourPoint gained precipitation and the payload gained dayProb. */
const CACHE_KEY = 'fruity-weather-card:hourly-10d:v2';

/**
 * Optional shared cache written by `pyscript/fruity_weather.py`, same
 * arrangement as the precipitation map's grid. Tried before the network so a
 * household fetches once rather than once per browser profile; absent, the card
 * calls the API itself and works exactly as before.
 */
const LOCAL_HOURLY_URL = '/local/fruity-weather-card/precip-hourly.json';

/**
 * Requested variables. Kept here as constants because `pyscript/fruity_weather.py`
 * must ask for exactly the same set — the shared file is parsed by the same code
 * as the API response, so a mismatch shows up as missing data rather than an error.
 */
export const HOURLY_VARS = 'temperature_2m,weather_code,precipitation_probability,precipitation';
export const DAILY_VARS = 'precipitation_probability_max';
/** The provider updates hourly; refetching more often just spends quota. */
export const HOURLY_TTL_MS = 60 * 60 * 1000;

/**
 * WMO weather codes to the card's Home Assistant condition slugs. Open-Meteo
 * has no separate night codes, so the caller resolves clear/partly by sun
 * position — the same rule the rest of the card uses.
 */
function conditionForCode(code: number): string {
  if (code === 0) return 'sunny';
  if (code === 1 || code === 2) return 'partlycloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'rainy';
  if (code >= 61 && code <= 65) return code >= 65 ? 'pouring' : 'rainy';
  if (code === 66 || code === 67) return 'snowy-rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return code === 82 ? 'pouring' : 'rainy';
  if (code === 85 || code === 86) return 'snowy';
  if (code === 95) return 'lightning';
  if (code === 96 || code === 99) return 'lightning-rainy';
  return 'cloudy';
}

function readCache(): HourlyDays | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return undefined;
    const c = JSON.parse(raw) as {
      fetchedAt: number;
      days: Record<string, HourPoint[]>;
      dayProb?: Record<string, number>;
    };
    if (!c?.fetchedAt || Date.now() - c.fetchedAt > HOURLY_TTL_MS) return undefined;
    return {
      fetchedAt: c.fetchedAt,
      days: new Map(Object.entries(c.days)),
      dayProb: new Map(Object.entries(c.dayProb ?? {})),
    };
  } catch {
    return undefined;
  }
}

function writeCache(v: HourlyDays): void {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        fetchedAt: v.fetchedAt,
        days: Object.fromEntries(v.days),
        dayProb: Object.fromEntries(v.dayProb),
      }),
    );
  } catch {
    // A full or disabled localStorage is not worth failing the fetch over.
  }
}

/** Shape both the API response and the pyscript file are reduced to. */
interface RawHourly {
  time: string[];
  temperature_2m: (number | null)[];
  weather_code: (number | null)[];
  precipitation_probability: (number | null)[];
  precipitation: (number | null)[];
}

function groupByDay(h: RawHourly): Map<string, HourPoint[]> {
  const days = new Map<string, HourPoint[]>();
  for (let i = 0; i < h.time.length; i++) {
    const t = h.time[i];
    const temp = h.temperature_2m[i];
    if (temp == null) continue;
    const date = t.slice(0, 10);
    const hour = Number(t.slice(11, 13));
    // Parsed as local because the string carries no zone and timezone=auto
    // already put it in the home zone.
    const ms = new Date(`${t}:00`).getTime();
    const list = days.get(date) ?? [];
    list.push({
      hour,
      time: ms,
      temp,
      condition: conditionForCode(h.weather_code[i] ?? 3),
      precipProb: h.precipitation_probability[i] ?? 0,
      precipMm: h.precipitation[i] ?? 0,
    });
    days.set(date, list);
  }
  return days;
}

/**
 * The shared file written by pyscript, if one is there and still fresh. A stale
 * or malformed file is ignored rather than repaired: the network path below
 * produces the same thing, so there is nothing to gain by salvaging it.
 */
async function fetchLocalHourly(): Promise<HourlyDays | undefined> {
  try {
    const res = await fetch(`${LOCAL_HOURLY_URL}?t=${Math.floor(Date.now() / 60000)}`);
    if (!res.ok) return undefined;
    const c = await res.json() as {
      fetchedAt?: number;
      hourly?: RawHourly;
      daily?: { time?: string[]; precipitation_probability_max?: (number | null)[] };
    };
    if (!c?.fetchedAt || !c.hourly?.time?.length) return undefined;
    // Generous next to the in-browser TTL: the writer refreshes on its own
    // schedule and a file a little past the hour still beats a network round
    // trip. Well beyond that it is better to go and ask.
    if (Date.now() - c.fetchedAt > HOURLY_TTL_MS * 3) return undefined;
    const dayProb = new Map<string, number>();
    const dt = c.daily?.time ?? [];
    const dp = c.daily?.precipitation_probability_max ?? [];
    for (let i = 0; i < dt.length; i++) dayProb.set(dt[i], dp[i] ?? 0);
    return { fetchedAt: c.fetchedAt, days: groupByDay(c.hourly), dayProb };
  } catch {
    return undefined;
  }
}

/**
 * Fetch ten days of hourly temperature and condition, grouped by local date.
 * `timezone=auto` makes Open-Meteo return naive local timestamps, so the date
 * key and the hour need no conversion — and no DST arithmetic, which is where
 * this kind of code usually goes wrong.
 */
export function fetchHourlyDays(
  lat: number,
  lon: number,
  force = false,
): Promise<HourlyDays> {
  // One request at a time for the whole module, whatever asks. Two cards on a
  // dashboard would otherwise each fetch, and so would one card that Home
  // Assistant tears down and rebuilds mid-flight during a view render — both
  // observed as a duplicate API call, since the localStorage cache is only
  // written once a fetch has finished and cannot dedupe what is still running.
  if (!force && inFlight) return inFlight;
  const run = fetchHourlyDaysUncached(lat, lon, force);
  if (!force) {
    inFlight = run;
    void run.finally(() => { if (inFlight === run) inFlight = undefined; });
  }
  return run;
}

let inFlight: Promise<HourlyDays> | undefined;

async function fetchHourlyDaysUncached(
  lat: number,
  lon: number,
  force = false,
): Promise<HourlyDays> {
  if (!force) {
    const cached = readCache();
    if (cached) return cached;
  }

  // Shared file first: it costs a local request and spares the household an API
  // call. Anything wrong with it falls through to the network silently.
  const shared = await fetchLocalHourly();
  if (shared) {
    writeCache(shared);
    return shared;
  }

  const url =
    'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}`
    + `&hourly=${HOURLY_VARS}&daily=${DAILY_VARS}`
    + '&forecast_days=10&timezone=auto';

  const res = await fetch(url);
  if (!res.ok) throw new Error(`open-meteo hourly ${res.status}`);
  const body = await res.json() as {
    hourly?: Partial<RawHourly>;
    daily?: { time?: string[]; precipitation_probability_max?: (number | null)[] };
  };

  const times = body.hourly?.time ?? [];
  if (!times.length) throw new Error('open-meteo hourly returned no points');
  const n = times.length;
  const col = (a: (number | null)[] | undefined) => a ?? new Array<null>(n).fill(null);

  const days = groupByDay({
    time: times,
    temperature_2m: col(body.hourly?.temperature_2m),
    weather_code: col(body.hourly?.weather_code),
    precipitation_probability: col(body.hourly?.precipitation_probability),
    precipitation: col(body.hourly?.precipitation),
  });

  const dayProb = new Map<string, number>();
  const dt = body.daily?.time ?? [];
  const dp = body.daily?.precipitation_probability_max ?? [];
  for (let i = 0; i < dt.length; i++) dayProb.set(dt[i], dp[i] ?? 0);

  const out = { fetchedAt: Date.now(), days, dayProb };
  writeCache(out);
  return out;
}

/** Local `YYYY-MM-DD` for a date, which is how `days` is keyed. */
export function localDateKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
