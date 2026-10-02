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
3. Schedule it from Home Assistant (below), then `pyscript.reload`.

There is deliberately NO schedule in here. Call pyscript.fruity_weather_sync from
a Home Assistant SCRIPT, on an automation's schedule: a pyscript timer leaves no
run history, so a failing fetch would only ever reach the log. The action RETURNS
the outcome - {"ok": true} or {"ok": false, "error": "..."} - because an
exception raised here is caught and logged by pyscript and never reaches the
caller. The calling script checks `ok` and stops with an error, which records a
failed run that monitoring can see. Every 30 minutes, to match REFRESH_MINUTES,
and once at Home Assistant's start with only_if_stale, so a restart republishes
the sensors without spending 143 calls of the daily quota.

Run it at :06 and :36, NOT on the round minute — see the note on RETRIES below.
Scheduling on :00/:30 put every run into the same load spike as every other
cron on the internet and Open-Meteo answered 503 to all of them:

    script:
      fruity_weather_sync:
        fields:
          only_if_stale:
            selector:
              boolean:
        sequence:
          - action: pyscript.fruity_weather_sync
            data:
              only_if_stale: "{{ only_if_stale | default(false) }}"
            response_variable: sync
          - if: "{{ not (sync is mapping and sync.ok | default(false)) }}"
            then:
              - stop: Fruity weather sync failed
                error: true

    automation:
      - triggers:
          # Two triggers, not one: time_pattern takes a single minute or a
          # "/N" step, never a comma list — "6,36" loads as None and disables
          # the automation outright.
          - trigger: time_pattern
            minutes: 6
          - trigger: time_pattern
            minutes: 36
          - trigger: homeassistant
            event: start
            id: start
        actions:
          - action: script.turn_on
            target: {entity_id: script.fruity_weather_sync}
            data:
              variables:
                only_if_stale: "{{ trigger.id == 'start' }}"

The grid geometry below MUST match GRID_NX / GRID_NY / D_LON / D_LAT in
src/precip-map.ts — the card refuses a file whose dimensions differ.

