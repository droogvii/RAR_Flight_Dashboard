/*
 * ---- CAR SETTINGS ----
 */

const ERS_CONFIG = {
    'IRacing': {
        property: 'GameRawData.Telemetry.dcMGUKDeployMode',
        modes: {
            0: { label: 'NON', fullLabel: 'NO DEPLOY', color: $prop('DNRLEDs.ERSNoDeployColour'), default: '#FFFFFFFF' },
            1: { label: 'QUA', fullLabel: 'QUALIFY', color: $prop('DNRLEDs.ERSQualifyColour'), default: '#FF4B0082' },
            2: { label: 'ATT', fullLabel: 'ATTACK', color: $prop('DNRLEDs.ERSAttackColour'), default: '#FFFF0000' },
            3: { label: 'BAL', fullLabel: 'BALANCED', color: $prop('DNRLEDs.ERSBalancedColour'), default: '#FF00FF00' },
            4: { label: 'BLD', fullLabel: 'BUILD', color: $prop('DNRLEDs.ERSBuildColour'), default: '#FFFF1493' }
        }
    },
    'F1': {
        property: 'GameRawData.PlayerCarStatusData.m_ersDeployMode',
        modes: {
            0: { label: 'NON', fullLabel: 'NO DEPLOY', color: $prop('DNRLEDs.ERSNoDeployColour'), default: '#FFFFFFFF' },
            1: { label: 'BAL', fullLabel: 'BALANCED', color: $prop('DNRLEDs.ERSBalancedColour'), default: '#FF00FF00' },
            2: { label: 'ATT', fullLabel: 'ATTACK', color: $prop('DNRLEDs.ERSAttackColour'), default: '#FFFF0000' },
            3: { label: 'QUA', fullLabel: 'QUALIFY', color: $prop('DNRLEDs.ERSQualifyColour'), default: '#FF4B0082' }
        }
    },
    'Automobilista2': {
        property: 'GameRawData.mErsDeploymentMode',
        modes: {
            0: null,
            1: { label: 'NON', fullLabel: 'NO DEPLOY', color: $prop('DNRLEDs.ERSNoDeployColour'), default: '#FFFFFFFF' },
            2: { label: 'BLD', fullLabel: 'BUILD', color: $prop('DNRLEDs.ERSBuildColour'), default: '#FFFF1493' },
            3: { label: 'BAL', fullLabel: 'BALANCED', color: $prop('DNRLEDs.ERSBalancedColour'), default: '#FF00FF00' },
            4: { label: 'ATT', fullLabel: 'ATTACK', color: $prop('DNRLEDs.ERSAttackColour'), default: '#FFFF0000' },
            5: { label: 'QUA', fullLabel: 'QUALIFY', color: $prop('DNRLEDs.ERSQualifyColour'), default: '#FF4B0082' }
        }
    },
    'LMU': {
        property: 'GameRawData.CurrentPlayerTelemetry.mElectricBoostMotorState',
        modes: {
            0: { label: 'OFF', fullLabel: 'OFF', color: $prop('DNRLEDs.ERSNoDeployColour'), default: '#FFFFFFFF' },
            1: { label: 'RDY', fullLabel: 'READY', color: $prop('DNRLEDs.ERSBalancedColour'), default: '#FF00FF00' },
            2: { label: 'DEP', fullLabel: 'DEPLOY', color: $prop('DNRLEDs.ERSAttackColour'), default: '#FFFF0000' },
            3: { label: 'REG', fullLabel: 'REGEN', color: $prop('DNRLEDs.ERSBuildColour'), default: '#FFFF1493' }
        }
    },
    'AssettoCorsaCompetizione': {
        property: 'GameRawData.StaticInfo.HasERS',
        modes: {
            0: null,
            1: { label: 'ERS', fullLabel: 'ERS ACTIVE', color: 'dnr_ERSBalancedcolour_Hex', default: '#FF00FF00' }
        },
        fallbackProperty: 'GameRawData.StaticInfo.HasKERS',
        fallbackModes: {
            0: null,
            1: { label: 'KER', fullLabel: 'KERS ACTIVE', color: 'dnr_ERSBalancedcolour_Hex', default: '#FF00FF00' }
        }
    }
};

const ENGINE_CONFIG = {
    'IRacing': {
        mapProperties: [
            { key: 'DataCorePlugin.GameRawData.Telemetry.dcThrottleShape', label: 'SHAPE' },
            { key: 'DataCorePlugin.GameRawData.Telemetry.dcFuelMixture', label: 'MIX' },
            { key: 'DataCorePlugin.GameRawData.Telemetry.dcEnginePower', label: 'EPWR' },
            { key: 'DataCorePlugin.GameRawData.Telemetry.dcEngineBraking', label: 'EBRK' }
        ],
        mapFallback: { label: 'MAP', value: '-' },
        mgukProperties: {
            ersProperty: 'GameRawData.Telemetry.EnergyERSBattery',
            conflictProperties: [
                'DataCorePlugin.GameRawData.Telemetry.dcBoostLevel',
                'DataCorePlugin.GameRawData.Telemetry.dcFuelMixture',
                'DataCorePlugin.GameRawData.Telemetry.dcThrottleShape',
                'DataCorePlugin.GameRawData.Telemetry.dcEnginePower',
                'DataCorePlugin.GameRawData.Telemetry.dcEngineBraking'
            ],
            mapProperty: 'DataCorePlugin.GameData.EngineMap',
            label: 'MGU-K'
        }
    },
    'F1': {
        mapProperties: [
            { key: 'GameRawData.PlayerCarStatusData.m_fuelMix', label: 'MIX' }
        ],
        mapFallback: { label: 'MIX', value: '-' },
        mgukProperties: {
            label: 'MAP'
        }
    },
    'AssettoCorsaCompetizione': {
        mapProperties: [
            { key: 'DataCorePlugin.GameData.EngineMap', label: 'MAP' }
        ],
        mapFallback: { label: 'MAP', value: '-' },
        mgukProperties: {
            ersProperty: 'GameRawData.StaticInfo.HasERS',
            label: 'MGU-K'
        }
    },
    'default': {
        mapProperties: [
            { key: 'DataCorePlugin.GameData.EngineMap', label: 'MAP' }
        ],
        mapFallback: { label: 'MAP', value: '-' },
        mgukProperties: {
            label: 'MAP'
        }
    }
};

