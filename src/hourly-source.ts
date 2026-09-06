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
}

export interface HourlyDays {
  fetchedAt: number;
  /** Keyed by local `YYYY-MM-DD`. */
  days: Map<string, HourPoint[]>;
}

const CACHE_KEY = 'fruity-weather-card:hourly-10d:v1';
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
    const c = JSON.parse(raw) as { fetchedAt: number; days: Record<string, HourPoint[]> };
    if (!c?.fetchedAt || Date.now() - c.fetchedAt > HOURLY_TTL_MS) return undefined;
    return { fetchedAt: c.fetchedAt, days: new Map(Object.entries(c.days)) };
  } catch {
    return undefined;
  }
}

function writeCache(v: HourlyDays): void {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ fetchedAt: v.fetchedAt, days: Object.fromEntries(v.days) }),
    );
  } catch {
    // A full or disabled localStorage is not worth failing the fetch over.
  }
}

/**
 * Fetch ten days of hourly temperature and condition, grouped by local date.
 * `timezone=auto` makes Open-Meteo return naive local timestamps, so the date
 * key and the hour need no conversion — and no DST arithmetic, which is where
 * this kind of code usually goes wrong.
 */
export async function fetchHourlyDays(
  lat: number,
  lon: number,
  force = false,
): Promise<HourlyDays> {
  if (!force) {
    const cached = readCache();
    if (cached) return cached;
  }

  const url =
    'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}`
    + '&hourly=temperature_2m,weather_code'
    + '&forecast_days=10&timezone=auto';

  const res = await fetch(url);
  if (!res.ok) throw new Error(`open-meteo hourly ${res.status}`);
  const body = await res.json() as {
    hourly?: { time?: string[]; temperature_2m?: (number | null)[]; weather_code?: (number | null)[] };
  };

  const times = body.hourly?.time ?? [];
  const temps = body.hourly?.temperature_2m ?? [];
  const codes = body.hourly?.weather_code ?? [];
  if (!times.length) throw new Error('open-meteo hourly returned no points');

  const days = new Map<string, HourPoint[]>();
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    const temp = temps[i];
    if (temp == null) continue;
    const date = t.slice(0, 10);
    const hour = Number(t.slice(11, 13));
    // Parsed as local because the string carries no zone and timezone=auto
    // already put it in the home zone.
    const ms = new Date(`${t}:00`).getTime();
    const list = days.get(date) ?? [];
    list.push({ hour, time: ms, temp, condition: conditionForCode(codes[i] ?? 3) });
    days.set(date, list);
  }

  const out = { fetchedAt: Date.now(), days };
  writeCache(out);
  return out;
}

/** Local `YYYY-MM-DD` for a date, which is how `days` is keyed. */
export function localDateKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
