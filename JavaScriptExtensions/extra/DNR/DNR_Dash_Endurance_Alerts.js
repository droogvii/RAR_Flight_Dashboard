/*
 * ---- ALERT SYSTEM ----
 */

const DNR_PIT_ALERT_CONFIG = [
    {
        id: 'ignition',
        checkFunction: () => dnr_showIgnitionOff()
    },
    {
        id: 'engine',
        checkFunction: () => dnr_showEngineOff()
    },
    {
        id: 'disengagedPitLimiter',
        checkFunction: () => dnr_showDisengagedPitLimiter()
    },
    {
        id: 'engagePitLimiter',
        checkFunction: () => dnr_showEngagePitLimiter()
    },
    {
        id: 'engagedPitLimiter',
        checkFunction: () => dnr_showEngagedPitLimiter()
    },
]

const DNR_ALERT_CONFIG = [
    {
        id: 'engine',
        checkFunction: () => dnr_showEngineOff()
    },
    {
        id: 'ignition',
        checkFunction: () => dnr_showIgnitionOff()
    },
    {
        id: 'redFlag',
        checkFunction: () => dnr_showRedFlag()
    },
    {
        id: 'disqualified',
        checkFunction: () => dnr_showDisqualified()
    }, 
    {
        id: 'blackFlagFurled',
        checkFunction: () => dnr_showBlackFlagFurled()
    }, 
    {
        id: 'blackFlag',
        checkFunction: () => dnr_showBlackFlag()
    }, 
    {
        id: 'safetyCar',
        checkFunction: () => dnr_showSafetyCar()
    }, 
    {
        id: 'virtualSafetyCar',
        checkFunction: () => dnr_showVirtualSafetyCar()
    },
    {
        id: 'doubleYellow',
        checkFunction: () => dnr_showDoubleYellowFlag()
    },
    {
        id: 'yellowFlagSector3',
        checkFunction: () => dnr_showYellowFlagSector(3)
    },
    {
        id: 'yellowFlagSector2',
        checkFunction: () => dnr_showYellowFlagSector(2)
    },
    {
        id: 'yellowFlagSector1',
        checkFunction: () => dnr_showYellowFlagSector(1)
    },
    {
        id: 'yellowFlag',
        checkFunction: () => dnr_showYellowFlag()
    },
    {
        id: 'stopAndGo',
        checkFunction: () => dnr_showStopAndGo()
    },
    {
        id: 'driveThrough',
        checkFunction: () => dnr_showDriveThrough()
    },
    {
        id: 'acPenalty',
        checkFunction: () => dnr_showACPenalty()
    },
    {
        id: 'iRacingIncident',
        checkFunction: () => dnr_showIRacingIncident()
    },
    {
        id: 'whiteFlagLastLap',
        checkFunction: () => dnr_showWhiteFlagLastLap()
    },
    {
        id: 'whiteFlagSlowCar',
        checkFunction: () => dnr_showWhiteFlagSlowCar()
    },
    {
        id: 'orangeFlag',
        checkFunction: () => dnr_showOrangeFlag()
    },
    {
        id: 'debrisFlag',
        checkFunction: () => dnr_showDebrisFlag()
    },
    {
        id: 'blueFlag',
        checkFunction: () => dnr_showBlueFlag()
    },
    {
        id: 'greenFlag',
        checkFunction: () => dnr_showGreenFlag()
    },
    {
        id: 'iRacingGreenSet',
        checkFunction: () => dnr_showIRacingGreenSet()
    },
    {
        id: 'iRacingGreenReady',
        checkFunction: () => dnr_showIRacingGreenReady()
    },
    {
        id: 'checkeredFlag',
        checkFunction: () => dnr_showCheckeredFlag()
    },
    {
        id: 'p2p',
        checkFunction: () => dnr_showP2P()
    },
    {
        id: 'flash',
        checkFunction: () => dnr_showHeadlightFlash()
    },
    {
        id: 'turnLeft',
        checkFunction: () => dnr_showHeadlightFlash()
    },
    {
        id: 'turnRight',
        checkFunction: () => dnr_showHeadlightFlash()
    }
];

function dnr_getActiveAlert(config) {
    for (const alert of config) {
        if (alert.checkFunction()) {
            root["dnr_active_alert_id"] = alert.id;
            return alert.id;
        }
    }
    root["dnr_active_alert_id"] = null;
    return null;
}

function dnr_isShowingAnAlert() {
    return dnr_getActiveAlert(DNR_ALERT_CONFIG) !== null || 
           dnr_getActiveAlert(DNR_PIT_ALERT_CONFIG) !== null;
}

