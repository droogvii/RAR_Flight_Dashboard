/*
 * ---- NOTIFICATION ----
 */

const TRACKED_VALUES_CONFIG = [
    {
        key: "leftMultiPositional",
        label: "MULTI POSITIONAL",
        // ignoreInitialValues: [],
        getValue: () => dnr_leftMultiPositionalLabelUI()
    },
        {
        key: "rightMultiPositional",
        label: "MULTI POSITIONAL",
         // ignoreInitialValues: [],
        getValue: () => dnr_rightMultiPositionalLabelUI()
    },
    {
        key: "brakeBias", 
        label: "BRAKE BIAS",
        ignoreInitialValues: [0, "0", "", 100, null, undefined],
        getValue: () => dnr_getBrakeBiasValue()
    },
    {
        key: "gsiBP", 
        label: "Bitepoint",
        ignoreInitialValues: [0, "", null, undefined],
        getValue: () => dnr_getGSIBitepointValue()
    },
    {
        key: "tc", 
        label: "TC",
        ignoreInitialValues: ["", null, undefined],
        getValue: () => dnr_getTcValue()
    },
    {
        key: "tc2", 
        label: "TC CUT",
        ignoreInitialValues: ["", null, undefined],
        getValue: () => dnr_getTc2Value()
    },
    {
        key: "abs", 
        label: "ABS",
        ignoreInitialValues: ["", null, undefined],
        getValue: () => dnr_getAbsValue()
    },
    {
        key: "map", 
        label: "MAP",
        ignoreInitialValues: ["", null, undefined],
        getValue: () => dnr_getMapValue()
    },
    {
        key: "ers", 
        label: "ERS",
        ignoreInitialValues: ["", null, undefined],
        getValue: () => dnr_getERSModeNotification(true)
    },
    {
        key: "fabr", 
        label: "FRONT ARB",
        ignoreInitialValues: ["", null, undefined],
        getValue: () => dnr_getFARB()
    },
    {
        key: "rabr", 
        label: "REAR ARB",
        ignoreInitialValues: ["", null, undefined],
        getValue: () => dnr_getRARB()
    }
];

function addTrackedValue(key, label, getValueFunction) {
    TRACKED_VALUES_CONFIG.push({
        key: key,
        label: label,
        getValue: getValueFunction
    });
}

function dnr_showNotification() {
    const currentTime = Date.now();
    
    if (!root["notificationSystem"]) {
        root["notificationSystem"] = {
            trackedValues: {},
            currentNotification: null,
            lastResult: false,
            lastFrameTime: 0,
            durationCache: { value: null, time: 0 },
            captureCache: {}
        };
    }

    const system = root["notificationSystem"];
    
    // Cache par frame (16ms)
    if (currentTime - system.lastFrameTime < 16) {
        return system.lastResult;
    }
    system.lastFrameTime = currentTime;
    
    // Cache de durée (1 seconde)
    if (!system.durationCache.value || currentTime - system.durationCache.time > 1000) {
        system.durationCache.value = $prop('DNRLEDs.Dash.RoadAlertDuration') ?? 3000;
        system.durationCache.time = currentTime;
    }
    
    // Réutilisation du cache de capture
    const capturedValues = system.captureCache;
    
    for (let i = 0; i < TRACKED_VALUES_CONFIG.length; i++) {
        const config = TRACKED_VALUES_CONFIG[i];
        const currentValue = config.getValue();
        
        if (!capturedValues[config.key]) {
            capturedValues[config.key] = { value: null, config: config };
        }
        capturedValues[config.key].value = currentValue;
    }
    
    let hasNewNotification = false;
    let latestNotification = system.currentNotification;
    
    for (const key in capturedValues) {
        const captured = capturedValues[key];
        const currentValue = captured.value;
        const config = captured.config;
        
        if (currentValue == null || currentValue === '') continue;
        
        if (!system.trackedValues[key]) {
            if (config.ignoreInitialValues && config.ignoreInitialValues.includes(currentValue)) continue;
            
            system.trackedValues[key] = {
                value: currentValue,
                label: config.label,
                lastChangeTime: currentTime,
                previousValue: null
            };
            continue;
        }
        
        const tracked = system.trackedValues[key];
        
        if (currentValue !== tracked.value) {
            if (config.ignoreInitialValues && config.ignoreInitialValues.includes(currentValue)) continue;
            
            const previousValue = tracked.value;
            tracked.previousValue = previousValue;
            tracked.value = currentValue;
            tracked.lastChangeTime = currentTime;
            
            if (!latestNotification) {
                latestNotification = {};
            }
            latestNotification.value = currentValue;
            latestNotification.label = config.label;
            latestNotification.startTime = currentTime;
            latestNotification.previousValue = previousValue;
            latestNotification.key = key;
            
            hasNewNotification = true;
        }
    }
    
    let result;
    
    if (hasNewNotification) {
        system.currentNotification = latestNotification;
        result = true;
    } else if (!system.currentNotification) {
        result = false;
    } else {
        const elapsed = currentTime - system.currentNotification.startTime;
        if (elapsed < system.durationCache.value) {
            result = true;
        } else {
            system.currentNotification = null;
            result = false;
        }
    }
    
    system.lastResult = result;
    return result;
}

