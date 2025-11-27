/* ============================================================
    INDICATORS
============================================================ */

const speed = $prop("DataCorePlugin.GameData.Indicators.speed");

function getType() {
  let plane = $prop("DataCorePlugin.GameData.Indicators.type", NaN);
  if (!isNaN(plane)) return plane;

  return "error";
}

function getSpeed() {
  let ias = $prop("DataCorePlugin.GameData.State.IAS", NaN);
  if (!isNaN(ias)) return ias;

  let simple = $prop("DataCorePlugin.GameData.Indicators.speed");
  if (!isNaN(simple)) return simple;

  return 9000;
}

function getAltitude() {
  let hour = $prop("DataCorePlugin.GameData.Indicators.altitude_hour", NaN);
  if (!isNaN(hour)) return hour;

  let k = $prop("DataCorePlugin.GameData.Indicators.altitude_10k", NaN);
  if (!isNaN(k)) return k;

  return 9000;
}

function getMach() {
  let mach = $prop("DataCorePlugin.GameData.Indicators.mach", NaN);
  if (!isNaN(mach)) return mach;

  return 9000;
}

function getFuel() {
  let fuel = $prop("DataCorePlugin.GameData.Indicators.fuel", NaN);
  if (!isNaN(fuel)) return fuel;

  return 9000;
}
