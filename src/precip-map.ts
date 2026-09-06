/**
 * Forecast precipitation map.
 *
 * Home Assistant has no radar of its own — the built-in map card takes
 * entities, zones and geolocation sources and has no tile-layer or overlay
 * option, and no installed integration exposes a radar entity. Every embed that
 * does show one (Windy, RainViewer) brings its own branding and its own
 * timeline UI, which is the look this card exists to avoid.
 *
 * So the map is drawn here instead: Open-Meteo returns a whole forecast grid in
 * ONE request (459 points x 13 hourly frames, ~440 KB, ~0.3 s measured), which
 * is painted as a soft heat field over CARTO basemap tiles. That also finally
 * gets precipitation PROBABILITY into the card — no HA weather integration
 * exposes it.
 */

/*
 * Grid geometry — sized by API BUDGET, not by what fits in a URL.
 *
 * Open-Meteo's free tier bills PER LOCATION: a 459-point request costs ~459 of
 * the 10,000 daily calls, i.e. ~21 fetches a day for the whole household. That
 * is not a rate limit you can retry past — it returns
 * "Daily API request limit exceeded. Please try again tomorrow." for the rest
 * of the day, for every browser on the connection.
 *
 * 13x11 = 143 points cuts that by 69%. Resolution is barely affected because
 * everything is blurred into blobs afterwards anyway.
 *
 * SPACING IS SET BY THE WIDEST VIEW, not by taste. The expanded frame at the
 * minimum zoom (z7) is 508 px, so the grid has to span at least that or the
 * field stops mid-frame with a hard edge. Sized with ~8 px of margin on each
 * side: measured left -8.1, right 516.1, top -24.1, bottom 514.6.
 *
 * The vertical margin is lopsided because the grid is spaced in DEGREES while
 * the frame is measured in Mercator PIXELS, and a degree of latitude is worth
 * more pixels the further north it sits — so the same 5 steps reach 24 px past
 * the top but only 7 px past the bottom. Size off the SOUTH edge; matching the
 * north instead is what left a 3 px uncovered strip along the bottom.
 *
 * Samples land ~34 km apart, up from ~25 km when the grid only had to cover
 * z8 — the cost of defaulting to the wide view, and invisible under the blur.
 */
export const GRID_NX = 13;
export const GRID_NY = 11;
export const D_LON = 0.48;
export const D_LAT = 0.375;

export interface PrecipGrid {
  fetchedAt: number;
  lat0: number;
  lon0: number;
  /** Frame times as epoch ms, and one Float32Array of mm/h per frame. */
  hourly: { times: number[]; frames: Float32Array[] };
  quarter: { times: number[]; frames: Float32Array[] };
}

export function gridBounds(lat0: number, lon0: number) {
  return {
    north: lat0 + ((GRID_NY - 1) / 2) * D_LAT,
    south: lat0 - ((GRID_NY - 1) / 2) * D_LAT,
    west: lon0 - ((GRID_NX - 1) / 2) * D_LON,
    east: lon0 + ((GRID_NX - 1) / 2) * D_LON,
  };
}

/**
 * Grid written by pyscript/fruity_weather.py, served from HA itself.
 *
 * Preferred over calling Open-Meteo directly because the API bills per
 * location: every browser profile that fetches its own copy multiplies the
 * cost against a 10,000/day allowance, whereas this file costs one fetch for
 * the whole house no matter how many dashboards are open.
 */
const LOCAL_GRID_URL = '/local/fruity-weather-card/precip-grid.json';

/** A stored grid is only usable if it samples the same ground as this build. */
function sameGeometry(c: any): boolean {
  return c.nx === GRID_NX && c.ny === GRID_NY
    && Math.abs((c.dlon ?? 0) - D_LON) < 1e-6
    && Math.abs((c.dlat ?? 0) - D_LAT) < 1e-6;
}

async function fetchLocalGrid(lat0: number, lon0: number): Promise<PrecipGrid | undefined> {
  try {
    const res = await fetch(`${LOCAL_GRID_URL}?t=${Math.floor(Date.now() / 60000)}`);
    if (!res.ok) return undefined;
    const c = await res.json();
    if (!sameGeometry(c)) {
      // Same point COUNT with different spacing would be painted over the
      // wrong ground area, so the file carries dlon/dlat and both must match.
      console.warn('fruity-weather-card: cached grid is %dx%d @ %s/%s, card expects %dx%d @ %s/%s',
        c.nx, c.ny, c.dlon, c.dlat, GRID_NX, GRID_NY, D_LON, D_LAT);
      return undefined;
    }
    // A cache centred somewhere else (home moved) is worse than none.
    if (Math.abs(c.lat0 - lat0) > 0.01 || Math.abs(c.lon0 - lon0) > 0.01) return undefined;
    const revive = (a: number[][]) => a.map((f) => Float32Array.from(f));
    return {
      fetchedAt: c.fetchedAt,
      lat0: c.lat0,
      lon0: c.lon0,
      hourly: { times: c.hourly.times, frames: revive(c.hourly.frames) },
      quarter: { times: c.quarter.times, frames: revive(c.quarter.frames) },
    };
  } catch {
    return undefined;
  }
}

