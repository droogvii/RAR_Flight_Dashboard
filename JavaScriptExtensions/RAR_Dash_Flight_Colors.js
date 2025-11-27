/*
 * ---- THEME COLORS CONFIG ----
 */

const rar_themeColors = {
  1: {
    background: "#000000",
    card: "#181D26",
    border: "#2E3646",
    green: "#02FF39",
    yellow: "#FFEA00",
    red: "#FF0040",
    purple: "#9C3FFF",
    blue: "#0EA5E9",
    tc: "#0EA5E9",
    map: "#02FF39",
    abs: "#FFEA00",
    bb: "#FF0040",
  },
  2: {
    background: "#E6EFFA",
    card: "#D4DDED",
    border: "#C6D2E5",
    green: "#00A865",
    yellow: "#FFA600",
    red: "#FF0040",
    purple: "#9C3FFF",
    blue: "#00B0FF",
    tc: "#00B0FF",
    map: "#00A865",
    abs: "#FFA600",
    bb: "#FF0040",
  },
  3: {
    background: "#000000",
    card: "#221515",
    border: "#470C0C",
    green: "#1AC39E",
    yellow: "#FFFF00",
    red: "#E70130",
    purple: "#7B3FFF",
    blue: "#26BCFF",
    tc: "#FF7396",
    map: "#FF7396",
    abs: "#FF7396",
    bb: "#FF0040",
  },
  4: {
    background: "#000000",
    card: "#131C20",
    border: "#4B0B44",
    green: "#1AC39E",
    yellow: "#FFFF00",
    red: "#E70130",
    purple: "#7B3FFF",
    blue: "#26BCFF",
    tc: "#9B4392",
    map: "#9B4392",
    abs: "#9B4392",
    bb: "#00B7FF",
  },
};

const rar_darkModeColors = {
  value: {
    0: () => $prop("RARLEDs.TDMColorMain") ?? "#EA3323",
    1: "#EA3323",
    2: "#009EFC",
    3: "#EA38DE",
    4: "#F09236",
  },
  fadeValue: {
    0: () => $prop("RARLEDs.TDMColorMain") ?? "#99EA3323",
    1: "#99EA3323",
    2: "#99009EFC",
    3: "#99EA38DE",
    4: "#99F09236",
  },
  label: {
    0: () => $prop("RARLEDs.TDMColorAlt") ?? "#F07335",
    1: "#F07335",
    2: "#005AF5",
    3: "#EA3891",
    4: "#EA4E23",
  },
};

const rar_regularModeColors = {
  value: {
    1: "#D3E4FF",
    2: "#364251",
    3: "#FFE4E9",
    4: "#FFE8FD",
  },
  label: {
    1: "#5C6678",
    2: "#8896AE",
    3: "#E70130",
    4: "#9B4392",
  },
  valueFaded: {
    1: "#99D3E4FF",
    2: "#99364251",
    3: "#99FFE4E9",
    4: "#99FFE8FD",
  },
};

/*
 * ---- HELPER ----
 */

function rar_getThemeValue(key) {
  const theme = rar_getDashboardTheme();
  return rar_themeColors[theme]?.[key] || "";
}

function rar_getColors() {
  return {
    value: rar_getValueColor(),
    valueFaded: rar_getValueFadedColor(),
    label: rar_getLabelColor(),
    red: rar_getRedColor(),
    green: rar_getGreenColor(),
    purple: rar_getPurpleColor(),
    yellow: rar_getYellowColor(),
    blue: rar_getBlueColor(),
  };
}

/*
 * ---- COLORS ----
 */

function rar_getBackgroundColor() {
  return rar_getThemeValue("background");
}

function rar_getCardColor() {
  return rar_getThemeValue("card");
}

function rar_getBorderColor() {
  return rar_getThemeValue("border");
}

function rar_getGreenColor() {
  return rar_getThemeValue("green");
}

function rar_getYellowColor() {
  return rar_getThemeValue("yellow");
}

function rar_getRedColor() {
  return rar_getThemeValue("red");
}