function dnr_getGSIBitepointValue() {
    if(getcontrolleraxis('0x35F9,*', 4) < 2000 || (getcontrolleraxis('0x35F9,*', 4) > 3999 && getcontrolleraxis('0x35F9,*', 4) < 5000)) return getcontrolleraxis('0x35F9,*', 4) % 1000 /10;
    return null;
}

function dnr_getBrakeBiasValue() {
    let bb = $prop("BrakeBias");
    if(bb <= 0) return 0;
    return dnr_getPositiveOrZero(bb).toFixed(2);
}

function dnr_getAbsValue() {
    if(!dnr_showAbsValue()) return null;
    return dnr_getPositiveOrZero($prop('DataCorePlugin.GameData.ABSLevel'));
}

function dnr_showAbsValue() {
    return !dnr_isCarExceptionInclude('Hyper') && !dnr_isCarException("dallarair18") && !dnr_isF1Game()
}

function dnr_getTcValue() {
    if (!dnr_showTcValue()) return null;

    const currentGame = $prop('DataCorePlugin.CurrentGame');
    const tcLevel = $prop('DataCorePlugin.GameData.NewData.TCLevel');

    if (currentGame === 'AssettoCorsaCompetizione') {
        const rawTC = $prop('DataCorePlugin.GameRawData.Graphics.TC');
        return dnr_defaultIfNegative(rawTC, tcLevel);
    }

    return dnr_getPositiveOrZero(tcLevel);
}

function dnr_showTcValue() {
    return !dnr_isF1Game() && !dnr_isCarException("dallarair18");
}

function dnr_getTc2Value() {
    if(!dnr_showTc2Value()) return null;
    return dnr_TCCut_propertySelect();
}

function dnr_showTc2Value() {
    return !dnr_isF1Game() && !dnr_isCarException("dallarair18");
}

function dnr_showDiff() {
    return dnr_isF1Game();
}

function dnr_getFARB(){
    return $prop('DataCorePlugin.GameRawData.Telemetry.dcAntiRollFront');
}

function dnr_getRARB(){
    return $prop('DataCorePlugin.GameRawData.Telemetry.dcAntiRollRear');
}

function dnr_getDiff() {
    if(!dnr_showDiff()) return null;
    return $prop('DataCorePlugin.GameRawData.PlayerCarSetup.m_onThrottle');
}

function dnr_getEngineConfig() {
    const currentGame = $prop('DataCorePlugin.CurrentGame');
    if (currentGame === 'IRacing') {
        return ENGINE_CONFIG['IRacing'];
    } else if (currentGame.includes('F120')) {
        return ENGINE_CONFIG['F1'];
    } else if (currentGame === 'AssettoCorsaCompetizione') {
        return ENGINE_CONFIG['AssettoCorsaCompetizione'];
    } else {
        return ENGINE_CONFIG['default'];
    }
}

function dnr_getMapLabel() {
    const currentGame = $prop('DataCorePlugin.CurrentGame');
    const config = dnr_getEngineConfig();
    
    if (currentGame === 'IRacing') {
        const mguk = config.mgukProperties;
        const hasMGUK = dnr_isValidValue($prop(mguk.ersProperty));
        const hasConflicts = mguk.conflictProperties.some(prop => dnr_isValidValue($prop(prop)));
        const hasMap = dnr_isValidValue($prop(mguk.mapProperty));
        
        if (hasMGUK && !hasConflicts && !hasMap) {
            return mguk.label;
        }
    } else if (currentGame === 'AssettoCorsaCompetizione') {
        if ($prop(config.mgukProperties.ersProperty) == 1) {
            return config.mgukProperties.label;
        }
    }
    
    for (const prop of config.mapProperties) {
        if (dnr_isValidValue($prop(prop.key))) {
            return prop.label;
        }
    }
    
    return config.mapFallback.label;
}

function dnr_getMapValue() {
    const config = dnr_getEngineConfig();
    for (const prop of config.mapProperties) {
        const value = $prop(prop.key);
        if (dnr_isValidValue(value)) {
            return value;
        }
    }
    return config.mapFallback.value;
}

function dnr_getERSConfig() {
    const currentGame = $prop('DataCorePlugin.CurrentGame');
    
    if (currentGame === 'IRacing') {
        return ERS_CONFIG['IRacing'];
    } else if (currentGame.includes('F120')) {
        return ERS_CONFIG['F1'];
    } else if (currentGame === 'Automobilista2') {
        return ERS_CONFIG['Automobilista2'];
    } else if (currentGame === 'LMU') {
        return ERS_CONFIG['LMU'];
    } else if (currentGame === 'AssettoCorsaCompetizione') {
        return ERS_CONFIG['AssettoCorsaCompetizione'];
    } else {
        return null;
    }
}