export async function fetchPrecipGrid(lat0: number, lon0: number): Promise<PrecipGrid> {
  const local = await fetchLocalGrid(lat0, lon0);
  if (local) return local;
  const lats: string[] = [];
  const lons: string[] = [];
  for (let iy = 0; iy < GRID_NY; iy++) {
    for (let ix = 0; ix < GRID_NX; ix++) {
      lats.push((lat0 + (iy - (GRID_NY - 1) / 2) * D_LAT).toFixed(4));
      lons.push((lon0 + (ix - (GRID_NX - 1) / 2) * D_LON).toFixed(4));
    }
  }
  // precipitation_probability is not drawn anywhere yet and every extra
  // variable adds weight to a call that is already billed 143 times over.
  // Put it back the moment something displays it.
  const url = 'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${lats.join(',')}&longitude=${lons.join(',')}`
    + '&hourly=precipitation&forecast_hours=13'
    + '&minutely_15=precipitation&forecast_minutely_15=8'
    + '&timezone=UTC';

  // Fallback only: pyscript is not installed, or has not written the file yet.
  const cached = readCache(lat0, lon0);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`open-meteo ${res.status}`);
  const body = await res.json();
  const points: any[] = Array.isArray(body) ? body : [body];
  if (points.length !== GRID_NX * GRID_NY) {
    throw new Error(`open-meteo returned ${points.length} of ${GRID_NX * GRID_NY} points`);
  }

  // Times are identical across points, so read them from the first one. The
  // API returns naive UTC strings; the Z makes Date parse them as such.
  const asEpoch = (s: string) => new Date(`${s}Z`).getTime();
  const hTimes: number[] = points[0].hourly.time.map(asEpoch);
  const qTimes: number[] = points[0].minutely_15.time.map(asEpoch);

  const build = (n: number, read: (p: any, f: number) => number) =>
    Array.from({ length: n }, (_, f) => {
      const g = new Float32Array(GRID_NX * GRID_NY);
      for (let i = 0; i < points.length; i++) g[i] = read(points[i], f) || 0;
      return g;
    });

  const grid: PrecipGrid = {
    fetchedAt: Date.now(),
    lat0,
    lon0,
    hourly: {
      times: hTimes,
      frames: build(hTimes.length, (p, f) => p.hourly.precipitation[f]),
    },
    quarter: {
      times: qTimes,
      frames: build(qTimes.length, (p, f) => p.minutely_15.precipitation[f]),
    },
  };
  writeCache(grid);
  return grid;
}

/*
 * The grid is cached in localStorage, not just in memory: a page RELOAD would
 * otherwise spend another 143 calls, and every tab showing the dashboard pays
 * again. Shared storage means one fetch serves all of them for the TTL.
 */
const CACHE_KEY = 'fruity-weather-card:precip-grid:v3';
export const CACHE_TTL_MS = 30 * 60_000;

function readCache(lat0: number, lon0: number): PrecipGrid | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return undefined;
    const c = JSON.parse(raw);
    if (Date.now() - c.fetchedAt > CACHE_TTL_MS) return undefined;
    if (Math.abs(c.lat0 - lat0) > 1e-6 || Math.abs(c.lon0 - lon0) > 1e-6) return undefined;
    if (!sameGeometry(c)) return undefined;
    const revive = (a: number[][]) => a.map((f) => Float32Array.from(f));
    return {
      fetchedAt: c.fetchedAt,
      lat0: c.lat0,
      lon0: c.lon0,
      hourly: { times: c.hourly.times, frames: revive(c.hourly.frames) },
      quarter: { times: c.quarter.times, frames: revive(c.quarter.frames) },
    };
  } catch {
    return undefined;
  }
}

