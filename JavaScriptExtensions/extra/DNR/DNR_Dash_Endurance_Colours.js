/*
 * ---- THEME COLOURS CONFIG ----
 */

const dnr_themeColours = {
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
        bb: "#FF0040"
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
        bb: "#FF0040"
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
        bb: "#FF0040"
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
        bb: "#00B7FF"
    },
};

const dnr_darkModeColours = {
    value: {
        0: () => $prop('DNRLEDs.TDMColourMain') ?? "#EA3323",
        1: "#EA3323",
        2: "#009EFC",
        3: "#EA38DE",
        4: "#F09236"
    },
    fadeValue: {
        0: () => $prop('DNRLEDs.TDMColourMain') ?? "#99EA3323",
        1: "#99EA3323",
        2: "#99009EFC",
        3: "#99EA38DE",
        4: "#99F09236"
    },
    label: {
        0: () => $prop('DNRLEDs.TDMColourAlt') ?? "#F07335",
        1: "#F07335",
        2: "#005AF5",
        3: "#EA3891",
        4: "#EA4E23"
    }
};

const dnr_regularModeColours = {
    value: {
        1: "#D3E4FF",
        2: "#364251",
        3: "#FFE4E9",
        4: "#FFE8FD"
    },
    label: {
        1: "#5C6678",
        2: "#8896AE",
        3: "#E70130",
        4: "#9B4392"
    },
    valueFaded: {
        1: "#99D3E4FF",
        2: "#99364251",
        3: "#99FFE4E9",
        4: "#99FFE8FD"
    }
};

/*
 * ---- HELPER ----
 */

function dnr_getThemeValue(key) {
    const theme = dnr_getDashboardTheme();
    return dnr_themeColours[theme]?.[key] || '';
}

function dnr_getColours() {
    return {
        value: dnr_getValueColour(),
        valueFaded: dnr_getValueFadedColour(),
        label: dnr_getLabelColour(),
        red: dnr_getRedColour(),
        green: dnr_getGreenColour(),
        purple: dnr_getPurpleColour(),
        yellow: dnr_getYellowColour(),
        blue: dnr_getBlueColour()
    };
}

/*
 * ---- COLOURS ----
 */

function dnr_getBackgroundColour() {
    return dnr_getThemeValue('background');
}

function dnr_getCardColour() {
    return dnr_getThemeValue('card');
}

function dnr_getBorderColour() {
    return dnr_getThemeValue('border');
}

function dnr_getGreenColour() {
    return dnr_getThemeValue('green');
}

function dnr_getYellowColour() {
    return dnr_getThemeValue('yellow');
}

function dnr_getRedColour() {
    return dnr_getThemeValue('red');
}

function dnr_getPurpleColour() {
    return dnr_getThemeValue('purple');
}

function dnr_getBlueColour() {
    return dnr_getThemeValue('blue');
}

/*
 * ---- CAR SETTING COLOURS ----
 */

function dnr_getTcColour() {
    return dnr_isDarkMode() ? dnr_getDarkModeLabelColour() : dnr_getThemeValue('tc');
}

function dnr_getMapColour() {
    return dnr_isDarkMode() ? dnr_getDarkModeLabelColour() : dnr_getThemeValue('map');
}

function dnr_getAbsColour() {
    return dnr_isDarkMode() ? dnr_getDarkModeLabelColour() : dnr_getThemeValue('abs');
}

function dnr_getBBColour() {
    return dnr_isDarkMode() ? dnr_getDarkModeLabelColour() : dnr_getThemeValue('bb');
}

/*
 * ---- VALUE COLOURS ----
 */

function dnr_getValueColour() {
    return dnr_isDarkMode() ? dnr_getDarkModeValueColour() : dnr_getRegularModeValueColour();
}

function dnr_getRegularModeValueColour() {
    const theme = dnr_getDashboardTheme();
    return dnr_regularModeColours.value[theme] || dnr_regularModeColours.value[1];
}

function dnr_getDarkModeValueColour() {
    //const darkTheme = $prop('DNRLEDs.TDMColour');
    const darkTheme = dnr_TDM_Colour();
    const colorConfig = dnr_darkModeColours.value[darkTheme];
    
    if (typeof colorConfig === 'function') {
        return colorConfig();
    }
    
    return colorConfig || dnr_darkModeColours.value[1];
}

/*
 * ---- VALUE FADED COLOURS ----
 */

function dnr_getValueFadedColour() {
    return dnr_isDarkMode() ? dnr_getDarkModeValueFadedColour() : dnr_getRegularModeValueFadedColour();
}

function dnr_getRegularModeValueFadedColour() {
    const theme = dnr_getDashboardTheme();
    return dnr_regularModeColours.valueFaded[theme] || dnr_regularModeColours.valueFaded[1];
}

function dnr_getDarkModeValueFadedColour() {
    const darkTheme = dnr_TDM_Colour();
    const colorConfig = dnr_darkModeColours.valueFaded[darkTheme];
    
    if (typeof colorConfig === 'function') {
        return colorConfig();
    }
    
    return colorConfig || dnr_darkModeColours.valueFaded[1];
}

/*
 * ---- LABEL COLOURS ----
 */

function dnr_getLabelColour() {
    return dnr_isDarkMode() ? dnr_getDarkModeLabelColour() : dnr_getRegularModeLabelColour();
}

function dnr_getRegularModeLabelColour() {
    const theme = dnr_getDashboardTheme();
    return dnr_regularModeColours.label[theme] || dnr_regularModeColours.label[1];
}

function dnr_getDarkModeLabelColour() {
    const darkTheme = dnr_TDM_Colour();
    const colorConfig = dnr_darkModeColours.label[darkTheme];
    
    if (typeof colorConfig === 'function') {
        return colorConfig();
    }
    
    return colorConfig || dnr_darkModeColours.label[1];
}

/*
 * ---- PLUGIN VALUES ----
 */

function dnr_getDashboardTheme() {
    
    if (dnr_isDarkMode()) {
        return 1;
    }
    
    const roadTheme = $prop('DNRLEDs.Dash.RoadTheme') ?? 1;
    
    if (roadTheme !== 4) {
        return roadTheme;
    }
    
    const ConnectedDevices = $prop('DNRLEDs.ConnectedDevices') ?? [''];
    const isAuthorizedDeviceConnected = ConnectedDevices.includes('Precision Sim Engineering DD-R') || ConnectedDevices.includes('Precision Sim Engineering DD-X');

    return isAuthorizedDeviceConnected ? 4 : 1;
}

function dnr_isDarkMode() {
    return dnr_TDM_State($prop('DNRLEDs.Dash.RoadDarkMode') ?? true) && dnr_TDM_State($prop('DNRLEDs.TDMDashboard') ?? true);
}

function dnr_isDarkModeGlobal() {
    return dnr_TDM_State(true);
}