function dnr_shouldShowAlert(alertId) {
    const activeAlertId = dnr_getActiveAlert(DNR_ALERT_CONFIG);
    return activeAlertId === alertId;
}

function dnr_shouldShowPitAlert(alertId) {
    const activeAlertId = dnr_getActiveAlert(DNR_PIT_ALERT_CONFIG);
    return activeAlertId === alertId;
}

/*
 * ---- ALERTS DATA ----
 */

function dnr_showHeadlightFlash() {
    return $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
		$prop('DataCorePlugin.GameRawData.Graphics.FlashingLights') == 1 ||

		$prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
		dnr_changed_minTime (1500, $prop('GameRawData.Telemetry.dcHeadlightFlash') == true);
}

function dnr_showP2P() {
    return $prop('PushToPassActive');
}

function dnr_showIgnitionOff() {
    return $prop('EngineIgnitionOn') == 0;
}

function dnr_showEngineOff() {
    return $prop('EngineIgnitionOn') == 1 && $prop('EngineStarted') == 0;
}

function dnr_showPitView() {
    return $prop('IsInPitLane') || $prop("PitLimiterOn");
}

function dnr_showDisengagedPitLimiter() {
    if(!$prop("IsInPitLane") && $prop("PitLimiterOn")) return true;
    return false;
}

function dnr_showEngagePitLimiter() {
    let raceType = $prop('GameRawData.SessionData.WeekendInfo.Category');
    let carId = $prop('CarId');
    if(raceType === "Oval" && carId != "dallarair18") return false;

    if($prop("IsInPitLane") && !$prop("PitLimiterOn")) return true;
    return false;
}

function dnr_showEngagedPitLimiter() {
    if($prop("IsInPitLane") && $prop("PitLimiterOn")) return true;
    return false;
}

function dnr_showIRacingIncident() {
    return dnr_isincreasing_maxTime (3600, $prop('GameRawData.SessionData.DriverInfo.DriverIncidentCount'));
}

function dnr_showDisqualified(){
    return $prop('DataCorePlugin.CurrentGame') == 'IRacing' && $prop('GameRawData.Telemetry.SessionFlagsDetails.Isdisqualify') == true ||
        
        $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
            ACC_DISQ.includes(isnull($prop('GameRawData.Graphics.Penalty'), 0));

    //ACC_DISQ
    // 5: ACC_Disqualified_Cutting
    //11: ACC_Disqualified_PitSpeeding
    //13: ACC_Disqualified_IgnoredMandatoryPit
    //15: ACC_Disqualified_Trolling
    //16: ACC_Disqualified_PitEntry
    //17: ACC_Disqualified_PitExit
    //18: ACC_Disqualified_Wrongway
    //20: ACC_Disqualified_IgnoredDriverStint
    //21: ACC_Disqualified_ExceededDriverStintLimit
}

function dnr_showACPenalty() {
    let AC_penalty =
        ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa' &&
        $prop('GameRawData.Graphics.PenaltyTime') > 0 && $prop('GameRawData.Graphics.Flags') == 6);
    return dnr_isincreasing_maxTime (($prop('DNRLEDs.PenaltyWarningDuration') ?? 10) * 1000, AC_penalty, 'ACPenalty') 
    // return dnr_changed_maxTime_true (($prop('DNRLEDs.PenaltyWarningDuration') ?? 10) * 1000, AC_penalty);
}

function dnr_showDriveThrough() {
    let penalty_drive_through =
        ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
        ACC_DT.includes(isnull($prop('GameRawData.Graphics.Penalty'), 0)) ||

        $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
        $prop('DataCorePlugin.GameRawData.mPitSchedule') == 5);
    return dnr_isincreasing_maxTime (($prop('DNRLEDs.PenaltyWarningDuration') ?? 10) * 1000, penalty_drive_through, 'DriveThrough') 
    // return dnr_changed_maxTime_true (($prop('DNRLEDs.PenaltyWarningDuration') ?? 10) * 1000, penalty_drive_through);

    //ACC_DT
    // 1: ACC_DriveThrough_Cutting
    // 7: ACC_DriveThrough_PitSpeeding
    //19: ACC_DriveThrough_IgnoredDriverStint
}