pyscript notes: `open()` is sandboxed, so file I/O is low-level os.open/os.write;
pyscript-defined functions cannot be handed to task.executor (stdlib callables
can); and the interpreter has no generator expressions — use list comprehensions.
"""

import json
import os
import time
import urllib.error
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

# The calling automation's interval. Only only_if_stale reads it: a file older
# than this is refetched at startup, a younger one is reused.
REFRESH_MINUTES = 30

# Open-Meteo sheds load on the round minute, when every cron on the internet
# fires at once. Measured 2026-10-02: twelve consecutive scheduled runs at :00
# and :30 all returned 503, while the identical request issued ad hoc from the
# same container returned 200 in 0.1s every time — including three 143-point
# grid requests back to back, which rules out our own burst as the cause.
#
# Two defences, because moving the schedule alone is not enough: the automation
# in the docstring fires at :06 and :36 to miss the herd, and these retries ride
# out a 503 that lands anyway. Without them one transient failure left the file
# stale for a whole refresh interval.
RETRIES = 3
RETRY_BACKOFF_S = 20

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
DAILY_VARS = (
    "precipitation_probability_max,sunrise,sunset"
    ",temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum"
)
# Only needed by forecast_source: open-meteo, but always fetched: it rides the
# same request, and a file missing them would silently degrade that mode.
CURRENT_VARS = (
    "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code"
    ",wind_speed_10m,wind_direction_10m,wind_gusts_10m"
)
HOURLY_DAYS = 10


def _get(url):
    """GET with retries, returning the body as bytes.

    Retries any 5xx and any transport error, not 4xx: a bad request or an
    exhausted daily quota will fail identically however many times it is sent,
    and retrying those would only spend more of the allowance.
    """
    last = None
    for attempt in range(RETRIES):
        if attempt:
            task.sleep(RETRY_BACKOFF_S * attempt)
        req = urllib.request.Request(url, headers={"User-Agent": "fruity-weather-card"})
        try:
            resp = task.executor(urllib.request.urlopen, req, timeout=TIMEOUT)
            try:
                return task.executor(resp.read)
            finally:
                resp.close()
        except urllib.error.HTTPError as err:
            last = err
            if err.code < 500:
                raise
            log.warning(
                "fruity_weather: HTTP %s on attempt %d of %d, retrying",
                err.code, attempt + 1, RETRIES,
            )
        except Exception as err:
            last = err
            log.warning(
                "fruity_weather: %s on attempt %d of %d, retrying",
                type(err).__name__, attempt + 1, RETRIES,
            )
    raise last


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
    body = _get(url)
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
    """Fetch and write the grid. Returns None, or why it failed."""
    lat0 = round(float(hass.config.latitude), 6)
    lon0 = round(float(hass.config.longitude), 6)
    try:
        grid = _fetch_grid(lat0, lon0)
    except Exception as err:
        # Keep whatever is already on disk. A stale grid beats no grid, and the
        # daily-quota error cannot be retried away before midnight UTC anyway.
        # The run still FAILS: the caller reports it, the file is just kept.
        return f"grid fetch failed, kept the previous file: {err}"
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    _write_bytes(OUT_PATH, json.dumps(grid, separators=(",", ":")).encode("utf-8"))
    log.info(
        "fruity_weather: wrote %d points x %d hourly frames to %s",
        GRID_NX * GRID_NY, len(grid["hourly"]["times"]), OUT_PATH,
    )
    return None


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
        + "&current=" + CURRENT_VARS
        + "&forecast_days=" + str(HOURLY_DAYS)
        + "&timezone=auto"
    )
    body = _get(url)
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

    # Current conditions are a flat object, not arrays; copy only what is asked
    # for, same rule as the two blocks above.
    cur = data.get("current") or {}
    out_current = {}
    for key in CURRENT_VARS.split(","):
        if cur.get(key) is not None:
            out_current[key] = cur.get(key)

    return {
        "v": 3,
        "fetchedAt": int(time.time() * 1000),
        "hourly": out_hourly,
        "daily": out_daily,
        "current": out_current,
    }


def _sync_hourly():
    """Fetch and write the ten-day hourly file. Returns None, or why it failed."""
    lat0 = round(float(hass.config.latitude), 4)
    lon0 = round(float(hass.config.longitude), 4)
    try:
        payload = _fetch_hourly(lat0, lon0)
    except Exception as err:
        # As with the grid: a stale file beats no file, and the card falls back
        # to calling the API itself if this one goes too far out of date.
        return f"hourly fetch failed, kept the previous file: {err}"
    os.makedirs(os.path.dirname(HOURLY_OUT_PATH), exist_ok=True)
    _write_bytes(HOURLY_OUT_PATH, json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    _publish_today(payload)
    log.info(
        "fruity_weather: wrote %d hourly points and %d daily to %s",
        len(payload["hourly"]["time"]), len(payload["daily"]["time"]), HOURLY_OUT_PATH,
    )
    return None


# WMO code -> Home Assistant condition. Must match conditionForCode() in
# src/hourly-source.ts, or a dashboard reading these sensors would pick
# different scene artwork from the card sitting next to it.
def _condition_for_code(code):
    if code == 0:
        return "sunny"
    if code in (1, 2):
        return "partlycloudy"
    if code == 3:
        return "cloudy"
    if code in (45, 48):
        return "fog"
    if 51 <= code <= 57:
        return "rainy"
    if 61 <= code <= 65:
        return "pouring" if code >= 65 else "rainy"
    if code in (66, 67):
        return "snowy-rainy"
    if 71 <= code <= 77:
        return "snowy"
    if 80 <= code <= 82:
        return "pouring" if code == 82 else "rainy"
    if code in (85, 86):
        return "snowy"
    if code == 95:
        return "lightning"
    if code in (96, 99):
        return "lightning-rainy"
    return "cloudy"


def _publish_today(payload):
    """Expose today's high, low and condition as plain sensors.

    A dashboard button sitting beside the card must not disagree with it, and
    reading a weather ENTITY cannot guarantee that even on the same provider:
    the Home Assistant integration polls on its own schedule and derives its
    current condition separately, so it drifts a step away from what the card
    draws — observed 2026-09-17, the card showing `partlycloudy` while the
    entity said `cloudy`. These come from the exact bytes the card reads, so
    the two cannot differ.
    """
    daily = payload.get("daily") or {}
    times = daily.get("time") or []
    if not times:
        return
    hi = (daily.get("temperature_2m_max") or [None])[0]
    lo = (daily.get("temperature_2m_min") or [None])[0]
    code = (daily.get("weather_code") or [None])[0]
    cur = payload.get("current") or {}
    now_code = cur.get("weather_code")

    if hi is not None:
        state.set("sensor.weather_today_high", round(hi),
                  {"unit_of_measurement": "°C", "friendly_name": "Weather Today High",
                   "device_class": "temperature", "state_class": "measurement"})
    if lo is not None:
        state.set("sensor.weather_today_low", round(lo),
                  {"unit_of_measurement": "°C", "friendly_name": "Weather Today Low",
                   "device_class": "temperature", "state_class": "measurement"})
    if now_code is not None:
        state.set("sensor.weather_now_condition", _condition_for_code(int(now_code)),
                  {"friendly_name": "Weather Now Condition"})
    if code is not None:
        state.set("sensor.weather_today_condition", _condition_for_code(int(code)),
                  {"friendly_name": "Weather Today Condition"})


def _failed(reason):
    log.error(f"fruity_weather: {reason}")
    return {"ok": False, "error": reason}


@service(supports_response="optional")
def fruity_weather_sync(only_if_stale=False):
    """Fetch the precipitation grid and the hourly forecast now. Returns ok, or the error.

    only_if_stale is for Home Assistant's start. It fetches only a file older than
    REFRESH_MINUTES, and republishes the sensors from a fresh one instead. The
    sensors are set with state.set, which writes to the state machine and nothing
    else, so they do not survive a restart. Publishing them only inside
    _sync_hourly() meant a restart with a fresh file skipped the fetch, and every
    card reading them stayed blank until the next half-hour run.
    """
    errors = []
    if not only_if_stale or _stale(OUT_PATH):
        err = _sync()
        if err:
            errors.append(err)
    if not only_if_stale or _stale(HOURLY_OUT_PATH) or not _republish():
        # The last case: the file is fresh but unreadable - fetch rather than
        # leave the sensors missing.
        err = _sync_hourly()
        if err:
            errors.append(err)
    if errors:
        return _failed("; ".join(errors))
    return {"ok": True}


def _stale(path):
    """Module level, not nested: pyscript's interpreter is not CPython and
    closures are one of the places it diverges. Keep helpers flat."""
    if not os.path.exists(path):
        return True
    return (time.time() - os.path.getmtime(path)) / 60 > REFRESH_MINUTES


def _read_json(path):
    """Low-level read: pyscript sandboxes the builtin open()."""
    fd = os.open(path, os.O_RDONLY)
    try:
        chunks = []
        while True:
            b = os.read(fd, 65536)
            if not b:
                break
            chunks.append(b)
    finally:
        os.close(fd)
    return json.loads(b"".join(chunks).decode("utf-8"))


@service
def fruity_weather_publish():
    """Republish today's sensors from the cached file, without fetching.

    Separate from fruity_weather_sync so the state machine can be repopulated
    without spending an API call — and so this path is testable on its own.
    """
    return _republish()


def _republish():
    try:
        _publish_today(_read_json(HOURLY_OUT_PATH))
        log.info("fruity_weather: republished today's sensors from the cached file")
        return True
    except Exception as err:
        log.warning("fruity_weather: could not republish from cache: %s", err)
        return False
