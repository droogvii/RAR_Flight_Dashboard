/*
 * ---- MULTI POSITIONAL ----
 */

const multiPositionalDevices = ['0x0483,0xCB14', '0x35EE,0x1049', '0x35EE,0x1053','0x35EE,0x1054', '0x16D0,0x126D', '0x16D0,0x127A','0x16D0,0x126C', '0x0483,0xCB15', '0x1FC9,0x82D3'];

let _deviceCache = {
    lastCheck: 0,
    activeDevice: null,
    checkInterval: 1000
};

let _labelsCache = {
    lastCheck: 0,
    labels: null,
    checkInterval: 5000 
};

let _buttonStateCache = {
    lastFrameTime: 0,
    leftState: { value: '', index: -1 },
    rightState: { value: '', index: -1 }
};

function dnr_isDeviceConnected(deviceId) {
    return getcontrollername(deviceId) !== null;
}

function dnr_findActiveDevice() {
    const currentTime = Date.now();
    
    if (currentTime - _deviceCache.lastCheck < _deviceCache.checkInterval && _deviceCache.activeDevice) {
        return _deviceCache.activeDevice;
    }
    
    for (let i = 0; i < multiPositionalDevices.length; i++) {
        if (dnr_isDeviceConnected(multiPositionalDevices[i])) {
            _deviceCache.activeDevice = multiPositionalDevices[i];
            _deviceCache.lastCheck = currentTime;
            return multiPositionalDevices[i];
        }
    }
    
    _deviceCache.activeDevice = null;
    _deviceCache.lastCheck = currentTime;
    return null;
}

function dnr_getLabels() {
    const currentTime = Date.now();
    
    if (currentTime - _labelsCache.lastCheck < _labelsCache.checkInterval && _labelsCache.labels) {
        return _labelsCache.labels;
    }
    
    _labelsCache.labels = $prop("DNRLEDs.WheelMultiPositionalLabels");
    _labelsCache.lastCheck = currentTime;
    return _labelsCache.labels;
}

function dnr_isButtonActive(deviceId, buttonId) {
    return getcontrollerbuttonstate(deviceId, buttonId) === true;
}

function dnr_getActiveButtonIndex(deviceId, rangeStart, rangeEnd) {
    for (let buttonId = rangeStart; buttonId <= rangeEnd; buttonId++) {
        if (dnr_isButtonActive(deviceId, buttonId)) {
            return buttonId - rangeStart;
        }
    }
    return -1;
}

function dnr_updateButtonStates() {
    const currentTime = Date.now();
    
    if (currentTime - _buttonStateCache.lastFrameTime < 16) {
        return;
    }
    
    _buttonStateCache.lastFrameTime = currentTime;
    const deviceId = dnr_findActiveDevice();
    const labels = dnr_getLabels();
    
    if (!deviceId || !labels) {
        _buttonStateCache.leftState = { value: '', index: -1 };
        _buttonStateCache.rightState = { value: '', index: -1 };
        return;
    }
    
    let leftIndex = -1;
    let rightIndex = -1;
    let rightShift = 0;
    
    if (deviceId === "0x0483,0xCB14") {
        leftIndex = dnr_getActiveButtonIndex(deviceId, 46, 57);
    } else if (deviceId === "0x0483,0xCB15") {
        leftIndex = dnr_getActiveButtonIndex(deviceId, 53, 64);
    } else if (deviceId === "0x1FC9,0x82D3"){
        leftIndex = dnr_getActiveButtonIndex(deviceId, 42, 53);
    } else if (deviceId === "0x16D0,0x127A") {
        leftIndex = dnr_getActiveButtonIndex(deviceId, 101, 108);
    } else if (deviceId === "0x16D0,0x126D" || deviceId === "0x16D0,0x126C") {
        leftIndex = dnr_getActiveButtonIndex(deviceId, 57, 64);
    } else if (deviceId === "0x35EE,0x1049" || deviceId === "0x35EE,0x1053" || deviceId === "0x35EE,0x1054") {
        leftIndex = dnr_getActiveButtonIndex(deviceId, 30, 41);
        rightIndex = dnr_getActiveButtonIndex(deviceId, 42, 53);
        rightShift = 12;
    }
    
    _buttonStateCache.leftState = {
        value: leftIndex >= 0 ? labels[leftIndex] : '',
        index: leftIndex
    };
    
    _buttonStateCache.rightState = {
        value: rightIndex >= 0 ? labels[rightIndex + rightShift] : '',
        index: rightIndex
    };
}

function dnr_leftMultiPositionalLabelUI() {
    if(!dnr_showLeftMultiPositional($prop("DNRLEDs.Dash.RoadShowWheelLabels"),$prop("DNRLEDs.ShowWheelMultiPositionalLabelsOnDashboard"))) return null;
    dnr_updateButtonStates();
    return _buttonStateCache.leftState.value;
}

function dnr_rightMultiPositionalLabelUI() {
    if(!dnr_showRightMultiPositional($prop("DNRLEDs.Dash.RoadShowWheelLabels"),$prop("DNRLEDs.ShowWheelMultiPositionalLabelsOnDashboard"))) return null;
    dnr_updateButtonStates();
    return _buttonStateCache.rightState.value;
}

function dnr_showLeftMultiPositional(isDashEnabled,isWheelEnabled) {
    if(!isDashEnabled || !isWheelEnabled) return false;
    const deviceId = dnr_findActiveDevice();
    return deviceId === "0x0483,0xCB14" || 
           deviceId === "0x0483,0xCB15" || 
           deviceId === "0x16D0,0x126D" || 
           deviceId === "0x16D0,0x126C" || 
           deviceId === "0x16D0,0x127A" || 
           deviceId === "0x35EE,0x1049" || 
           deviceId === "0x35EE,0x1053" || 
           deviceId === "0x1FC9,0x82D3" || 
           deviceId === "0x35EE,0x1054";
}

function dnr_showRightMultiPositional(isDashEnabled,isWheelEnabled) {
    if(!isDashEnabled || !isWheelEnabled) return false;
    const deviceId = dnr_findActiveDevice();
    return deviceId === "0x35EE,0x1049" || 
           deviceId === "0x35EE,0x1053" || 
           deviceId === "0x35EE,0x1054";
}

function dnr_resetMultiPositionalCache() {
    _deviceCache = { lastCheck: 0, activeDevice: null, checkInterval: 1000 };
    _labelsCache = { lastCheck: 0, labels: null, checkInterval: 5000 };
    _buttonStateCache = { lastFrameTime: 0, leftState: { value: '', index: -1 }, rightState: { value: '', index: -1 } };
}