function dnr_showStopAndGo(){
    let penalty_stop_and_go =
        ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' && ACC_SG.includes(isnull($prop('GameRawData.Graphics.Penalty'), 0)) ||
        
        $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
        $prop('DataCorePlugin.GameRawData.mPitSchedule') == 6);

    return dnr_isincreasing_maxTime (($prop('DNRLEDs.PenaltyWarningDuration') ?? 10) * 1000, penalty_stop_and_go, 'StopAndGo')    
    // return dnr_changed_maxTime_true (($prop('DNRLEDs.PenaltyWarningDuration') ?? 10) * 1000, penalty_stop_and_go);


    //ACC_SG
    // 2: ACC_StopAndGo_10_Cutting
    // 3: ACC_StopAndGo_20_Cutting
    // 4: ACC_StopAndGo_30_Cutting
    // 8: ACC_StopAndGo_10_PitSpeeding
    // 9: ACC_StopAndGo_20_PitSpeeding
    //10: ACC_StopAndGo_30_PitSpeeding
}

function dnr_showCheckeredFlag() {
    return $prop('DNRLEDs.UniversalFlagsCheckered') ?? true
	? dnr_isincreasing_maxTime (($prop('DNRLEDs.CheckeredFlagDuration') ?? 10) * 1000, $prop('Flag_Checkered') == 1, 'CheckeredFlag')
    
    // dnr_changed_maxTime_true (($prop('DNRLEDs.CheckeredFlagDuration') ?? 10) * 1000, $prop('Flag_Checkered') == 1)

	: false;
}

function dnr_showIRacingGreenReady() {
    return $prop('GameRawData.Telemetry.SessionFlagsDetails.IsstartReady') == true;
}

function dnr_showIRacingGreenSet() {
    return $prop('GameRawData.Telemetry.SessionFlagsDetails.IsstartSet') == true;
}

function dnr_showGreenFlag() {
    return $prop('DNRLEDs.UniversalFlagsGreen') ?? true
	? $prop('Flag_Green') == 1
	: false;
}

function dnr_showBlueFlag() {
    return $prop('DNRLEDs.UniversalFlagsBlue') ?? true
	? $prop('Flag_Blue') == 1 && $prop('SpotterCarLeft') == 0 && $prop('SpotterCarRight') == 0
	: false;
}

function dnr_showDebrisFlag() {
    return $prop('DataCorePlugin.CurrentGame') == 'IRacing' && $prop('GameRawData.Telemetry.SessionFlagsDetails.Isdebris') == true;
}

function dnr_showOrangeFlag() {
    return $prop('DNRLEDs.UniversalFlagsOrange') ?? true
	? $prop('Flag_Orange') == 1 ||

	  $prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
	  $prop('GameRawData.Telemetry.SessionFlagsDetails.Isrepair') == true

	: false;
}

function dnr_showWhiteFlagSlowCar() {
    let white_flag_slow_car =
        ($prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
        $prop('IRacingExtraProperties.iRacing_SlowCarAhead') == true ||

        $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
        $prop('GameRawData.Graphics.FlagsDetails.IsACC_WHITE_FLAG') == true ||
        
        $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
        $prop('DataCorePlugin.GameRawData.mHighestFlagColour') == 3);

    let white_flag_final_lap =
        ($prop('DataCorePlugin.CurrentGame') == 'IRacing' && $prop('Flag_White') == 1 ||
        
        $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
        $prop('GameRawData.Graphics.globalWhite') == 1 ||
        
        $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
        $prop('DataCorePlugin.GameRawData.mHighestFlagColour') == 4 ||
        
        $prop('DataCorePlugin.CurrentGame') != 'IRacing' &&
        $prop('DataCorePlugin.CurrentGame') != 'AssettoCorsaCompetizione' &&
        $prop('DataCorePlugin.CurrentGame') != 'Automobilista2' &&
        $prop('DataCorePlugin.CurrentGame') != 'EAWRC23' &&
        $prop('RemainingLaps') == 1);


    if ($prop('DNRLEDs.UniversalFlagsWhiteSlowCar') ?? true) {
        if (($prop('Flag_White') == 1 || white_flag_slow_car) && !white_flag_final_lap) {
            return true;
        }
    }
    return false;
}