function writeCache(g: PrecipGrid): void {
  try {
    const plain = (a: Float32Array[]) => a.map((f) => Array.from(f, (v) => +v.toFixed(2)));
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      fetchedAt: g.fetchedAt, lat0: g.lat0, lon0: g.lon0,
      nx: GRID_NX, ny: GRID_NY, dlon: D_LON, dlat: D_LAT,
      hourly: { times: g.hourly.times, frames: plain(g.hourly.frames) },
      quarter: { times: g.quarter.times, frames: plain(g.quarter.frames) },
    }));
  } catch {
    /* quota or private mode — the map still works, it just refetches */
  }
}

/* ---------------------------------------------------------------- Mercator */

/** Web Mercator, in tiles. Multiply by 256 for pixels at that zoom. */
export const lonToX = (lon: number, z: number) => ((lon + 180) / 360) * 2 ** z;
export const latToY = (lat: number, z: number) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2) * 2 ** z;
};

export interface Viewport {
  z: number;
  /** Top-left corner of the viewport, in pixels at zoom z. */
  originX: number;
  originY: number;
  width: number;
  height: number;
}

export function viewportFor(
  lat: number, lon: number, z: number, width: number, height: number,
): Viewport {
  return {
    z,
    originX: lonToX(lon, z) * 256 - width / 2,
    originY: latToY(lat, z) * 256 - height / 2,
    width,
    height,
  };
}

export interface BaseTile {
  key: string; base: string; ref: string; left: number; top: number; size: number;
}

export const MAP_ATTRIBUTION = 'Esri, HERE, Garmin, © OpenStreetMap contributors';

export type MapStyle = 'light' | 'dark';

/**
 * Esri's Gray Canvas, in its two published layers: a flat landmass Base and a
 * separate Reference layer carrying the place names. Both come in a Light and
 * a Dark edition at the same tile paths, so the style is a one-word swap.
 *
 * CARTO was the obvious choice — Home Assistant's own map card uses it — but as
 * of now every CARTO basemap style returns a tile stamped "API KEY REQUIRED"
 * right across it, verified on light_all, light_all@2x and voyager. Esri needs
 * no key and happens to be a very close match for the reference screenshots,
 * down to labelling the same towns. Note the path order is {z}/{y}/{x}, not
 * the usual {z}/{x}/{y}.
 */
export function baseTiles(v: Viewport, style: MapStyle = 'dark'): BaseTile[] {
  const root = 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas';
  const shade = style === 'dark' ? 'Dark' : 'Light';
  // ALWAYS native zoom at 256 CSS px. Do not reintroduce the "fetch z+1 and
  // draw at 128px" retina trick: that is NOT equivalent to an @2x tile. A real
  // @2x tile holds the same map at double density, so labels keep their size
  // and merely get crisper; z+1 at half size shows a deeper zoom's content
  // shrunk, which halves every place name and made the map unreadable on the
  // HiDPI screens it was supposed to help.
  //
  // Having both would need a provider serving @2x, and no keyless one does:
  // Esri has none, maps.wikimedia.org/...@2x returns 403, Stadia's 512px tiles
  // return 401 without a key. Legibility beats sharpness, so tiles are simply
  // upscaled by the device on HiDPI.
  const tz = v.z;
  const px = 256;
  const n = 2 ** tz;
  const out: BaseTile[] = [];
  const x0 = Math.floor(v.originX / px);
  const y0 = Math.floor(v.originY / px);
  const x1 = Math.floor((v.originX + v.width) / px);
  const y1 = Math.floor((v.originY + v.height) / px);
  for (let ty = y0; ty <= y1; ty++) {
    if (ty < 0 || ty >= n) continue;
    for (let tx = x0; tx <= x1; tx++) {
      const wx = ((tx % n) + n) % n;
      out.push({
        key: `${shade}/${tz}/${wx}/${ty}`,
        base: `${root}/World_${shade}_Gray_Base/MapServer/tile/${tz}/${ty}/${wx}`,
        ref: `${root}/World_${shade}_Gray_Reference/MapServer/tile/${tz}/${ty}/${wx}`,
        left: tx * px - v.originX,
        top: ty * px - v.originY,
        size: px,
      });
    }
  }
  return out;
}

/* ------------------------------------------------------------------- paint */

/**
 * Colour ramp in mm/h, read off the reference legend: barely-there blue for
 * Light, through violet and magenta for Moderate and Heavy, to a pale amber
 * for Extreme. Alpha climbs with intensity so light drizzle stays translucent
 * enough to read the map underneath.
 */
const RAMP: Array<[number, number, number, number, number]> = [
  [0.00, 90, 160, 245, 0],
  [0.08, 90, 160, 245, 60],
  [0.40, 56, 116, 235, 150],
  [1.20, 116, 82, 222, 190],
  [3.00, 200, 68, 180, 205],
  [7.00, 246, 158, 60, 215],
  [15.0, 252, 236, 150, 225],
];

