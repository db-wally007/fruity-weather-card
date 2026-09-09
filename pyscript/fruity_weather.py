"""Forecast precipitation grid cache — companion for fruity-weather-card.

Fetches Open-Meteo's gridded precipitation forecast ONCE for the whole house
and writes it to config/www/fruity-weather-card/precip-grid.json, which the
card loads from /local/... instead of calling the API itself.

Why this exists
---------------
Open-Meteo's free tier bills PER LOCATION. One 143-point grid request spends
~143 of the 10,000 daily calls, so the ceiling is roughly 70 fetches a day for
the entire household. With the card calling the API directly that budget is
divided by every browser profile that opens the dashboard — tablet, phone and
desktop each keep their own cache — and blowing it returns

    {"error":true,"reason":"Daily API request limit exceeded. Please try again tomorrow."}

for the rest of the UTC day, for everyone. Fetching here instead makes the cost
a flat 143 x 96 = ~13.7k... which is still over, hence REFRESH_MINUTES=15 giving
96 runs -> use 20 min (72 runs, ~10.3k) or the default below.

At REFRESH_MINUTES = 30 the cost is 143 x 48 = ~6.9k calls/day REGARDLESS of how
many dashboards, tablets or phones are open. That is the entire point.

Setup
-----
1. pyscript must already be enabled (it is, for the Protect cache):
       pyscript:
         allow_all_imports: true
         hass_is_global: true
2. Symlink this file into /config/pyscript/:
       ln -s ../www/fruity-weather-card/pyscript/fruity_weather.py \\
             /config/pyscript/fruity_weather.py
3. `pyscript.reload`, then call `pyscript.fruity_weather_sync` once to seed the
   file (otherwise the card waits for the next half-hour tick).

The grid geometry below MUST match GRID_NX / GRID_NY / D_LON / D_LAT in
src/precip-map.ts — the card refuses a file whose dimensions differ.

pyscript notes: `open()` is sandboxed, so file I/O is low-level os.open/os.write;
pyscript-defined functions cannot be handed to task.executor (stdlib callables
can); and the interpreter has no generator expressions — use list comprehensions.
"""

import json
import os
import time
import urllib.request

# ---- grid geometry — keep identical to src/precip-map.ts --------------------
# Spacing is set by the WIDEST view the card can show: the expanded map at its
# minimum zoom is 508 px, and the grid must overhang that on all four sides or
# the field stops mid-frame with a hard edge. Sized off the SOUTH edge, which
# is the tight one — see the long note in src/precip-map.ts.
# The card refuses a file whose nx/ny/dlon/dlat differ from its own.
GRID_NX = 13
GRID_NY = 11
D_LON = 0.48
D_LAT = 0.375

FORECAST_HOURS = 13
FORECAST_QUARTERS = 8

REFRESH_MINUTES = 30
OUT_PATH = "/config/www/fruity-weather-card/precip-grid.json"
API = "https://api.open-meteo.com/v1/forecast"
TIMEOUT = 60

# ---- ten-day hourly for the day-detail card ---------------------------------
# A SINGLE point, so unlike the grid above this one is not about quota: one
# location costs one call whether the browser makes it or this does. It is here
# so every device in the house draws the same numbers from one fetch, and so the
# card keeps working on a dashboard whose browser cannot reach the internet.
#
# The variable list must stay identical to HOURLY_VARS / DAILY_VARS in
# src/hourly-source.ts: the card parses this file with the same code it uses for
# the API response, so a mismatch shows up as missing data rather than an error.
HOURLY_OUT_PATH = "/config/www/fruity-weather-card/precip-hourly.json"
HOURLY_VARS = "temperature_2m,weather_code,precipitation_probability,precipitation"
DAILY_VARS = "precipitation_probability_max,sunrise,sunset"
HOURLY_DAYS = 10


def _write_bytes(path, data):
    """Atomic write — the card must never read a half-written file."""
    tmp = path + ".tmp"
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)
    try:
        os.write(fd, data)
    finally:
        os.close(fd)
    os.replace(tmp, path)


def _grid_coords(lat0, lon0):
    lats = []
    lons = []
    for iy in range(GRID_NY):
        for ix in range(GRID_NX):
            lats.append(round(lat0 + (iy - (GRID_NY - 1) / 2) * D_LAT, 4))
            lons.append(round(lon0 + (ix - (GRID_NX - 1) / 2) * D_LON, 4))
    return lats, lons


def _epoch_ms(iso):
    """Open-Meteo returns naive UTC ('2026-09-02T17:00'); parse it as such."""
    return int(time.mktime(time.strptime(iso, "%Y-%m-%dT%H:%M")) * 1000) \
        - int(time.timezone * 1000)