function dnr_showWhiteFlagLastLap() {
    let white_flag_slow_car =
        ($prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
        $prop('IRacingExtraProperties.iRacing_SlowCarAhead') == true ||

        $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
        $prop('GameRawData.Graphics.FlagsDetails.IsACC_WHITE_FLAG') == true ||
        
        $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
        $prop('DataCorePlugin.GameRawData.mHighestFlagColour') == 3);

    let white_flag_final_lap =
        ($prop('DataCorePlugin.CurrentGame') == 'IRacing' && $prop('Flag_White') == 1 ||
        
        $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
        $prop('GameRawData.Graphics.globalWhite') == 1 ||
        
        $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
        $prop('DataCorePlugin.GameRawData.mHighestFlagColour') == 4 ||
        
        $prop('DataCorePlugin.CurrentGame') != 'IRacing' &&
        $prop('DataCorePlugin.CurrentGame') != 'AssettoCorsaCompetizione' &&
        $prop('DataCorePlugin.CurrentGame') != 'Automobilista2' &&
        $prop('DataCorePlugin.CurrentGame') != 'EAWRC23' &&
        $prop('RemainingLaps') == 1);

    if ($prop('DNRLEDs.UniversalFlagsWhiteFinalLap') ?? true) {
        if (!(($prop('Flag_White') == 1 || white_flag_slow_car) &&! white_flag_final_lap)) {
             return dnr_isincreasing_maxTime (($prop('DNRLEDs.WhiteFlagFinalLapDuration') ?? 10) * 1000, white_flag_final_lap, 'WhiteFlagLastLap')
            // return dnr_changed_maxTime_true (($prop('DNRLEDs.WhiteFlagFinalLapDuration') ?? 10) * 1000, white_flag_final_lap)
        }
    }
    return false;
}

function dnr_showRedFlag() {
    return $prop('DNRLEDs.UniversalFlagsRed') ?? true
	? $prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
	  $prop('GameRawData.Telemetry.SessionFlagsDetails.Isred') == true ||

	  f1Games.includes($prop('DataCorePlugin.CurrentGame')) &&
	  $prop('DataCorePlugin.GameRawData.RedFlagShown') == true ||
	
	  $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
	  $prop('DataCorePlugin.GameRawData.mHighestFlagColour') == 5

	: false;
}

function dnr_showBlackFlag() {
    return $prop('DNRLEDs.UniversalFlagsBlack') ?? true
	? $prop('Flag_Black') == 1
	: false;
}

function dnr_showBlackFlagFurled() {
    return $prop('DNRLEDs.UniversalFlagsBlack') ?? true
	? $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
	  $prop('DataCorePlugin.GameRawData.mHighestFlagColour') == 8 ||

	  $prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
	  $prop('GameRawData.Telemetry.SessionFlagsDetails.Isfurled') == true

	: false;
}

function dnr_showYellowFlag() {
    return $prop('DNRLEDs.UniversalFlagsYellow') ?? true
	? $prop('Flag_Yellow') == 1 ||

	  $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
	  $prop('DataCorePlugin.GameRawData.mHighestFlagColour') == 6 ||
	  
	  $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' && $prop('GameRawData.Graphics.globalYellow') == 1 ||
	  
	  $prop('DataCorePlugin.CurrentGame') == 'IRacing' && $prop('GameRawData.Telemetry.SessionFlagsDetails.Isyellow') == true
	
	: false;
}

function dnr_showYellowFlagSector(sector) {
    const isYellowEnabled = $prop('DNRLEDs.UniversalFlagsYellow') ?? true;
    if (!isYellowEnabled) return false;

    const game = $prop('DataCorePlugin.CurrentGame');

    if (game === 'AssettoCorsaCompetizione') {
        return $prop(`GameRawData.Graphics.globalYellow${sector}`) == 1;
    }

    if (game === 'LMU') {
        const paddedSector = sector.toString().padStart(2, '0');
        return $prop(`GameRawData.Data.mSectorFlag${paddedSector}`) == 1;
    }

    return false;
}

function dnr_showDoubleYellowFlag() {
    return $prop('DNRLEDs.UniversalFlagsYellow') ?? true
	? $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
	  $prop('Flag_Yellow') == 1 ||
	  
	  $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
	  $prop('DataCorePlugin.GameRawData.Graphics.FlagsDetails.IsACC_YELLOW_FLAG') == 1

	: false;
}

function dnr_showVirtualSafetyCar() {
    return $prop('DNRLEDs.UniversalFlagsSafetyCar') ?? true
	? f1Games.includes($prop('DataCorePlugin.CurrentGame')) &&
	  $prop('DataCorePlugin.GameRawData.PacketSessionData.m_safetyCarStatus') == 2

	: false;
}

function dnr_showSafetyCar() {
    return $prop('DNRLEDs.UniversalFlagsSafetyCar') ?? true
	? f1Games.includes($prop('DataCorePlugin.CurrentGame')) &&
	  $prop('DataCorePlugin.GameRawData.PacketSessionData.m_safetyCarStatus') == 1 ||
	  
	  $prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
	  $prop('GameRawData.Telemetry.SessionFlagsDetails.IscautionWaving') == true ||
	  
	  $prop('DataCorePlugin.CurrentGame') == 'LMU' &&
	  ($prop('GameRawData.rules.mTrackRules.mSafetyCarActive') ?? 0) != 0

	: false;
}