function dnr_getERSModeData() {
    const config = dnr_getERSConfig();
    if (!config) return null;
    
    const modeValue = $prop(config.property);

    if (config.fallbackProperty && (modeValue == null || config.modes[modeValue] === null)) {
        const fallbackValue = $prop(config.fallbackProperty);
        if (fallbackValue != null && config.fallbackModes) {
            return config.fallbackModes[fallbackValue] || null;
        }
    }
    
    if (modeValue == null) return null;
    
    return config.modes[modeValue] || null;
}

function dnr_getERSMode(useFullLabel = false) {
    const modeData = dnr_getERSModeData();
    if (!modeData) return '-';
    
    return useFullLabel ? modeData.fullLabel : modeData.label;
}

function dnr_getERSModeNotification(useFullLabel = false) {
    const game = $prop('DataCorePlugin.CurrentGame');
    if(game === 'LMU') return null;
    
    const modeData = dnr_getERSModeData();
    if (!modeData) return '-';
    
    return useFullLabel ? modeData.fullLabel : modeData.label;
}

function dnr_getERSColour() {
    const modeData = dnr_getERSModeData();
    if (!modeData) return null;
    
    return $prop(`DNRLEDs.${modeData.color}`) ?? modeData.default;
}

function dnr_showERS() {
    const config = dnr_getERSConfig();
    if (!config) return false;
    
    const modeValue = $prop(config.property);
    if (modeValue == null) return false;
    
    const modeData = config.modes[modeValue];
    return modeData !== null && modeData !== undefined;
}

function dnr_getRPMsPercent() {
    let redlineRPM = dnr_RedlineValue();
    let startRPM = redlineRPM * ($prop('DNRLEDs.RpmsStartThreshold') ?? 85) / 100;

    if ($prop('DataCorePlugin.CurrentGame') == 'EAWRC23') {
        startRPM = $prop('GameRawData.SessionUpdate.shiftlights_rpm_start');
    }

    let minRange = Math.max(1500, redlineRPM * 0.1);
    startRPM = Math.min(startRPM, redlineRPM - minRange);

    let currentRPM = $prop('Rpms');

    if (startRPM == null || redlineRPM == null || redlineRPM === startRPM) {
        return 0;
    }

    let percentage = ((currentRPM - startRPM) / (redlineRPM - startRPM));

    return Math.max(0, Math.min(percentage, 100));
}

/*
 * ---- VALUES ----
 */

function dnr_getVirtualSafetyCarDelta() {
    return format($prop('DataCorePlugin.GameRawData.PlayerLapData.m_safetyCarDelta'), '0.000', true);
}

function dnr_getVirtualSafetyCarDeltaColour() {
    if ($prop('DataCorePlugin.GameRawData.PlayerLapData.m_safetyCarDelta') >= 0) return dnr_getValueColour();
    if ($prop('DataCorePlugin.GameRawData.PlayerLapData.m_safetyCarDelta') < 0) return dnr_getRedColour();
    return dnr_getValueColour();
}

function dnr_getLastLapTimeColour() {
    if (dnr_isDarkMode()) {
        return dnr_getValueColour();
    }
    
    const colours = dnr_getColours();

    const lastLapTime = $prop('DataCorePlugin.GameData.LastLapTime');
    const personalBest = $prop('DataCorePlugin.GameData.BestLapTime');
    const opponentPosition = getbestlapopponentleaderboardposition_playerclassonly();
    const sessionBest = driverbestlap(opponentPosition);
    const lapInvalidated = $prop('DataCorePlugin.GameData.LapInvalidated');
    const completedLaps = $prop('DataCorePlugin.GameData.CompletedLaps');
    
    if (!lastLapTime || completedLaps == null) {
        return colours.label;
    }
    
    const lastLapSeconds = timespantoseconds(lastLapTime);
    const invalidatedSeconds = timespantoseconds(lapInvalidated);
    
    if (invalidatedSeconds === lastLapSeconds) {
        return colours.red;
    }
    if (completedLaps < 1 || lastLapSeconds === 0) {
        return colours.label;
    }
    if (lastLapTime <= sessionBest) {
        return colours.purple;
    }
    if (lastLapTime === personalBest) {
        return colours.green; 
    }
    if (personalBest && lastLapTime > personalBest) {
        return colours.yellow;
    }
    return colours.value;
}

function dnr_getBestLapTimeColour() {
    if (dnr_isDarkMode()) {
        return dnr_getValueColour();
    }
    
    const colours = dnr_getColours();
    
    const bestLapTime = $prop('DataCorePlugin.GameData.BestLapTime');
    const completedLaps = $prop('DataCorePlugin.GameData.CompletedLaps');
    
    if (!bestLapTime || 
        completedLaps == null || 
        completedLaps < 1 || 
        bestLapTime === 0 || 
        timespantoseconds(bestLapTime) === 0) {
        return colours.label;
    }
    const opponentPosition = getbestlapopponentleaderboardposition_playerclassonly();
    const opponentBestLap = driverbestlap(opponentPosition);
        
    if (!opponentBestLap || timespantoseconds(opponentBestLap) === 0) {
        return colours.green;
    }
        
    if (bestLapTime <= opponentBestLap) {
        return colours.purple;
    }
        
    return colours.green;
}

