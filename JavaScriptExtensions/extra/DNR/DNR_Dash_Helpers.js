function dnr_isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
}

function dnr_truncateWithEllipsis(text, maxLength) {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  if (maxLength <= 3) return '.'.repeat(maxLength);

  return text.substring(0, maxLength - 3) + '...';
}

function dnr_formatName(fullName, reverse = false) {
  if (!fullName || typeof fullName !== 'string') return '';
  fullName = fullName.trim().replace(/^\(\w\)\s*/, '');

  const parts = fullName.split(/\s+/);
  if (parts.length < 2) return fullName.toUpperCase();

  const lastName = parts[parts.length - 1];
  const firstNames = parts.slice(0, -1);
  const firstName = firstNames[0].toUpperCase();

  if (reverse) {
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstName} ${lastInitial}.`;
  } else {
    const firstInitial = firstName.charAt(0).toUpperCase();
    return `${firstInitial}. ${lastName.toUpperCase()}`;
  }
}

function dnr_convert24To12(time, showPeriod = true) {
    let hours = format(time,'hh')
    let minutes = format(time,'mm')
    let period = hours >= 12 ? "PM" : "AM";
    let hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${showPeriod ? period : ''}`;
}

function dnr_getPositiveOrZero(value) {
    return value >= 0 ? value : 0;
}

function dnr_defaultIfNegative(value, defaultValue) {
    return value < 0 ? defaultValue : value;
}

function dnr_isValidValue(value) {
    return value != null && value !== -1;
}

function dnr_detectLapChange() {
    const currentLap = $prop("CurrentLap");
    
    if (root["dnr_lastKnownLap"] == null) {
        root["dnr_lastKnownLap"] = currentLap;
        root["dnr_lapChangeTimestamp"] = null;
        return false;
    }
    
    if (currentLap > root["dnr_lastKnownLap"]) {
        root["dnr_lastKnownLap"] = currentLap;
        root["dnr_lapChangeTimestamp"] = Date.now();
        return true;
    }
    
    return false;
}

function dnr_isNewLapDisplay() {
    dnr_detectLapChange();
    const currentSector = $prop("CurrentSectorIndex");
    
    if (!root["dnr_lapChangeTimestamp"]) return false;
    
    const timeElapsed = Date.now() - root["dnr_lapChangeTimestamp"];
    let duration = ($prop("DNRLEDs.Dash.CoPilotLapRecapPopUpDuration") ?? 4000) + 2000;
    return (timeElapsed >= 2000) && 
           (timeElapsed < duration) && 
           currentSector === 1;
}