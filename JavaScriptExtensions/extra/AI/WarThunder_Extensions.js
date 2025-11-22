/*
 ============================================================================
    WAR THUNDER – JS EXTENSIONS FOR SIMHUB
    Clean variables, auto-detection, warnings, box colors, notifications.
    Metric-only (meters, km/h). No external plugins required.
 ============================================================================
*/

/* ============================================================
    CORE HELPERS
============================================================ */

function wt_num(prop, fallback) {
    let v = $prop(prop);
    if (v === null || v === undefined || isNaN(v)) return fallback;
    return Number(v);
}

function wt_bool(prop, fallback = false) {
    let v = $prop(prop);
    if (v === null || v === undefined) return fallback;
    return !!v;
}

/* ============================================================
    ALTITUDE (AUTO-DETECT)
============================================================ */

function wt_alt() {
    // 1. Preferred: direct altitude in meters
    let meter = wt_num("GameRawData.AltitudeMeter", NaN);
    if (!isNaN(meter) && meter >= 0) return meter;

    // 2. Fallback: Indicators.Altitude_Hour (WT formats alt like 1.23 hours * 3600)
    let hour = wt_num("GameRawData.Indicators.Altitude_Hour", NaN);
    if (!isNaN(hour) && hour !== 0) return hour * 3600; 

    // NOTE: War Thunder uses 1 hour = 3600 seconds. Their indicator value
    // is literally "hours of altitude", so converting to seconds gives meters.

    // 3. Last resort: return 0 so UI never shows "null" or NaN
    return 1000000;
}


/* ============================================================
    AIRSPEED (IAS preferred)
============================================================ */

function wt_speed() {
    let ias = wt_num("GameRawData.Indicators.speed", NaN);
    if (!isNaN(ias)) return ias;

    let tas = wt_num("GameRawData.State.speed", NaN);
    if (!isNaN(tas)) return tas;

    return 0;
}

/* ============================================================
    ATTITUDE
============================================================ */

function wt_pitch()  { return wt_num("GameRawData.Indicators.pitch", 0); }
function wt_roll()   { return wt_num("GameRawData.Indicators.roll", 0); }
function wt_yaw()    { return wt_num("GameRawData.State.course", 0); }

/* ============================================================
    GEAR / FLAPS / ENGINE / BOMBS
============================================================ */

function wt_gearDown() {
    let raw = wt_num("GameRawData.Indicators.gear", NaN);
    if (isNaN(raw)) return false;
    return raw >= 0.5;
}

function wt_flapsPercent() {
    let f = wt_num("GameRawData.Indicators.flaps", 0);
    if (f < 0) return 0;
    if (f > 1) return 1;
    return f;
}

// returns "UP", "COMBAT", "TAKEOFF", "LANDING"
function wt_flapsMode() {
    let f = wt_flapsPercent();
    if (f <= 0.01) return "UP";
    if (f < 0.40) return "COMBAT";
    if (f < 0.75) return "TAKEOFF";
    return "LANDING";
}

function wt_bombBayOpen() {
    return wt_bool("GameRawData.Indicators.bomb_bay", false);
}

function wt_engineRpm() {
    return wt_num("GameRawData.Indicators.rpm", 0);
}

function wt_engineOff() {
    let rpm = wt_engineRpm();
    return rpm < 100; // simple detection
}

/* ============================================================
    WARNING THRESHOLDS
============================================================ */

function wt_altDanger()  { return wt_num("WT.Warning.AltitudeDanger", 100); }
function wt_altCaution() { return wt_num("WT.Warning.AltitudeCaution", 250); }

function wt_spdLow()     { return wt_num("WT.Warning.SpeedLow", 200); }
function wt_spdStall()   { return wt_num("WT.Warning.SpeedStall", 150); }

/* ============================================================
    WARNING LEVELS
============================================================ */

function wt_altWarning() {
    let a = wt_alt();
    if (a <= wt_altDanger())  return 2;
    if (a <= wt_altCaution()) return 1;
    return 0;
}

function wt_speedWarning() {
    let s = wt_speed();
    let a = wt_alt();

    // don’t warn of stall on the runway
    if (a < 10) return 0;

    if (s <= wt_spdStall()) return 2;
    if (s <= wt_spdLow())   return 1;
    return 0;
}

/* ============================================================
    COLOR PALETTE (MILITARY STYLE)
============================================================ */