function dnr_getEstimatedLapTime() {
    let dataSource = dnr_getDataSource();
    
    if (dataSource === 2) {
        if (timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) > 0) {
            return sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime');
        } else {
            return $prop('CurrentLapTime');
        }
    }
    
    if (timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) > 0) {
        return $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased');
    } else if (timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0) {
        return $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased');
    } else {
        return $prop('CurrentLapTime');
    }
}

function dnr_getEstimatedTimeColour() {
    if (dnr_isDarkMode()) {
        return dnr_getValueColour();
    }
    
    const colours = dnr_getColours();
    let dataSource = dnr_getDataSource();
    let estimated;
    
    if (dataSource === 2) {
        if (timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) > 0) {
            estimated = sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime');
        } else {
            estimated = $prop('CurrentLapTime');
        }
    } else {
        const estimatedBest = $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased');
        const estimatedAllTime = $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased');
        const currentLapTime = $prop('CurrentLapTime');
        
        if (timespantoseconds(estimatedBest) > 0) {
            estimated = estimatedBest;
        } else if (timespantoseconds(estimatedAllTime) > 0) {
            estimated = estimatedAllTime;
        } else {
            estimated = currentLapTime;
        }
    }
    
    if ($prop('DataCorePlugin.GameData.LapInvalidated')) {
        return colours.red;
    }
    
    const personalBest = $prop('DataCorePlugin.GameData.BestLapTime');
    const sessionBest = $prop('DataCorePlugin.GameData.SessionBestLapTime');
    
    if (timespantoseconds(estimated) == 0) {
        return colours.label; 
    }

    if (estimated === personalBest) {
        return colours.green; 
    }
    
    if (estimated === sessionBest) {
        return colours.value;
    }
    
    if (personalBest && estimated > personalBest) {
        return colours.yellow;
    }
    
    const opponentPosition = getbestlapopponentleaderboardposition_playerclassonly();
    const opponentBest = driverbestlap(opponentPosition);
        
    if (!opponentBest || timespantoseconds(opponentBest) === 0) {
        return colours.green;
    }
    return personalBest < opponentBest ? colours.purple : colours.green;
}

function dnr_getDelta(maxDecimals, formatted = true) {
    
    function formatDelta(delta, maxDecimals) {
        const absDelta = Math.abs(delta);
        let decimals;
        if (absDelta < 10) {
            decimals = Math.min(maxDecimals, 3);
        } else if (absDelta < 100) {
            decimals = Math.min(maxDecimals, 2);
        } else {
            decimals = Math.min(maxDecimals, 1);
        }
        return (delta >= 0 ? '+' : '') + delta.toFixed(decimals);
    }
    
    let dataSource = dnr_getDataSource();
    let delta = null;
    
    if (dataSource === 2) {
        if (timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) > 0) {
            delta = timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) - timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime'));
        } else {
            delta = 0;
        }
    } else {
        if (timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) > 0) {
            delta = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime'));
        } else if (timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0) {
            delta = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds($prop('PersistantTrackerPlugin.AllTimeBest'));
        } else {
            delta = 0;
        }
    }

    if(formatted) {
        if (delta === null) {
            return '-';
        }
        
        if (delta > 60 || delta < -60) {
            return 'N/REF';
        }
    }
    
    return formatted ? formatDelta(delta, maxDecimals) : delta;
}

function dnr_getDeltaColour() {

    function getColourFromDelta(delta) {
        if (delta > 0) return dnr_getRedColour();   
        if (delta < 0) return dnr_getGreenColour(); 
        return dnr_getLabelColour();        
    }
    
    const currentGame = $prop('DataCorePlugin.CurrentGame');
    const neutralColor = dnr_getLabelColour();
    
    if (currentGame === 'RFactor2') {
        const delta = $prop('PersistantTrackerPlugin.AllTimeBestLiveDeltaSeconds');
        return delta === null ? neutralColor : getColourFromDelta(delta);
    }
    
    const isInPitLane = $prop('DataCorePlugin.GameData.NewData.IsInPitLane');
    if (isInPitLane) {
        return neutralColor;
    }
    
    const delta = dnr_getDelta(3, false);
    
    if (delta === null || 
        delta > 60 || 
        delta < -60) {
        return neutralColor;
    }

    return getColourFromDelta(delta);
}

function dnr_deltaVsPreviousLap() {
    const currentLastLap = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime'));
    
    if (root["dnr_prevLap"] == null) {
        root["dnr_prevLap"] = { lastLap: 0, delta: 0 };
    }
    
    if (currentLastLap > 0 && currentLastLap !== root["dnr_prevLap"].lastLap) {
        root["dnr_prevLap"].delta = root["dnr_prevLap"].lastLap > 0 ? currentLastLap - root["dnr_prevLap"].lastLap : 0;
        root["dnr_prevLap"].lastLap = currentLastLap;
    }
    
    return root["dnr_prevLap"].delta;
}

function dnr_deltaVsPersonalBest() {
    const currentLastLap = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime'));
    const currentBest = timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime'));
    
    if (root["dnr_pb"] == null) {
        root["dnr_pb"] = { lastLap: 0, best: 0, delta: 0 };
    }
    
    if (currentLastLap > 0 && currentLastLap !== root["dnr_pb"].lastLap) {
        root["dnr_pb"].delta = root["dnr_pb"].best > 0 ? currentLastLap - root["dnr_pb"].best : 0;
        root["dnr_pb"].lastLap = currentLastLap;
        if (currentBest > 0 && (root["dnr_pb"].best === 0 || currentBest < root["dnr_pb"].best)) {
            root["dnr_pb"].best = currentBest;
        }
    }
    
    return root["dnr_pb"].delta;
}