function rampAt(mm: number, out: Uint8ClampedArray, o: number): void {
  let i = 0;
  while (i < RAMP.length - 1 && mm > RAMP[i + 1][0]) i++;
  const a = RAMP[i];
  const b = RAMP[Math.min(i + 1, RAMP.length - 1)];
  const span = b[0] - a[0];
  const t = span > 0 ? Math.min(1, Math.max(0, (mm - a[0]) / span)) : 0;
  out[o] = a[1] + (b[1] - a[1]) * t;
  out[o + 1] = a[2] + (b[2] - a[2]) * t;
  out[o + 2] = a[3] + (b[3] - a[3]) * t;
  out[o + 3] = a[4] + (b[4] - a[4]) * t;
}

/** CSS gradient for the legend bar, bottom (Light) to top (Extreme). */
export const LEGEND_GRADIENT = RAMP.slice(1)
  .map(([mm, r, g, b]) => `rgb(${r},${g},${b}) ${((mm / 15) ** 0.45 * 100).toFixed(0)}%`)
  .join(', ');

/**
 * Paints one frame. The grid is regular in lat/lon while the map is Mercator,
 * but over a 3.1 degree span the distortion is well under a pixel, so the field
 * is drawn as one stretched image between the grid's projected corners.
 *
 * Upscaling 27x17 straight to full size shows bilinear facets, so it goes
 * through a x6 intermediate step; the canvas then carries a CSS blur, which is
 * what turns the grid into the reference's soft blobs.
 */
export function paintFrame(
  canvas: HTMLCanvasElement, grid: PrecipGrid, frame: Float32Array, v: Viewport,
): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.round(v.width * dpr);
  const h = Math.round(v.height * dpr);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);

  const cells = document.createElement('canvas');
  cells.width = GRID_NX; cells.height = GRID_NY;
  const cctx = cells.getContext('2d');
  if (!cctx) return;
  const img = cctx.createImageData(GRID_NX, GRID_NY);
  for (let iy = 0; iy < GRID_NY; iy++) {
    for (let ix = 0; ix < GRID_NX; ix++) {
      // The API grid runs south-to-north; canvas rows run top-down.
      const src = (GRID_NY - 1 - iy) * GRID_NX + ix;
      rampAt(frame[src], img.data, (iy * GRID_NX + ix) * 4);
    }
  }
  cctx.putImageData(img, 0, 0);

  const mid = document.createElement('canvas');
  mid.width = GRID_NX * 6; mid.height = GRID_NY * 6;
  const mctx = mid.getContext('2d');
  if (!mctx) return;
  mctx.imageSmoothingEnabled = true;
  mctx.imageSmoothingQuality = 'high';
  mctx.drawImage(cells, 0, 0, mid.width, mid.height);

  const b = gridBounds(grid.lat0, grid.lon0);
  const left = (lonToX(b.west, v.z) * 256 - v.originX) * dpr;
  const right = (lonToX(b.east, v.z) * 256 - v.originX) * dpr;
  const top = (latToY(b.north, v.z) * 256 - v.originY) * dpr;
  const bottom = (latToY(b.south, v.z) * 256 - v.originY) * dpr;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(mid, left, top, right - left, bottom - top);
}

/**
 * Blends two frames into a scratch buffer. The reference map moves continuously
 * rather than stepping between hours, and holding the raw grid means the
 * in-between states can just be computed.
 *
 * NOTE this is a cross-fade of intensity, not advection: a shower grows and
 * fades in place instead of drifting across the map. Real motion would need
 * optical flow between frames, which 21 km samples cannot support honestly.
 */
export function blendFrames(
  a: Float32Array, b: Float32Array, t: number, out: Float32Array,
): Float32Array {
  for (let i = 0; i < a.length; i++) out[i] = a[i] + (b[i] - a[i]) * t;
  return out;
}

/** Grid value nearest a coordinate — used for the readout under the marker. */
export function sampleAt(
  grid: PrecipGrid, values: Float32Array, lat: number, lon: number,
): number {
  const ix = Math.round((lon - grid.lon0) / D_LON + (GRID_NX - 1) / 2);
  const iy = Math.round((lat - grid.lat0) / D_LAT + (GRID_NY - 1) / 2);
  if (ix < 0 || ix >= GRID_NX || iy < 0 || iy >= GRID_NY) return 0;
  return values[iy * GRID_NX + ix];
}