def _fetch_grid(lat0, lon0):
    lats, lons = _grid_coords(lat0, lon0)
    url = (
        API
        + "?latitude=" + ",".join([str(v) for v in lats])
        + "&longitude=" + ",".join([str(v) for v in lons])
        + "&hourly=precipitation&forecast_hours=" + str(FORECAST_HOURS)
        + "&minutely_15=precipitation&forecast_minutely_15=" + str(FORECAST_QUARTERS)
        + "&timezone=UTC"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "fruity-weather-card"})
    resp = task.executor(urllib.request.urlopen, req, timeout=TIMEOUT)
    try:
        body = task.executor(resp.read)
    finally:
        resp.close()
    points = json.loads(body.decode("utf-8"))
    if not isinstance(points, list):
        points = [points]
    if len(points) != GRID_NX * GRID_NY:
        raise ValueError(
            "open-meteo returned %d of %d points" % (len(points), GRID_NX * GRID_NY)
        )

    h_times = [_epoch_ms(t) for t in points[0]["hourly"]["time"]]
    q_times = [_epoch_ms(t) for t in points[0]["minutely_15"]["time"]]

    h_frames = []
    for f in range(len(h_times)):
        h_frames.append([round(p["hourly"]["precipitation"][f] or 0, 2) for p in points])
    q_frames = []
    for f in range(len(q_times)):
        q_frames.append(
            [round(p["minutely_15"]["precipitation"][f] or 0, 2) for p in points]
        )

    return {
        "v": 3,
        "fetchedAt": int(time.time() * 1000),
        "lat0": lat0,
        "lon0": lon0,
        "nx": GRID_NX,
        "ny": GRID_NY,
        "dlon": D_LON,
        "dlat": D_LAT,
        "hourly": {"times": h_times, "frames": h_frames},
        "quarter": {"times": q_times, "frames": q_frames},
    }


def _sync():
    lat0 = round(float(hass.config.latitude), 6)
    lon0 = round(float(hass.config.longitude), 6)
    try:
        grid = _fetch_grid(lat0, lon0)
    except Exception as err:
        # Keep whatever is already on disk. A stale grid beats no grid, and the
        # daily-quota error cannot be retried away before midnight UTC anyway.
        log.warning("fruity_weather: grid fetch failed, keeping previous file: %s", err)
        return False
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    _write_bytes(OUT_PATH, json.dumps(grid, separators=(",", ":")).encode("utf-8"))
    log.info(
        "fruity_weather: wrote %d points x %d hourly frames to %s",
        GRID_NX * GRID_NY, len(grid["hourly"]["times"]), OUT_PATH,
    )
    return True


def _fetch_hourly(lat0, lon0):
    """Ten days of hourly forecast for the home point, plus the daily peaks.

    `timezone=auto` is deliberate and differs from the grid above, which uses
    UTC. The card keys this data by LOCAL date and reads the hour straight out
    of the timestamp string, so the provider doing the conversion removes all
    date arithmetic — and with it the DST bugs that arithmetic invites.
    """
    url = (
        API
        + "?latitude=" + str(lat0) + "&longitude=" + str(lon0)
        + "&hourly=" + HOURLY_VARS
        + "&daily=" + DAILY_VARS
        + "&forecast_days=" + str(HOURLY_DAYS)
        + "&timezone=auto"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "fruity-weather-card"})
    resp = task.executor(urllib.request.urlopen, req, timeout=TIMEOUT)
    try:
        body = task.executor(resp.read)
    finally:
        resp.close()
    data = json.loads(body.decode("utf-8"))

    hourly = data.get("hourly") or {}
    daily = data.get("daily") or {}
    if not hourly.get("time"):
        raise ValueError("open-meteo returned no hourly points")

    # Only the fields the card reads are written out, so the file stays small
    # and a provider adding columns cannot quietly bloat it.
    out_hourly = {"time": hourly["time"]}
    for key in HOURLY_VARS.split(","):
        out_hourly[key] = hourly.get(key) or []
    out_daily = {"time": daily.get("time") or []}
    for key in DAILY_VARS.split(","):
        out_daily[key] = daily.get(key) or []

    return {
        "v": 2,
        "fetchedAt": int(time.time() * 1000),
        "hourly": out_hourly,
        "daily": out_daily,
    }


def _sync_hourly():
    lat0 = round(float(hass.config.latitude), 4)
    lon0 = round(float(hass.config.longitude), 4)
    try:
        payload = _fetch_hourly(lat0, lon0)
    except Exception as err:
        # As with the grid: a stale file beats no file, and the card falls back
        # to calling the API itself if this one goes too far out of date.
        log.warning("fruity_weather: hourly fetch failed, keeping previous file: %s", err)
        return False
    os.makedirs(os.path.dirname(HOURLY_OUT_PATH), exist_ok=True)
    _write_bytes(HOURLY_OUT_PATH, json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    log.info(
        "fruity_weather: wrote %d hourly points and %d daily to %s",
        len(payload["hourly"]["time"]), len(payload["daily"]["time"]), HOURLY_OUT_PATH,
    )
    return True


@service
def fruity_weather_sync():
    """Fetch the precipitation grid and the hourly forecast now."""
    _sync()
    _sync_hourly()


@time_trigger("cron(0,30 * * * *)")
def fruity_weather_periodic():
    """Refresh every 30 minutes — 48 runs/day, ~6.9k of the 10k daily calls."""
    _sync()
    _sync_hourly()


def _stale(path):
    """Module level, not nested: pyscript's interpreter is not CPython and
    closures are one of the places it diverges. Keep helpers flat."""
    if not os.path.exists(path):
        return True
    return (time.time() - os.path.getmtime(path)) / 60 > REFRESH_MINUTES


@time_trigger("startup")
def fruity_weather_startup():
    """Seed either file if it is missing or older than one refresh interval."""
    if _stale(OUT_PATH):
        _sync()
    if _stale(HOURLY_OUT_PATH):
        _sync_hourly()