function rar_getPurpleColor() {
  return rar_getThemeValue("purple");
}

function rar_getBlueColor() {
  return rar_getThemeValue("blue");
}

/*
 * ---- CAR SETTING COLORS ----
 */

function rar_getTcColor() {
  return rar_isDarkMode()
    ? rar_getDarkModeLabelColor()
    : rar_getThemeValue("tc");
}

function rar_getMapColor() {
  return rar_isDarkMode()
    ? rar_getDarkModeLabelColor()
    : rar_getThemeValue("map");
}

function rar_getAbsColor() {
  return rar_isDarkMode()
    ? rar_getDarkModeLabelColor()
    : rar_getThemeValue("abs");
}

function rar_getBBColor() {
  return rar_isDarkMode()
    ? rar_getDarkModeLabelColor()
    : rar_getThemeValue("bb");
}

/*
 * ---- VALUE COLORS ----
 */

function rar_getValueColor() {
  return rar_isDarkMode()
    ? rar_getDarkModeValueColor()
    : rar_getRegularModeValueColor();
}

function rar_getRegularModeValueColor() {
  const theme = rar_getDashboardTheme();
  return rar_regularModeColors.value[theme] || rar_regularModeColors.value[1];
}

function rar_getDarkModeValueColor() {
  //const darkTheme = $prop('RARLEDs.TDMColor');
  const darkTheme = rar_TDM_Color();
  const colorConfig = rar_darkModeColors.value[darkTheme];

  if (typeof colorConfig === "function") {
    return colorConfig();
  }

  return colorConfig || rar_darkModeColors.value[1];
}

/*
 * ---- VALUE FADED COLORS ----
 */

function rar_getValueFadedColor() {
  return rar_isDarkMode()
    ? rar_getDarkModeValueFadedColor()
    : rar_getRegularModeValueFadedColor();
}

function rar_getRegularModeValueFadedColor() {
  const theme = rar_getDashboardTheme();
  return (
    rar_regularModeColors.valueFaded[theme] ||
    rar_regularModeColors.valueFaded[1]
  );
}

function rar_getDarkModeValueFadedColor() {
  const darkTheme = rar_TDM_Color();
  const colorConfig = rar_darkModeColors.valueFaded[darkTheme];

  if (typeof colorConfig === "function") {
    return colorConfig();
  }

  return colorConfig || rar_darkModeColors.valueFaded[1];
}

/*
 * ---- LABEL COLORS ----
 */

function rar_getLabelColor() {
  return rar_isDarkMode()
    ? rar_getDarkModeLabelColor()
    : rar_getRegularModeLabelColor();
}

function rar_getRegularModeLabelColor() {
  const theme = rar_getDashboardTheme();
  return rar_regularModeColors.label[theme] || rar_regularModeColors.label[1];
}

function rar_getDarkModeLabelColor() {
  const darkTheme = rar_TDM_Color();
  const colorConfig = rar_darkModeColors.label[darkTheme];

  if (typeof colorConfig === "function") {
    return colorConfig();
  }

  return colorConfig || rar_darkModeColors.label[1];
}

/*
 * ---- PLUGIN VALUES ----
 */

function rar_getDashboardTheme() {
  if (rar_isDarkMode()) {
    return 1;
  }

  const roadTheme = $prop("RARLEDs.Dash.RoadTheme") ?? 1;

  if (roadTheme !== 4) {
    return roadTheme;
  }

  const ConnectedDevices = $prop("RARLEDs.ConnectedDevices") ?? [""];
  const isAuthorizedDeviceConnected =
    ConnectedDevices.includes("Precision Sim Engineering DD-R") ||
    ConnectedDevices.includes("Precision Sim Engineering DD-X");

  return isAuthorizedDeviceConnected ? 4 : 1;
}

function rar_isDarkMode() {
  return (
    rar_TDM_State($prop("RARLEDs.Dash.RoadDarkMode") ?? true) &&
    rar_TDM_State($prop("RARLEDs.TDMDashboard") ?? true)
  );
}

function rar_isDarkModeGlobal() {
  return rar_TDM_State(true);
}