function dnr_getNotificationValue() {
    dnr_showNotification();
    if (!root["notificationSystem"] || !root["notificationSystem"].currentNotification) {
        return null;
    }
    return root["notificationSystem"].currentNotification.value;
}

function dnr_getNotificationLabel() {
    dnr_showNotification();
    if (!root["notificationSystem"] || !root["notificationSystem"].currentNotification) {
        return null;
    }
    return root["notificationSystem"].currentNotification.label;
}

function dnr_getNotificationTrend() {
    dnr_showNotification();
    if (!root["notificationSystem"] || !root["notificationSystem"].currentNotification) {
        return null;
    }
    
    const notification = root["notificationSystem"].currentNotification;
    const currentValue = notification.value;
    const previousValue = notification.previousValue;
    
    const currentNum = parseFloat(currentValue);
    const previousNum = parseFloat(previousValue);
    
    if (isNaN(currentNum) || isNaN(previousNum)) {
        return null;
    }
    
    if (currentNum > previousNum) {
        return "increase";
    } else if (currentNum < previousNum) {
        return "decrease";
    } else {
        return null;
    }
}

function dnr_getTrackedValue(key) {
    dnr_showNotification();
    if (!root["notificationSystem"] || !root["notificationSystem"].trackedValues[key]) {
        return null;
    }
    return root["notificationSystem"].trackedValues[key].value;
}

function dnr_getTrackedLabel(key) {
    dnr_showNotification();
    if (!root["notificationSystem"] || !root["notificationSystem"].trackedValues[key]) {
        return null;
    }
    return root["notificationSystem"].trackedValues[key].label;
}

function dnr_getTrackedData(key) {
    dnr_showNotification();
    if (!root["notificationSystem"] || !root["notificationSystem"].trackedValues[key]) {
        return null;
    }
    return root["notificationSystem"].trackedValues[key];
}

function dnr_getAllTrackedValues() {
    dnr_showNotification();
    if (!root["notificationSystem"]) {
        return {};
    }
    
    const result = {};
    for (const [key, data] of Object.entries(root["notificationSystem"].trackedValues)) {
        result[key] = {
            value: data.value,
            label: data.label
        };
    }
    return result;
}

function dnr_isKeyTracked(key) {
    dnr_showNotification();
    return root["notificationSystem"] && 
           root["notificationSystem"].trackedValues[key] !== undefined;
}

function dnr_getNotificationKey() {
    if (!root["notificationSystem"] || !root["notificationSystem"].currentNotification) {
        return null;
    }
    return root["notificationSystem"].currentNotification.key;
}

function dnr_getNotificationPreviousValue() {
    if (!root["notificationSystem"] || !root["notificationSystem"].currentNotification) {
        return null;
    }
    return root["notificationSystem"].currentNotification.previousValue;
}

function dnr_resetNotificationSystem() {
    if (root["notificationSystem"]) {
        root["notificationSystem"] = {
            trackedValues: {},
            currentNotification: null,
            lastResult: false
        };
    }
}