function dnr_deltaVsSessionBest() {
    const currentLastLap = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime'));
    const currentSessionBest = timespantoseconds(dnr_getOpponentsDriverBestLap(1,true)) ?? 0;
    
    if (root["dnr_sb"] == null) {
        root["dnr_sb"] = { lastLap: 0, sessionBest: 0, delta: 0 };
    }
    
    if (currentLastLap > 0 && currentLastLap !== root["dnr_sb"].lastLap) {
        root["dnr_sb"].delta = root["dnr_sb"].sessionBest > 0 ? currentLastLap - root["dnr_sb"].sessionBest : 0;
        root["dnr_sb"].lastLap = currentLastLap;
        if (currentSessionBest > 0 && (root["dnr_sb"].sessionBest === 0 || currentSessionBest < root["dnr_sb"].sessionBest)) {
            root["dnr_sb"].sessionBest = currentSessionBest;
        }
    }
    
    return root["dnr_sb"].delta;
}

/*
 * ---- TRACK ----
 */

function dnr_getCurrentSectorColour() {
    return dnr_getSectorColour($prop("CurrentSectorIndex"));
}

function dnr_getCurrentSectorDelta() {
    return dnr_getSectorPlayerDelta($prop("CurrentSectorIndex"));
}

function dnr_getPreviousSector(currentSector, totalSectors, offset = 2) {
    const targetSector = currentSector - offset;
    return targetSector <= 0 ? targetSector + totalSectors : targetSector;
}

function dnr_captureAllSectorReferenceTimes() {
    const currentLap = $prop("CurrentLap");
    const sectorsCount = $prop("SectorsCount");
    const lapKey = `lap_${currentLap}_captured`;
    
    if (!root[lapKey]) {
        let hasValidData = false;
        for (let i = 1; i <= sectorsCount; i++) {
            const playerBest = bestsectortime(i, false);
            if (playerBest && timespantoseconds(playerBest) > 0) {
                hasValidData = true;
                break;
            }
        }
        
        if (!hasValidData) {
            return;
        }
        
        root[lapKey] = true;
        
        for (let i = 1; i <= sectorsCount; i++) {
            const sectorKey = `sector_${i}_lap_${currentLap}`;
            const playerBest = bestsectortime(i, false);
            const sessionBest = getbestsplittime_playerclassonly(i);
            
            if (playerBest && timespantoseconds(playerBest) > 0) {
                root[sectorKey] = {
                    playerBest: playerBest,
                    sessionBest: sessionBest,
                    captured: true
                };
            }
        }
    }
}

function dnr_getSectorReferenceTimes(sectorIndex) {
    const currentLap = $prop("CurrentLap");
    const sectorKey = `sector_${sectorIndex}_lap_${currentLap}`;
    dnr_captureAllSectorReferenceTimes();
    
    return root[sectorKey];
}

function dnr_cleanupOldSectorTimes() {
    const currentLap = $prop("CurrentLap");
    Object.keys(root).forEach(key => {
        if (key.startsWith('sector_') && !key.includes(`_lap_${currentLap}`)) {
            delete root[key];
        }
    });
}

function dnr_getSectorColour(index) {
    const playerSectorTime = currentlapgetsectortime(index, false);
    const sessionBestSectorTime = getbestsplittime_playerclassonly(index);
    const playerBestSectorTime = bestsectortime(index, false);

    if (!playerSectorTime || !sessionBestSectorTime || !playerBestSectorTime) {
        return dnr_getCardColour();
    }

    if (timespantoseconds(playerSectorTime) <= timespantoseconds(sessionBestSectorTime)) {
        return dnr_getPurpleColour();
    }
    if (timespantoseconds(playerSectorTime) <= timespantoseconds(playerBestSectorTime)) {
        return dnr_getGreenColour();
    }
    
    return dnr_getYellowColour();
}

function dnr_getSectorPlayerDelta(index) {
    dnr_cleanupOldSectorTimes();
    
    const playerSectorTime = currentlapgetsectortime(index, false);
    
    if (!playerSectorTime) {
        return null; 
    }
    const referenceTimes = dnr_getSectorReferenceTimes(index);
    
    let playerBestSectorTime;
    if (referenceTimes && referenceTimes.playerBest) {
        playerBestSectorTime = referenceTimes.playerBest;
    } else {
        playerBestSectorTime = bestsectortime(index, false);
    }
    
    if (!playerBestSectorTime || timespantoseconds(playerBestSectorTime) <= 0) {
        return null;
    }
    
    const diff = timespantoseconds(playerSectorTime) - timespantoseconds(playerBestSectorTime);
    if (Math.abs(diff) < 0.001) return '--';
    return diff;
}

function dnr_getSectorTime(sectorIndex, currentSector) {
    if (sectorIndex < currentSector) {
        return currentlapgetsectortime(sectorIndex, false);
    } else {
        return lastlapgetsectortime(sectorIndex, false);
    }
}

function dnr_getCurrentSectorLiveTime() {
    const currentSector = $prop("CurrentSectorIndex");
    const currentLapTime = timespantoseconds($prop("CurrentLapTime"));
    
    let completedSectorsTime = 0;
    for (let i = 1; i < currentSector; i++) {
        const sectorTime = currentlapgetsectortime(i, false);
        if (sectorTime) {
            completedSectorsTime += timespantoseconds(sectorTime);
        }
    }
    return currentLapTime - completedSectorsTime;
}