function wt_colBoxNormal()    { return "#202020"; }
function wt_colTextNormal()   { return "#00FF55"; }
function wt_colWarning()      { return "#AA5500"; }
function wt_colTextOnWarning(){ return "#000000"; }
function wt_colCritical()     { return "#FF0000"; }
function wt_colTextOnCrit()   { return "#000000"; }

/* ============================================================
    COLOR LOGIC (ALTITUDE / SPEED)
============================================================ */

function wt_altBoxColor() {
    let lvl = wt_altWarning();
    if (lvl === 2) return wt_colCritical();
    if (lvl === 1) return wt_colWarning();
    return wt_colBoxNormal();
}

function wt_altTextColor() {
    let lvl = wt_altWarning();
    if (lvl === 2) return wt_colTextOnCrit();
    if (lvl === 1) return wt_colTextOnWarning();
    return wt_colTextNormal();
}

function wt_speedBoxColor() {
    let lvl = wt_speedWarning();
    if (lvl === 2) return wt_colCritical();
    if (lvl === 1) return wt_colWarning();
    return wt_colBoxNormal();
}

function wt_speedTextColor() {
    let lvl = wt_speedWarning();
    if (lvl === 2) return wt_colTextOnCrit();
    if (lvl === 1) return wt_colTextOnWarning();
    return wt_colTextNormal();
}

/* ============================================================
    COLOR LOGIC (GEAR / BOMB BAY / ENGINE)
============================================================ */

function wt_gearBoxColor() {
    return wt_gearDown() ? wt_colCritical() : wt_colBoxNormal();
}

function wt_gearTextColor() {
    return wt_gearDown() ? wt_colTextOnCrit() : wt_colTextNormal();
}

function wt_bombBayBoxColor() {
    return wt_bombBayOpen() ? wt_colCritical() : wt_colBoxNormal();
}

function wt_bombBayTextColor() {
    return wt_bombBayOpen() ? wt_colTextOnCrit() : wt_colTextNormal();
}

function wt_engineBoxColor() {
    return wt_engineOff() ? wt_colCritical() : wt_colBoxNormal();
}

function wt_engineTextColor() {
    return wt_engineOff() ? wt_colTextOnCrit() : wt_colTextNormal();
}

/* ============================================================
    NOTIFICATION SYSTEM (DNR STYLE LITE)
============================================================ */

if (!root.wtNotify) {
    root.wtNotify = {
        last: {},
        current: null,
        startTime: 0,
        duration: 3000
    };
}

const WT_NOTIFY_CONFIG = [
    {
        key: "engine",
        label: "ENGINE",
        getter: () => wt_engineOff() ? "OFF" : "ON",
        ignore: ["ON"]
    },
    {
        key: "gear",
        label: "GEAR",
        getter: () => wt_gearDown() ? "DOWN" : "UP",
        ignore: ["UP"]
    },
    {
        key: "bombbay",
        label: "BOMB BAY",
        getter: () => wt_bombBayOpen() ? "OPEN" : "CLOSED",
        ignore: ["CLOSED"]
    },
    {
        key: "alt",
        label: "ALTITUDE",
        getter: () => {
            let lvl = wt_altWarning();
            if (lvl === 2) return "LOW";
            if (lvl === 1) return "CAUTION";
            return "OK";
        },
        ignore: ["OK"]
    },
    {
        key: "speed",
        label: "SPEED",
        getter: () => {
            let lvl = wt_speedWarning();
            if (lvl === 2) return "STALL";
            if (lvl === 1) return "LOW";
            return "OK";
        },
        ignore: ["OK"]
    }
];

function wt_showNotification() {
    let now = Date.now();
    let sys = root.wtNotify;

    if (now - sys.startTime < sys.duration && sys.current !== null) {
        return true;
    }

    for (let cfg of WT_NOTIFY_CONFIG) {
        let v = cfg.getter();
        if (sys.last[cfg.key] !== v) {
            sys.last[cfg.key] = v;
            if (!cfg.ignore.includes(v)) {
                sys.current = { label: cfg.label, value: v };
                sys.startTime = now;
                return true;
            }
        }
    }

    sys.current = null;
    return false;
}

function wt_notifyLabel() {
    return root.wtNotify.current ? root.wtNotify.current.label : "";
}

function wt_notifyValue() {
    return root.wtNotify.current ? root.wtNotify.current.value : "";
}