function dnr_getSectorRectColour(sectorIndex) {
    dnr_detectLapChange();
    
    const currentSector = $prop("CurrentSectorIndex");
    
    if (sectorIndex > $prop("SectorsCount") || sectorIndex < 1) {
        return dnr_getCardColour();
    }
    let duration = ($prop("DNRLEDs.Dash.RoadLapRecapPopUpDuration") ?? 4000);
    const showPreviousLap = root["dnr_lapChangeTimestamp"] && 
                           (Date.now() - root["dnr_lapChangeTimestamp"] < duration) &&
                           currentSector === 1;
    
    if (showPreviousLap) {
        return dnr_getSectorColourFromPreviousLap(sectorIndex);
    }
    
    return dnr_getSectorColour(sectorIndex);
}

function dnr_getSectorColourFromPreviousLap(sectorIndex) {
    const lastLapSectorTime = lastlapgetsectortime(sectorIndex, false);
    if (!lastLapSectorTime) return dnr_getCardColour();
    
    const sessionBestSectorTime = getbestsplittime_playerclassonly(sectorIndex);
    const playerBestSectorTime = bestsectortime(sectorIndex, false);
    
    if (!sessionBestSectorTime || !playerBestSectorTime) {
        return dnr_getCardColour();
    }

    if (timespantoseconds(lastLapSectorTime) <= timespantoseconds(sessionBestSectorTime)) {
        return dnr_getPurpleColour();
    }
    if (timespantoseconds(lastLapSectorTime) <= timespantoseconds(playerBestSectorTime)) {
        return dnr_getGreenColour();
    }
    
    return dnr_getYellowColour();
}

function dnr_isFirstPreviousLapSector(currentSector, offset) {
    const targetSector = currentSector - offset;
    const previousTargetSector = currentSector - (offset - 1);
    return (targetSector <= 0) && (previousTargetSector > 0);
}

function dnr_isPreviousLapSector(currentSector, offset) {
    return (currentSector - offset) <= 0;
}

function dnr_getTrackStatus(fullLabel = false) {
    const currentGame = $prop('DataCorePlugin.CurrentGame');

    const gameTrackStatus = {
        'IRacing': () => {
            const status = $prop('GameRawData.Telemetry.TrackWetness');
            const irStatusMap = {
                1: fullLabel ? 'Dry' : 'DRY',
                2: fullLabel ? 'Greasy' : 'GRS',
                3: fullLabel ? 'Damp' : 'DMP',
                4: fullLabel ? 'Lightly Wet' : 'LIT',
                5: fullLabel ? 'Moderately Wet' : 'MOD',
                6: fullLabel ? 'Very Wet' : 'VER',
                7: fullLabel ? 'Extremely Wet' : 'EXT'
            };
            return irStatusMap[status] || '';
        },
        'AssettoCorsaCompetizione': () => {
            const status = $prop('DataCorePlugin.GameRawData.Graphics.trackGripStatus');
            const accStatusMap = {
                0: fullLabel ? 'Green' : 'GRN',
                1: fullLabel ? 'Fast' : 'FST',
                2: fullLabel ? 'Optimal' : 'OPT',
                3: fullLabel ? 'Greasy' : 'GRS',
                4: fullLabel ? 'Damp' : 'DMP',
                5: fullLabel ? 'Wet' : 'WET',
                6: fullLabel ? 'Flooded' : 'FLD'
            };
            return accStatusMap[status] || '';
        },
        'default': () => ''
    };

    const getStatus = gameTrackStatus[currentGame] || gameTrackStatus.default;
    return getStatus();
}

function dnr_getTrackStatusColour() {
    const colours = dnr_getColours();
    const currentGame = $prop('DataCorePlugin.CurrentGame');

    const gameStatusColours = {
        'IRacing': () => {
            const status = $prop('GameRawData.Telemetry.TrackWetness');
            const irColourMap = {
                1: colours.green,
                2: colours.yellow,
                3: colours.yellow,
                4: colours.blue,
                5: colours.blue,
                6: colours.blue,
                7: colours.blue
            };
            return irColourMap[status] || colours.label;
        },
        'AssettoCorsaCompetizione': () => {
            const status = $prop('DataCorePlugin.GameRawData.Graphics.trackGripStatus');
            const accColourMap = {
                0: colours.green,
                1: colours.green,
                2: colours.purple,
                3: colours.yellow,
                4: colours.yellow,
                5: colours.blue,
                6: colours.blue 
            };
            return accColourMap[status] || colours.label;
        },
        'default': () => colours.label
    };

    const getColour = gameStatusColours[currentGame] || gameStatusColours.default;
    return getColour();
}

/*
 * ---- SESSION ----
 */

function dnr_isSessionTimeLimited() {
    const currentGame = $prop('DataCorePlugin.CurrentGame');
    const gameCheckers = {
        'IRacing': () => Boolean($prop('DataCorePlugin.GameRawData.CurrentSessionInfo.IsLimitedTime')),
        'LMU': () => $prop('DataCorePlugin.GameData.TotalLaps') === 0,
        'RFactor2': () => $prop('DataCorePlugin.GameData.TotalLaps') === 0,
        'default': () => dnr_isValidDate($prop('DataCorePlugin.GameData.SessionTimeLeft'))
    };
    const checker = gameCheckers[currentGame] || gameCheckers.default; 
    return checker();
}

function dnr_getSimTime() {
    const currentGame = $prop('DataCorePlugin.CurrentGame');
    
    const gameConfigs = {
        'IRacing': 'DataCorePlugin.GameRawData.Telemetry.SessionTimeOfDay',
        'default': 'DataCorePlugin.GameRawData.Graphics.clock'
    };
    
    let timeValue;
    if (currentGame === 'IRacing') {
        timeValue = $prop(gameConfigs.IRacing);
    } else if (currentGame.startsWith('F120')) {
        timeValue = $prop('GameRawData.PacketSessionData.m_timeOfDay') * 60;
    } else {
        timeValue = $prop(gameConfigs.default);
    }
    
    return secondstotimespan(timeValue ?? 0);
}

/*
 * ---- MISC ----
 */

function dnr_isF1Game() {
    const currentGame = $prop('DataCorePlugin.CurrentGame');
    return typeof currentGame === 'string' && currentGame.includes('F120');
}

function dnr_isCarException(car) {
    return $prop('DataCorePlugin.GameData.CarClass') === car || 
           $prop('DataCorePlugin.GameData.CarId') === car;
}

function dnr_isCarExceptionInclude(car) {
    const carClass = $prop('DataCorePlugin.GameData.CarClass');
    const carId = $prop('DataCorePlugin.GameData.CarId');

    const isInClass = typeof carClass === 'string' && carClass.includes(car);
    const isInId = typeof carId === 'string' && carId.includes(car);

    return isInClass || isInId;
}

function dnr_isQualify() {
    const session = $prop('SessionTypeName') ?? '';
    return session.toUpperCase().includes('QUALIFY')
}

function dnr_isPractice() {
    const session = $prop('SessionTypeName') ?? '';
    return session.toUpperCase().includes('PRACTICE') || session.toUpperCase().includes('OFFLINE')
}

/*
 * ---- PLAYER ----
 */

function dnr_getDriverClassPosition(leaderboardPosition) {
    let dataSource = dnr_getDataSource();
    let classPosition;
    
    if (dataSource === 2) {
        classPosition = sc_GetTeamPropertyFromLeaderboardPosition( leaderboardPosition, 'LivePositionInClass' );
    } else {
        classPosition = driverclassposition( leaderboardPosition );
    }

    return classPosition;
}

function dnr_getDriverPosition(leaderboardPosition) {
    let dataSource = dnr_getDataSource();
    let position;
    
    if (dataSource === 2) {
        position = sc_GetTeamPropertyFromLeaderboardPosition( leaderboardPosition, 'LivePosition' );
    } else {
        position = driverposition( leaderboardPosition );
    }

    return position;
}

/*
 * ---- OPPONENTS ----
 */


// Relative Opponents Relative

function dnr_getOpponentPosition(relativeIndex, classOnly = false) {
    return classOnly 
        ? getopponentleaderboardposition_aheadbehind_playerclassonly(relativeIndex)
        : getopponentleaderboardposition_aheadbehind(relativeIndex);
}

function dnr_getOpponentsDriverRelativePosition(relativeIndex, classOnly = false) {
    return driverclassposition(dnr_getOpponentPosition(relativeIndex, classOnly));
}

function dnr_getOpponentsDriverRelativeName(relativeIndex, classOnly = false) {
    return dnr_formatName(drivername(dnr_getOpponentPosition(relativeIndex, classOnly)));
}

function dnr_getOpponentsDriverRelativeNameColour(relativeIndex, classOnly = false) {
    const driverIndex = dnr_getOpponentPosition(relativeIndex, classOnly);
    const playerLeaderboardPosition = getplayerleaderboardposition();
    
    if (driverIndex === playerLeaderboardPosition) {
        return dnr_getValueColour();
    }
    if (dnr_isQualify() || dnr_isPractice() || drivercurrentlap(driverIndex) <= 0 || drivercurrentlap(playerLeaderboardPosition) <= 0) {
        return dnr_getValueFadedColour()
    }
    
    const gapToPlayer = drivergaptoplayer(driverIndex);
    const relativeGapToPlayer = driverrelativegaptoplayer(driverIndex);
    const lapDifference = dnr_calculateLapDifference(driverIndex, playerLeaderboardPosition);
    
    if (gapToPlayer < 0 && (lapDifference > 1 || relativeGapToPlayer >= 0)) {
        return dnr_getRedColour();
    }
    
    if (gapToPlayer > 0 && (lapDifference > 1 || relativeGapToPlayer <= 0)) {
        return dnr_getBlueColour();
    }
    
    return dnr_getValueFadedColour();
}

function dnr_getOpponentsDriverRelativeClassColour(relativeIndex, classOnly = false) {
    return drivercarclasscolor(dnr_getOpponentPosition(relativeIndex, classOnly));
}

function dnr_getOpponentsDriverRelativeClassTextColour(relativeIndex, classOnly = false) {
    return drivercarclasstextcolor(dnr_getOpponentPosition(relativeIndex, classOnly));
}

function dnr_getOpponentsDriverRelativeGap(relativeIndex, classOnly = false) {
    let dataSource = dnr_getDataSource();
    
    if (dataSource === 2) {
        const leaderboardPosition = dnr_getOpponentPosition(relativeIndex, classOnly);
        return sc_GetTeamPropertyFromLeaderboardPosition(leaderboardPosition, 'RelativeGapToPlayer');
    }

    return driverrelativegaptoplayer(dnr_getOpponentPosition(relativeIndex, classOnly));
}

function dnr_getOpponentsDriverRelativeLastLap(relativeIndex, classOnly = false) {
    return driverlastlap(dnr_getOpponentPosition(relativeIndex, classOnly));
}

function dnr_getOpponentsDriverRelativeBestLap(relativeIndex, classOnly = false) {
    return driverbestlap(dnr_getOpponentPosition(relativeIndex, classOnly));
}

function dnr_getOpponentsDriverRelativeRelativeGap(relativeIndex, classOnly = false) {
    return drivergaptoplayer(dnr_getOpponentPosition(relativeIndex, classOnly));
}

function dnr_getOpponentsDriverRelativeLicence(relativeIndex, classOnly = false) {
    return driverlicencestring(dnr_getOpponentPosition(relativeIndex, classOnly));
}

// Opponents

function dnr_getOpponentAbsoluteIndex(index, classOnly = false) {
    return classOnly 
        ? getopponentleaderboardposition_playerclassonly(index)
        : index;
}

function dnr_getOpponentsDriverPosition(index, classOnly = false) {
    return driverclassposition(dnr_getOpponentAbsoluteIndex(index, classOnly));
}

function dnr_getOpponentsDriverName(index, classOnly = false) {
    return dnr_formatName(drivername(dnr_getOpponentAbsoluteIndex(index, classOnly)));
}

function dnr_getOpponentsDriverNameColour(index, classOnly = false) {
    const driverIndex = dnr_getOpponentAbsoluteIndex(index, classOnly);
    const playerLeaderboardPosition = getplayerleaderboardposition();
    
    if (driverIndex === playerLeaderboardPosition) {
        return dnr_getValueColour();
    }
    if (dnr_isQualify() || dnr_isPractice() || drivercurrentlap(driverIndex) <= 0 || drivercurrentlap(playerLeaderboardPosition) <= 0) {
        return dnr_getValueFadedColour()
    }
    
    const gapToPlayer = drivergaptoplayer(driverIndex);
    const relativeGapToPlayer = driverrelativegaptoplayer(driverIndex);
    const lapDifference = dnr_calculateLapDifference(driverIndex, playerLeaderboardPosition);
    
    if (gapToPlayer < 0 && (lapDifference > 1 || relativeGapToPlayer >= 0)) {
        return dnr_getRedColour();
    }
    
    if (gapToPlayer > 0 && (lapDifference > 1 || relativeGapToPlayer <= 0)) {
        return dnr_getBlueColour();
    }
    
    return dnr_getValueFadedColour()
}

function dnr_getOpponentsDriverClassColour(index, classOnly = false) {
    return drivercarclasscolor(dnr_getOpponentAbsoluteIndex(index, classOnly));
}

function dnr_getOpponentsDriverClassTextColour(index, classOnly = false) {
    return drivercarclasstextcolor(dnr_getOpponentAbsoluteIndex(index, classOnly));
}

function dnr_getOpponentsDriverLap(index, classOnly = false) {
    return drivercurrentlap(dnr_getOpponentAbsoluteIndex(index, classOnly));
}

function dnr_getOpponentsDriverLastLap(index, classOnly = false) {
    return driverlastlap(dnr_getOpponentAbsoluteIndex(index, classOnly));
}

function dnr_getOpponentsDriverBestLap(index, classOnly = false) {
    return driverbestlap(dnr_getOpponentAbsoluteIndex(index, classOnly));
}

function dnr_getOpponentsDriverGap(index, classOnly = false) {
    let dataSource = dnr_getDataSource();
    
    if (dataSource === 2) {
        const leaderboardPosition = dnr_getOpponentAbsoluteIndex(index, classOnly);
        let relativeGap = sc_GetTeamPropertyFromLeaderboardPosition(leaderboardPosition, 'RelativeGapToPlayer');
        if (index === 1) {
            return sc_GetTeamPropertyFromLeaderboardPosition(leaderboardPosition, 'GapToPlayer');
        } else {
            if (relativeGap !== undefined && relativeGap !== null) {
                return relativeGap;
            }
            
            let driverGap = sc_GetTeamPropertyFromLeaderboardPosition(leaderboardPosition, 'GapToPlayer');
            const driverAheadPosition = dnr_getOpponentAbsoluteIndex(index - 1, classOnly);
            let driverAheadGap = sc_GetTeamPropertyFromLeaderboardPosition(driverAheadPosition, 'GapToPlayer');
            
            if (driverAheadGap >= 0) {
                return driverGap - driverAheadGap;
            }
            return driverGap;
        }
    }
    
    const driverIndex = dnr_getOpponentAbsoluteIndex(index, classOnly);
    let driverGap = classOnly
        ? drivergaptoclassleader(driverIndex)
        : drivergaptoleader(driverIndex);
   
    if(index > 1) {
        const driverAheadIndex = dnr_getOpponentAbsoluteIndex(index - 1, classOnly);
        let driverAheadGap = classOnly
            ? drivergaptoclassleader(driverAheadIndex)
            : drivergaptoleader(driverAheadIndex);
       
        if(driverAheadGap >= 0) return driverGap - driverAheadGap;
    }
    return driverGap;
}

function dnr_getOpponentsDriverLicence(index, classOnly = false) {
    return driverlicencestring(dnr_getOpponentAbsoluteIndex(index, classOnly));
}

function dnr_calculateLapDifference(driverIndex, playerIndex) {
    const opponentLapHighPrecision = drivercurrentlaphighprecision(driverIndex);
    const playerLapHighPrecision = drivercurrentlaphighprecision(playerIndex);
    return Math.abs(opponentLapHighPrecision - playerLapHighPrecision);
}

function dnr_getDataSource() {
    let dataSource = $prop("DNRLEDs.Dash.RoadDataSource") ?? 1;
    if(!$prop("PostItNoteRacing.Version") && dataSource == 2) dataSource = 1;
    return dataSource;
}