//DNR Embedded extensions 5.6.1

const f1Games = ['F12030', 'F12029', 'F12028', 'F12027', 'F12026', 'F12025', 'F12024', 'F12023', 'F12022', 'F12021'];

const ACC_DT = [1, 7, 19];
const ACC_SG = [2, 3, 4, 8, 9, 10];
const ACC_DISQ = [5, 11, 13, 15, 16, 17, 18, 20, 21];

let NM_LD_Behaviour;
let NM_DNR_Behaviour;
let TDM_LD_Behaviour;
let TDM_DNR_Behaviour;
let TDMState;
let ERSSoC;
let KERS;

class GlobalColours {
	constructor() {
		this.update();
	}

	update() {
		this.dnr_TCcolour_Hex = $prop('DNRLEDs.TractionControlColour') ?? '#FF00BFFF';
		this.dnr_ABScolour_Hex = $prop('DNRLEDs.ABSColour') ?? '#FFFFFF00';
		this.dnr_BBcolour_Hex = $prop('DNRLEDs.BrakeBiasColour') ?? '#FFFF0000';
		this.dnr_MAPcolour_Hex = $prop('DNRLEDs.EngineMapColour') ?? '#FF00FF00';

		this.dnr_IgnitionOn_Hex = $prop('DNRLEDs.IgnitionOnColour') ?? '#FFFFFF00';
		this.dnr_EngineOff_Hex = $prop('DNRLEDs.EngineOffColour') ?? '#FFFF4500';
		this.dnr_EngineOn_Hex = $prop('DNRLEDs.EngineOnColour') ?? '#FF00FF00';

		this.dnr_EngineStart_Hex = $prop('DNRLEDs.EngineStartColour') ?? '#FFFF4500';

		this.dnr_Clutch_Hex = $prop('DNRLEDs.ClutchColour') ?? '#FF8A2BE2';
		this.dnr_Brake_Hex = $prop('DNRLEDs.BrakeColour') ?? '#FFFF0000';
		this.dnr_Flasher_Hex = $prop('DNRLEDs.FlasherColour') ?? '#FF00BFFF';

		this.dnr_Spotter_Hex = $prop('DNRLEDs.SpotterColour') ?? '#FFFF1493';

		this.dnr_PitLimiter_Hex1 = $prop('DNRLEDs.PitLimiterColour1') ?? '#FF0000FF';
		this.dnr_PitLimiter_Hex2 = $prop('DNRLEDs.PitLimiterColour2') ?? '#FFFFFFFF';

		this.dnr_Lowfuel_Hex = $prop('DNRLEDs.LowFuelColour') ?? '#FFFF0000';
	}
}
const UpdateGlobalColours = new GlobalColours();


// Interpolate between two colours function
function interpolateColour(startColor, endColor, ratio) {
	const start = parseInt(startColor.slice(1), 16);
	const end = parseInt(endColor.slice(1), 16);

	const a1 = (start >> 24) & 0xff, r1 = (start >> 16) & 0xff, g1 = (start >> 8) & 0xff, b1 = start & 0xff;
	const a2 = (end >> 24) & 0xff, r2 = (end >> 16) & 0xff, g2 = (end >> 8) & 0xff, b2 = end & 0xff;

	const a = Math.round(a1 + ratio * (a2 - a1)).toString(16).padStart(2, '0');
	const r = Math.round(r1 + ratio * (r2 - r1)).toString(16).padStart(2, '0');
	const g = Math.round(g1 + ratio * (g2 - g1)).toString(16).padStart(2, '0');
	const b = Math.round(b1 + ratio * (b2 - b1)).toString(16).padStart(2, '0');

	return `#${a}${r}${g}${b}`.toUpperCase();
};


//Dim function
function dnr_dimColour(hex, factor) {
	const num = parseInt(hex.slice(1), 16);

	const a = (num >>> 24) & 0xFF;
	const r = Math.round(((num >>> 16) & 0xFF) * factor);
	const g = Math.round(((num >>> 8) & 0xFF) * factor);
	const b = Math.round((num & 0xFF) * factor);

	const dimmed = (a << 24 | r << 16 | g << 8 | b) >>> 0;

	return `#${dimmed.toString(16).padStart(8, '0')}`;
};


function dnr_FC_State(dnr_DeviceType) {

if (f1Games.includes($prop('DataCorePlugin.CurrentGame'))) return true;

// Copy LD Behaviour
if ($prop('DNRLEDs.TDMLovelyDashboardBehaviour') ?? true) {
		if ($prop('LovelyPlugin.ld_TrueDarkModeEnabled') == true) TDM_LD_Behaviour = true;
		if ($prop('LovelyPlugin.ld_TrueDarkModeEnabled') == false) return true;
}
if ($prop('DNRLEDs.TDMLovelyDashboardBehaviour') == false) TDM_LD_Behaviour = false;

// Fallback to own behavior when there is no LD connection
TDM_DNR_Behaviour = dnr_DeviceType;

if (TDM_LD_Behaviour || TDM_DNR_Behaviour) {

TDMState = TDM_LD_Behaviour
	? $prop('LovelyPlugin.ld_TrueDarkModeState') ?? false
	: $prop('DNRLEDs.TDMState') ?? false;

	if ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione') {
		return 	(TDMState == false &&
				$prop('GameRawData.Graphics.LightsStage') == 0 ||

				TDMState == false &&
				$prop('GameRawData.Graphics.LightsStage') == 1 ||

				TDMState == false &&
				$prop('GameRawData.Graphics.LightsStage') == 2 &&
				$prop('LovelyPlugin.ld_TrueDarkModeNative') == false ||

				TDMState == false &&
				!TDM_LD_Behaviour &&
				$prop('GameRawData.Graphics.LightsStage') == 2 &&
				($prop('DNRLEDs.TDMNative') ?? true) == false);
	}

	if ($prop('DataCorePlugin.CurrentGame') == 'Automobilista2') {
	return 	(TDMState == false &&
			($prop('DataCorePlugin.GameRawData.mCarFlags') & (1 << 0)) == 0 ||

			TDMState == false &&
			($prop('DataCorePlugin.GameRawData.mCarFlags') & (1 << 0)) != 0 &&
			$prop('LovelyPlugin.ld_TrueDarkModeNative') == false ||

			TDMState == false &&
			!TDM_LD_Behaviour &&
			($prop('DataCorePlugin.GameRawData.mCarFlags') & (1 << 0)) != 0 &&
			($prop('DNRLEDs.TDMNative') ?? true) == false);
	}
	
	return TDMState == false; //All other games
}
return true;
};


function dnr_TDM_State(dnr_DeviceType) {

if (f1Games.includes($prop('DataCorePlugin.CurrentGame'))) return false;

// Copy LD Behaviour
if ($prop('DNRLEDs.TDMLovelyDashboardBehaviour') ?? true) {
		if ($prop('LovelyPlugin.ld_TrueDarkModeEnabled') == true) TDM_LD_Behaviour = true;
		if ($prop('LovelyPlugin.ld_TrueDarkModeEnabled') == false) return false;
}
if ($prop('DNRLEDs.TDMLovelyDashboardBehaviour') == false) TDM_LD_Behaviour = false;

// Fallback to own behavior when there is no LD connection
TDM_DNR_Behaviour = dnr_DeviceType;

if (TDM_LD_Behaviour || TDM_DNR_Behaviour) {

TDMState = TDM_LD_Behaviour
	? $prop('LovelyPlugin.ld_TrueDarkModeState') ?? false
	: $prop('DNRLEDs.TDMState') ?? false;

	if ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione') {
		if ((TDM_LD_Behaviour && $prop('LovelyPlugin.ld_TrueDarkModeNative') == true) ||
		   (!TDM_LD_Behaviour && ($prop('DNRLEDs.TDMNative') ?? true))) {
				return TDMState == true || $prop('GameRawData.Graphics.LightsStage') == 2;
		}
	}

	if ($prop('DataCorePlugin.CurrentGame') == 'Automobilista2') {
		if ((TDM_LD_Behaviour && $prop('LovelyPlugin.ld_TrueDarkModeNative') == true) ||
		   (!TDM_LD_Behaviour && ($prop('DNRLEDs.TDMNative') ?? true))) {
				return TDMState == true || ($prop('DataCorePlugin.GameRawData.mCarFlags') & (1 << 0)) != 0;
		}
	}
	
	return TDMState == true; //All other games
}
return false;
};


function dnr_TDM_Colour() {
	// LD 0 = Red, 1 = Blue, 2 = Purple, 3 = Orange
	if ($prop('LovelyPlugin.Version') != null) {
		if ($prop('DNRLEDs.TDMLovelyDashboardBehaviour') ?? true) {
			if ([0, 1, 2, 3].includes($prop('LovelyPlugin.ld_TrueDarkModeColor'))) {
				return $prop('LovelyPlugin.ld_TrueDarkModeColor') + 1;
			}
		}
	};
	// Fallback to own behaviour when there is no LD connection
	return $prop('DNRLEDs.TDMColour') ?? 1;
};


function dnr_TDM_Colour_Hex(TDMvariant) {
	const colourVariant = {
		main: {
			0: ($prop('DNRLEDs.TDMColourMain') ?? '#FF00FF00'),
			1: '#FFFF0000',
			2: '#FF0000FF',
			3: '#FF4B0082',
			4: '#FFFF8C00'
		},
		alt: {
			0: ($prop('DNRLEDs.TDMColourAlt') ?? '#FFFFFF00'),
			1: '#FFFF8C00',
			2: '#FF00FFFF',
			3: '#FFFF1493',
			4: '#FFFF0000'
		},
	};
	return colourVariant[TDMvariant][dnr_TDM_Colour()];
};


//function dnr_Mirror(inputArray, totalLeds, startLed) {
//	const allLedsArray = new Array(totalLeds).fill(null);
//	allLedsArray.splice(startLed, inputArray.length, ...inputArray);
//	const mirroredArray = [...inputArray].reverse();
//	const mirroredStartLed = totalLeds - inputArray.length - startLed;
//	allLedsArray.splice(mirroredStartLed, inputArray.length, ...mirroredArray);
//	return allLedsArray;
//};


function dnr_Mirror(inputArray, totalLeds, startLedIndex) {
	const allLedsArray = new Array(totalLeds).fill(null);
	const inputArrayLength = inputArray.length;
	const mirroredStartIndex = totalLeds - inputArrayLength - startLedIndex;

	for (let i = 0; i < inputArrayLength; i++) {
		const leftIndex = startLedIndex + i;
		const rightIndex = mirroredStartIndex + i;

		if (leftIndex < totalLeds) {
			allLedsArray[leftIndex] = inputArray[i];
		}
		if (rightIndex >= 0 && rightIndex < totalLeds) {
			allLedsArray[rightIndex] = inputArray[inputArrayLength - 1 - i];
		}
	}
	return allLedsArray;
};


const dnr_changed_maxTime_true_states = {};
function dnr_changed_maxTime_true (maxDuration, propertyValue, key = null) {
	const state = dnr_changed_maxTime_true_states[key] ??= {
		oldstate: null,
		triggerTime: null
	};
	if (propertyValue !== state.oldstate && propertyValue == true) {
		state.triggerTime = Date.now();
	}
	state.oldstate = propertyValue;
	return state.triggerTime !== null && Date.now() - state.triggerTime <= maxDuration;
}; //White Flag, Checkered Flag, Drive Through Penalty, Stop & Go


const dnr_changed_maxTime_false_states = {};
function dnr_changed_maxTime_false (maxDuration, propertyValue, key = null) {
	const state = dnr_changed_maxTime_false_states[key] ??= {
		oldstate: null,
		triggerTime: null
	};
	if (propertyValue !== state.oldstate && propertyValue == false) {
		state.triggerTime = Date.now();
	}
	state.oldstate = propertyValue;
	return state.triggerTime !== null && Date.now() - state.triggerTime <= maxDuration;
}; //not used yet


function dnr_changed_minTime (minDuration, propertyValue) {
	if (propertyValue) {
		root.triggerTime = Date.now();
	}
	return Date.now() - root.triggerTime < minDuration;
}; //iRacing flasher, Press Delay


const dnr_isincreasing_maxTime_states = {};
function dnr_isincreasing_maxTime (maxDuration, propertyValue, key = null) {
	const state = dnr_isincreasing_maxTime_states[key] ??= {
		oldstate: propertyValue,
		newstate: propertyValue,
		triggerTime: null
	};

	state.oldstate = state.newstate;
	state.newstate = propertyValue;

	if (state.newstate > state.oldstate) {
		state.triggerTime = Date.now();
	}

	return state.triggerTime != null && Date.now() - state.triggerTime <= maxDuration;
}; //ERS Deploy, ERS Regen, iRacing incident, value increase, EngineStart


const dnr_isdecreasing_maxTime_states = {};
function dnr_isdecreasing_maxTime (maxDuration, propertyValue, key = null) {
	const state = dnr_isdecreasing_maxTime_states[key] ??= {
		oldstate: propertyValue,
		newstate: propertyValue,
		triggerTime: null
	};

	state.oldstate = state.newstate;
	state.newstate = propertyValue;

	if (state.newstate < state.oldstate) {
		state.triggerTime = Date.now();
	}

	return state.triggerTime != null && Date.now() - state.triggerTime <= maxDuration;
}; //ERS Deploy, ERS Regen, value decrease, Pitlane Exit warning


function dnr_changed_maxTime (maxDuration, propertyValue) {
	root.oldstate = root.oldstate == null ? propertyValue : root.newstate;
	root.newstate = propertyValue;
	if (root.newstate !== root.oldstate) root.triggerTime = Date.now();
	return root.triggerTime !== null && Date.now() - root.triggerTime <= maxDuration;
}; //Input effect


function dnr_lights() {
	return $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
		$prop('GameRawData.Graphics.LightsStage') !== 0 ||
		
		$prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
		($prop('DataCorePlugin.GameRawData.mCarFlags') & (1 << 0)) !== 0 ||

		$prop('DataCorePlugin.CurrentGame') == 'LMU' &&
		$prop('GameRawData.CurrentPlayer.mHeadlights') == 1;

		$prop('DataCorePlugin.CurrentGame') == 'RFactor2' &&
		$prop('GameRawData.CurrentPlayer.mHeadlights') == 1;
};


function dnr_lightsHighbeam() {
	return $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
		$prop('GameRawData.Graphics.LightsStage') == 2;
};


function dnr_flash() {
	return $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
		$prop('DataCorePlugin.GameRawData.Graphics.FlashingLights') == 1 ||

		$prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
		dnr_changed_minTime (1500, $prop('GameRawData.Telemetry.dcHeadlightFlash') == true);
};


function dnr_rainlights() {
	return $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
		$prop('GameRawData.Graphics.RainLights') == 1;
};


function dnr_wipers() {
	return $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione' &&
		$prop('GameRawData.Graphics.WiperLV') != 0 ||

		$prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
		$prop('GameRawData.Telemetry.Precipitation') > 0 ||

		$prop('DataCorePlugin.CurrentGame') == 'LMU' &&
		$prop('GameRawData.Data.mRaining') > 0 ||

		$prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
		$prop('GameRawData.mRainDensity') > 0;
};


function dnr_parkingBrake() {
	return ($prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') &&
		$prop('GameRawData.TruckValues.CurrentValues.MotorValues.BrakeValues.ParkingBrake') == true;
};


let dnr_LowFuelAcknowledge = false;

function dnr_LowFuel(dnr_DeviceTypeLowFuel) {
	const dnr_hotlapTypes = $prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione'
		? ['HOTLAP', 'TIME_ATTACK', '8']
		: ['HOTLAP', 'TIME_ATTACK', 'Time Attack', 'Time Trial'];
	const dnr_qualifyTypes = ['QUALIFY', 'Qualify', 'Open Qualify', 'Lone Qualify', 'Qualifying'];
	const dnr_practiceTypes = ['PRACTICE', 'Practice', 'Offline Testing', 'Training'];

	const dnr_excludedSessionTypes = [
		...(($prop('DNRLEDs.LowFuelHotlap') ?? true) == false ? dnr_hotlapTypes : []),
		...(($prop('DNRLEDs.LowFuelQualify') ?? true) == false ? dnr_qualifyTypes : []),
		...(($prop('DNRLEDs.LowFuelPractice') ?? true) == false ? dnr_practiceTypes : [])
	];

	if (dnr_isincreasing_maxTime (100, $prop('CarSettings_FuelAlertActive'), 'LowFuelAcknowledge'))
		dnr_LowFuelAcknowledge = false;
	if (dnr_changed_maxTime_true (100, $prop('DNRLEDs.LowFuelAcknowledge'), 'LowFuelAcknowledge'))
		dnr_LowFuelAcknowledge = true;

	if (dnr_DeviceTypeLowFuel) {
		return $prop('CarSettings_FuelAlertActive') == 1 &&
			!dnr_LowFuelAcknowledge &&
			!dnr_excludedSessionTypes.includes($prop('SessionTypeName'));
	}
	return false;
};


function dnr_brake_propertySelect() {
	if ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione') {
		return parseInt($prop('GameRawData.Physics.Brake') * 100);
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'IRacing') {
		return parseInt($prop('GameRawData.Telemetry.BrakeRaw') * 100);
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa') {
		return parseInt($prop('GameRawData.Physics.Brake') * 100);
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'Automobilista2') {
		return parseInt($prop('GameRawData.mUnfilteredBrake') * 100);
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'LMU') {
		return parseInt($prop('GameRawData.CurrentPlayerTelemetry.mUnfilteredBrake') * 100);
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'RFactor2') {
		return parseInt($prop('GameRawData.CurrentPlayerTelemetry.mUnfilteredBrake') * 100);
	}
	return parseInt($prop('Brake'));
};


function dnr_ABSActive() {
	if ($prop('DataCorePlugin.CurrentGame') == 'LMU') {
		const absForces = [
			$prop('GameRawData.physicsGuessing.ABSForce01'),
			$prop('GameRawData.physicsGuessing.ABSForce02'),
			$prop('GameRawData.physicsGuessing.ABSForce03'),
			$prop('GameRawData.physicsGuessing.ABSForce04')
			];
		return absForces.some(force => force > 0);
	}
	return $prop('ABSActive') == 1;
};


function dnr_TCCut_propertySelect() {
	if ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione') {
		return $prop('GameRawData.Graphics.TCCut');
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'IRacing') {
		return $prop('GameRawData.Telemetry.dcTractionControl2');
	}
};


function dnr_pitLaneMaxSpeed_propertySelect() {
	if ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione') {
		return 50;
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'IRacing') {
		return parseInt($prop('GameRawData.SessionData.WeekendInfo.TrackPitSpeedLimit'));
	}
	if (f1Games.includes($prop('DataCorePlugin.CurrentGame'))) {
		return isnull($prop('GameRawData.PacketSessionData.m_pitSpeedLimit'), 0);
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'LMU') {
		return 60;
	}
};


function iRacing_Pit_Box_Distance() {
	return Math.round($prop('IRacingExtraProperties.iRacing_DistanceToPitBox') - 5) / 20;
};

function iRacing_Pit_Box() {
	return $prop('DataCorePlugin.GameData.IsInPitLane') == 1 && $prop('IsInPit') == 0 && $prop('SpeedKmh') > 20 && iRacing_Pit_Box_Distance() > 0 && iRacing_Pit_Box_Distance() <= 9;
};


function dnr_DRS_detection() {
	return	$prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
		$prop('GameRawData.Telemetry.DRS_Status') == 1 ||

		$prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
		($prop('GameRawData.mDrsState') & (1 << 2)) !== 0 ||

		f1Games.includes($prop('DataCorePlugin.CurrentGame')) &&
		$prop('GameRawData.PlayerCarStatusData.m_drsActivationDistance') > 0;
};


function dnr_ERSDeploy() {
	return $prop('DataCorePlugin.CurrentGame') == 'LMU' &&
		$prop('GameRawData.CurrentPlayerTelemetry.mElectricBoostMotorState') == 2 &&
		$prop('GameRawData.CurrentPlayerTelemetry.mElectricBoostMotorTorque') > 0 ||
			
		$prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa' &&
		($prop('GameRawData.StaticInfo.HasERS') == 1 ||
		$prop('GameRawData.StaticInfo.HasKERS') == 1) &&
		$prop('GameRawData.Physics.KersInput') > 0 ||
			
		$prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
		dnr_isdecreasing_maxTime (100, $prop('ERSPercent')) ||
			
		$prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
		dnr_isdecreasing_maxTime (100, $prop('GameRawData.Telemetry.EnergyERSBatteryPct')) ||
			
		f1Games.includes($prop('DataCorePlugin.CurrentGame')) &&
		dnr_isincreasing_maxTime (100, $prop('GameRawData.PlayerCarStatusData.m_ersDeployedThisLap'), 'ERSDeploy');
};


function dnr_ERSRegen() {
	return $prop('DataCorePlugin.CurrentGame') == 'LMU' &&
		$prop('GameRawData.CurrentPlayerTelemetry.mElectricBoostMotorState') == 3 ||
			
		$prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa' &&
		$prop('GameRawData.StaticInfo.HasERS') == 1 &&
		$prop('GameRawData.Physics.ErsisCharging') == 1 ||
			
		$prop('DataCorePlugin.CurrentGame') == 'Automobilista2' &&
		dnr_isincreasing_maxTime (100, $prop('ERSPercent'), 'ERSRegen') ||
			
		$prop('DataCorePlugin.CurrentGame') == 'IRacing' &&
		dnr_isincreasing_maxTime (100, $prop('GameRawData.Telemetry.EnergyERSBatteryPct'), 'ERSRegen');
};


function dnr_ERSSoC() {
	if ($prop('DataCorePlugin.CurrentGame') == 'LMU' && $prop('GameRawData.CurrentPlayerTelemetry.mElectricBoostMotorState') != 0 && $prop('CarModel') != "Aston Martin THOR Team 2025" && $prop('CarModel') != "AM Valkyrie Custom Team 2025" && $prop('CarModel') != "Glickenhaus Racing" && $prop('CarModel') != "Glickenhaus Custom Team 2023" && $prop('CarModel') != "Floyd Vanwall Racing Team" && $prop('CarModel') != "Vanwall Custom Team 2023") {
		return $prop('GameRawData.CurrentPlayerTelemetry.mBatteryChargeFraction') * 100;
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa' && $prop('GameRawData.StaticInfo.HasERS') == 1) {
		return $prop('GameRawData.Physics.KersCharge') * 100;
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'Automobilista2' && ($prop('DataCorePlugin.GameRawData.mErsDeploymentMode') != 0 || $prop('GameRawData.mErsAutoModeEnabled') == true)) {
		return $prop('ERSPercent');
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'IRacing' && $prop('GameRawData.Telemetry.EnergyERSBatteryPct') != null) {
		return $prop('GameRawData.Telemetry.EnergyERSBatteryPct') * 100;
	}
	if (f1Games.includes($prop('DataCorePlugin.CurrentGame'))) {
		return $prop('ERSPercent');
	}
};


function dnr_KERS() {
	if ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa' && ($prop('GameRawData.StaticInfo.HasKERS') == 1 || $prop('GameRawData.StaticInfo.HasERS') == 1)) {
		return 100 - $prop('ERSPercent');
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'Automobilista2' && $prop('GameRawData.mErsAutoModeEnabled') == true) {
		if ($prop('GameRawData.mBoostActive') == true) return 100;
		else return 0;
	}
	if (f1Games.includes($prop('DataCorePlugin.CurrentGame'))) {
		return 100 - $prop('GameRawData.PlayerCarStatusData.m_ersDeployedThisLap') / $prop('ERSMax') * 100;
	}
};


function dnr_ERS_Colour_Hex() {
	const dnr_ERSNoDeploycolour_Hex = $prop('DNRLEDs.ERSNoDeployColour') ?? '#FFFFFFFF';
	const dnr_ERSQualifycolour_Hex = $prop('DNRLEDs.ERSQualifyColour') ?? '#FF4B0082';
	const dnr_ERSAttackcolour_Hex = $prop('DNRLEDs.ERSAttackColour') ?? '#FFFF0000';
	const dnr_ERSBalancedcolour_Hex = $prop('DNRLEDs.ERSBalancedColour') ?? '#FF00FF00';
	const dnr_ERSBuildcolour_Hex = $prop('DNRLEDs.ERSBuildColour') ?? '#FFFF1493';

	if ($prop('DataCorePlugin.CurrentGame') == 'IRacing') {
		switch ($prop('GameRawData.Telemetry.dcMGUKDeployMode')) {
			//No Deploy
			case 0:
				return dnr_ERSNoDeploycolour_Hex;
			//Qualify
			case 1:
				return dnr_ERSQualifycolour_Hex;
			//Attack
			case 2:
				return dnr_ERSAttackcolour_Hex;
			//Balanced
			case 3:
				return dnr_ERSBalancedcolour_Hex;
			//Build
			case 4:
				return dnr_ERSBuildcolour_Hex;
			default:
				return [null];
		}
	}
	if (f1Games.includes($prop('DataCorePlugin.CurrentGame'))) {
		switch ($prop('GameRawData.PlayerCarStatusData.m_ersDeployMode')) {
			//No Deploy
			case 0:
				return dnr_ERSNoDeploycolour_Hex;
			//Medium (Balanced)
			case 1:
				return dnr_ERSBalancedcolour_Hex;
			//Hotlap (Attack)
			case 2:
				return dnr_ERSAttackcolour_Hex;
			//Overtake (Qualify)
			case 3:
				return dnr_ERSQualifycolour_Hex;
			default:
				return [null];
		}
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'Automobilista2') {
		switch ($prop('GameRawData.mErsDeploymentMode')) {
			//No ERS support
			case 0:
				return [null];
			//No Deploy
			case 1:
				return dnr_ERSNoDeploycolour_Hex;
			//Build
			case 2:
				return dnr_ERSBuildcolour_Hex;
			//Balanced
			case 3:
				return dnr_ERSBalancedcolour_Hex;
			//High (Attack)
			case 4:
				return dnr_ERSAttackcolour_Hex;
			//Max (Qualify)
			case 5:
				return dnr_ERSQualifycolour_Hex;
			default:
				return [null];
		}
	}
};


function dnr_gear() {
	let gearDashboard = $prop('GameRawData.TruckValues.CurrentValues.DashboardValues.GearDashboards');

	if ($prop('DataCorePlugin.CurrentGame') !== 'ETS2' && $prop('DataCorePlugin.CurrentGame') !== 'ATS') return $prop('Gear');

	// Crawler Gears (C1, C2)
	if ($prop('GameRawData.TruckValues.ConstantsValues.MotorValues.ForwardGearCount') == 14) {
		if (gearDashboard == 1 || gearDashboard == 2) return 'C' + gearDashboard;
		if (gearDashboard >= 3) return gearDashboard - 2;
	}
	// Reverse Gears
	if (gearDashboard < 0) {
		if ($prop('GameRawData.TruckValues.ConstantsValues.MotorValues.ReverseGearCount') == 1) return 'R';
		return 'R' + -gearDashboard;
	}
	// Neutral Gear
	if (gearDashboard == 0) return 'N';
	// Return the gear number if no other conditions apply
	return gearDashboard;
};


const dnr_ACRedlines = [
	//RSS
	//Formula Americas 2020
	{	name: "rss_formula_americas_2020",
		redline: {}
		//redline: {'ALL': 11700 }
	},
	{	name: "rss_formula_americas_2020_oval",
		redline: {}
		//redline: {'ALL': 11700 }
	},
	//Formula Hybrid 2017
	{	name: "rss_formula_hybrid_2017",
		redline: {'ALL': 11900 }
	},
	//Formula Hybrid 2018
	{	name: "rss_formula_hybrid_2018",
		redline: {'ALL': 11700 }
	},
	{	name: "rss_formula_hybrid_2018_s1",
		redline: {'ALL': 11700 }
	},
	//Formula Hybrid 2019
	{	name: "rss_formula_hybrid_2019",
		redline: {'ALL': 11700 }
	},
	//Formula Hybrid 2022 X
	{	name: "rss_formula_hybrid_x",
		redline: {'ALL': 11700 }
	},
	{	name: "rss_formula_hybrid_x_evo",
		redline: {'ALL': 11700 }
	},
	//Formula Hybrid 2020
	{	name: "rss_formula_hybrid_2020",
		redline: {'ALL': 11700 }
	},
	//Formula Hybrid 2021
	{	name: "rss_formula_hybrid_2021",
		redline: {'ALL': 11700 }
	},
	//Formula Hybrid 2022
	{	name: "rss_formula_hybrid_2022",
		redline: {'ALL': 11800 }
	},
	{	name: "rss_formula_hybrid_2022_s",
		redline: {'ALL': 12000 }
	},
	//Formula Hybrid 2023
	{	name: "rss_formula_hybrid_2023",
		redline: {'ALL': 11700 }
	},
	//Formula Hybrid 2024
	{	name: "rss_formula_hybrid_2024",
		redline: {'ALL': 12000 }
	},
	//Formula Hybrid 2026 X
	{	name: "rss_formula_hybrid_x_2026",
		redline: {'ALL': 12000 }
	},
	//Formula Hybrid 2025 Alpine
	{	name: "rss_formula_hybrid_2025_alpine",
		redline: {'ALL': 12500 }
	},
	//Formula Hybrid V12-R
	{	name: "rss_formula_hybrid_v12-r",
		redline: {'ALL': 12500 }
	},
	//Formula RSS 1990 V12
	{	name: "rss_formula_1990",
		redline: {'ALL': 12740 }
	},
	//Formula RSS 2 V8 2017
	{	name: "rss_formula_rss_2_v8_2017",
		redline: {}
	},
	//Formula RSS 2 V6 2020
	{	name: "rss_formula_rss_2_v6_2020",
		redline: {}
	},
	//Formula RSS 2 V6 2024
	{	name: "rss_formula_rss_2_v6_2024",
		redline: {'ALL': 8700 }
	},
	//Formula RSS 2000 V10
	{	name: "rss_formula_2000",
		redline: {'ALL': 17650 }
	},
	//Formula RSS 2010 V8
	{	name: "rss_formula_2010",
		redline: {}
	},
	//Formula RSS 2013 V8
	{	name: "rss_formula_2013",
		redline: {'ALL': 17600 }
	},
	//Formula RSS 3 V6
	{	name: "rss_formula_rss_3_v6",
		redline: {}
	},
	//Formula RSS 4
	{	name: "rss_formula_rss_4",
		redline: {'ALL': 6350 }
	},
	//Formula RSS 4 2024
	{	name: "rss_formula_rss_4_2024",
		redline: {'ALL': 6100 }
	},
	//Formula RSS Supreme
	{	name: "rss_formula_rss_supreme",
		redline: {'ALL': 9300 }
	},
	//Formula RSS Supreme 2025
	{	name: "rss_formula_rss_supreme_25",
		redline: {'R': 9300, 'N': 5000, '1': 9300, '2': 9300, '3': 9300, '4': 9300, '5': 9300, '6': 9300 }
	},
	//GT Adonis D9 V12
	{	name: "rss_gt_adonis_d9_v12",
		redline: {'ALL': 7100 }
	},
	//GT Ferruccio 55 V12
	{	name: "rss_gt_ferruccio_55",
		redline: {'ALL': 7300 }
	},
	//GT Ferruccio 57 V12
	{	name: "rss_gt_ferruccio_57",
		redline: {'ALL': 7200 }
	},
	//GT Lanzo V12
	{	name: "rss_gt_lanzo_v12",
		redline: {'ALL': 7300 }
	},
	//GT Shadow V8
	{	name: "rss_gt_shadow_v8",
		redline: {}
	},
	//GT Tornado V12
	{	name: "rss_gt_tornado_v12",
		redline: {'ALL': 6222 }
	},
	//GT-M Aero V10 EVO2
	{	name: "rss_gtm_aero_v10_evo2",
		redline: {'ALL': 8100 }
	},
	//GT-M Akuro V6 EVO2
	{	name: "rss_gtm_akuro_v6_evo2",
		redline: {'ALL': 7300 }
	},
	//GT-M Bayer V8
	{	name: "rss_gtm_bayer_v8",
		redline: {'ALL': 6400 }
	},
	//GT-M Furiano 96 V6
	{	name: "rss_gtm_furiano_96_v6",
		redline: {'R': 7600, 'N': 7600, '1': 7540, '2': 7480, '3': 7420, '4': 7360, '5': 7300 }
	},
	//GT-M Hyperion V8
	{	name: "rss_gtm_hyperion_v8",
		redline: {'ALL': 7900 }
	},
	//GT-M Lanzo V10
	{	name: "rss_gtm_lanzo_v10",
		redline: {'ALL': 8000 }
	},
	//GT-M Lanzo V10 EVO2
	{	name: "rss_gtm_lanzo_v10_evo2",
		redline: {'ALL': 7800 }
	},
	//GT-M Lux V8
	{	name: "rss_gtm_lux_v8",
		redline: {'ALL': 7275 }
	},
	//GT-M Mercer V8
	{	name: "rss_gtm_mercer_v8",
		redline: {'ALL': 6950 }
	},
	//GT-M Protech P92 F6
	{	name: "rss_gtm_protech_p92_f6",
		redline: {'ALL': 8900 }
	},
	//GT-N Darche 96 F6
	{	name: "rss_gtn_darche_96",
		redline: {'ALL': 8200 }
	},
	//GT-N Ferruccio 36 V8
	{	name: "rss_gtn_ferruccio_36",
		redline: {'ALL': 8500 }
	},
	//LMGT Toyama 2-Zero V8
	{	name: "rss_lmgt_toyama_2zero_v8",
		redline: {'ALL': 7200 }
	},
	//LMP1 Protech P91 Hybrid EVO
	{	name: "rss_lmp1_protech_p91_evo",
		redline: {'ALL': 7800 }
	},
	//MP-H Bayer Hybrid V8
	{	name: "rss_mph_bayer_hybrid_v8",
		redline: {'ALL': 7800 }
	},
	//MP-H Callahan V8
	{	name: "rss_mph_callahan_v8",
		redline: {'R': 8200, 'N': 8400, '1': 8200, '2': 8400, '3': 8400, '4': 8600, '5': 8700, '6': 8700 }
	},
	//MP-H Protech P96 V8
	{	name: "rss_mph_protech_p96_v8",
		redline: {'ALL': 8000 }
	},
	//Hyperion 2020
	{	name: "rss_hyperion_2020",
		redline: {'ALL': 9500 }
	},

	//VRC
	//PT Auriel 8
	{	name: "vrc_pt_auriel8",
		redline: {'ALL': 8000 }
	},
	//PT Project 8
	{	name: "vrc_pt_project8",
		redline: {'ALL': 7800 }
	},
	//PT 1999 Beamer
	{	name: "vrc_pt_1999_beamer",
		redline: {'ALL': 7500 }
	},
	//PT Cadenza
	{	name: "vrc_pt_cadenza",
		redline: {'ALL': 7200 }
	},
	//PT 2019 Bycollin
	{	name: "vrc_pt_2019_bycollin",
		redline: {'ALL': 8800 }
	},
	//PT 2019 Vendetta V60
	{	name: "vrc_pt_2019_vendetta_v60",
		redline: {'ALL': 7800 }
	},
	//PT Pavey
	{	name: "vrc_pt_pavey",
		redline: {'ALL': 7200 }
	},
	//PT 2019 Revenga R13
	{	name: "vrc_pt_2019_revenga_r13",
		redline: {'ALL': 8800 }
	},
	//PT 2019 Tagomi T50
	{	name: "vrc_pt_2019_tagomi_t50",
		redline: {'ALL': 7500 }
	},
	//PT 2024 Arden V24
	{	name: "vrc_pt_2024_arden",
		redline: {'ALL': 8650 }
	},
	{	name: "vrc_pt_2024_arden_csp",
		redline: {'ALL': 8550 }
	},
	//PT 2024 Cadenza V
	{	name: "vrc_pt_2024_cadenza",
		redline: {'ALL': 8650 }
	},
	{	name: "vrc_pt_2024_cadenza_csp",
		redline: {'ALL': 8750 }
	},
	//PT 2024 Ferrenzo P49
	{	name: "vrc_pt_2024_ferrenzo",
		redline: {'ALL': 7600 }
	},
	{	name: "vrc_pt_2024_ferrenzo_csp",
		redline: {'ALL': 7800 }
	},
	//PT 2024 Isola Santini
	{	name: "vrc_pt_2024_isola",
		redline: {'ALL': 8550 }
	},
	{	name: "vrc_pt_2024_isola_csp",
		redline: {'ALL': 8625 }
	},
	//PT 2023 Pageau 9T8
	{	name: "vrc_pt_2023_pageau_98",
		redline: {'ALL': 8200 }
	},
	{	name: "vrc_pt_2023_pageau_98_csp",
		redline: {'ALL': 8300 }
	},
	//ARC TA2 Chevrette
	{	name: "vrc_arc_ta2_chevrette",
		redline: {'ALL': 6500 }
	},
	{	name: "vrc_arc_ta2_chevrette_csp",
		redline: {'ALL': 6500 }
	},
	//ARC TA2 Dagger
	{	name: "vrc_arc_ta2_dagger",
		redline: {'ALL': 6500 }
	},
	{	name: "vrc_arc_ta2_dagger_csp",
		redline: {'ALL': 6500 }
	},
	//ARC TA2 Mare
	{	name: "vrc_arc_ta2_mare",
		redline: {'ALL': 6500 }
	},
	{	name: "vrc_arc_ta2_mare_csp",
		redline: {'ALL': 6500 }
	},
	//Formula Alpha 2007 F07
	{	name: "vrc_formula_alpha_2007_f07",
		redline: {'ALL': 18700 }
	},
	//Formula Alpha 2022
	{	name: "vrc_formula_alpha_2022",
		redline: {'ALL': 12000 }
	},
	//Formula Alpha 2023
	{	name: "vrc_formula_alpha_2023",
		redline: {'ALL': 12000 }
	},
	{	name: "vrc_formula_alpha_2023_csp",
		redline: {'ALL': 11500 }
	},
	//Formula Alpha 2024
	{	name: "vrc_formula_alpha_2024",
		redline: {'ALL': 12000 }
	},
	{	name: "vrc_formula_alpha_2024_csp",
		redline: {'ALL': 11500 }
	},
	//Formula Beta 2008
	{	name: "vrc_formula_beta_2008",
		redline: {'ALL': 9800 }
	},
	//Formula Beta 2024
	{	name: "vrc_formula_beta_2024",
		redline: {'ALL': 8600 }
	},
	{	name: "vrc_formula_beta_2024_csp",
		redline: {'ALL': 8450 }
	},
	//1997 Ferrari F310B
	{	name: "vrc_1997_ferrari_f310b",
		redline: {'ALL': 17000 }
	},
	//2005 McLaren MP420
	{	name: "vrc_2005_mclaren_mp420",
		redline: {'ALL': 18600 }
	},
	//Formula Alpha 2007 MC22
	{	name: "vrc_formula_alpha_2007_mc22",
		redline: {'ALL': 18600 }
	},
	//2005 Renault R25
	{	name: "vrc_2005_renault_r25",
		redline: {'ALL': 18200 }
	},
	//Renault G 2024 Mark I
	{	name: "vrc_formula_g_2024",
		redline: {'ALL': 19500 }
	},
	//2015 Williams FW37
	{	name: "vrc_2015_williams_fw37",
		redline: {'ALL': 11500 }
	},
	//Williams-Toyota FW31
	{	name: "vrc_2009_williams_fw31",
		redline: {'ALL': 17800 }
	},
	{	name: "vrc_2009_williams_fw31_s1",
		redline: {'ALL': 17800 }
	},
	//Formula NA 2012
	{	name: "vrc_formula_na_2012_road",
		redline: {'ALL': 11700 }
	},
	{	name: "vrc_formula_na_2012_oval",
		redline: {'ALL': 11700 }
	},
	//Formula NA 2018
	{	name: "vrc_formula_na_2018_road",
		redline: {'ALL': 11700 }
	},
	{	name: "vrc_formula_na_2018_oval",
		redline: {'ALL': 11700 }
	},
	{	name: "vrc_formula_na_2018_short",
		redline: {'ALL': 11700 }
	},
	//Formula NA 2021
	{	name: "vrc_formula_na_2021_road",
		redline: {'ALL': 11500 }
	},
	{	name: "vrc_formula_na_2021_oval",
		redline: {'ALL': 11500 }
	},
	{	name: "vrc_formula_na_2021_short",
		redline: {'ALL': 11500 }
	},
	//ERC 1998 Alfio Romani
	{	name: "vrc_erc_1998_alfio",
		redline: {'ALL': 8300 }
	},
	{	name: "vrc_erc_1998_alfio_csp",
		redline: {'ALL': 8000 }
	},
	//ERC 1998 Pageau
	{	name: "vrc_erc_1998_pageau",
		redline: {'ALL': 8400 }
	},
	{	name: "vrc_erc_1998_pageau_csp",
		redline: {'ALL': 8400 }
	},
	//ERC 1999 Renoir
	{	name: "vrc_erc_1999_renoir",
		redline: {'ALL': 8400 }
	},
	{	name: "vrc_erc_1999_renoir_csp",
		redline: {'ALL': 8400 }
	},
	//ERC 1999 Vorax
	{	name: "vrc_erc_1999_vorax",
		redline: {'ALL': 8400 }
	},
	{	name: "vrc_erc_1999_vorax_csp",
		redline: {'ALL': 8400 }
	},
	
	//URD
	//Michigan EGT/GTD
	{	name: "urd_michigan_egt",
		redline: {'ALL': 7300 }
	},
	{	name: "urd_michigan_gtd",
		redline: {'ALL': 7300 }
	},
	//AMR EGT 2019
	{	name: "urd_amr_egt_2019",
		redline: {'ALL': 6700 }
	},
	{	name: "urd_amr_egt_2019_v2",
		redline: {'ALL': 6750 }
	},
	//Bayro EGT 2018
	{	name: "urd_bayro_egt_2018",
		redline: {'ALL': 6400 }
	},
	//Detroit EGT 2018/2019
	{	name: "urd_detroit_egt_2018",
		redline: {'ALL': 7200 }
	},
	{	name: "urd_detroit_egt_2018_lm",
		redline: {'ALL': 7200 }
	},
	{	name: "urd_detroit_egt_2019",
		redline: {'ALL': 7200 }
	},
	//Darche EGT 2020/2021
	{	name: "urd_darche_egt_2020",
		redline: {'ALL': 8400 }
	},
	{	name: "urd_darche_egt_2020_sprint",
		redline: {'ALL': 8400 }
	},
	{	name: "urd_darche_egt_2021",
		redline: {'ALL': 8400 }
	},
	{	name: "urd_darche_egt_2021_sprint",
		redline: {'ALL': 8400 }
	},
	//Ferrucci 448T EGT 2018
	{	name: "urd_ferrucci_448t_egt",
		redline: {'ALL': 6750 }
	},
	//T5 Aura 2018
	{	name: "urd_t5_aura_2018",
		redline: {'ALL': 7800 }
	},
	//T5 Maures 2018
	{	name: "urd_t5_maures_2018",
		redline: {'ALL': 7800 }
	},
	//T5 Bayro 2018
	{	name: "urd_t5_bayro_2018",
		redline: {'ALL': 8300 }
	},
	//Bayro 4
	{	name: "urd_bayro_gt3_v2",
		redline: {'ALL': 6800 }
	},
	//Darche 992 2023
	{	name: "urd_darche_992_23",
		redline: {'ALL': 9000 }
	},
	//Ferrucci 296 2023
	{	name: "urd_ferrucci_296_23",
		redline: {'ALL': 7200 }
	},
	//Rekus RC-F
	{	name: "urd_rekus_rcf_gt3",
		redline: {'ALL': 6750 }
	},
	//Arthur Merlin Valor EVO
	{	name: "urd_amr_gt3_evo",
		redline: {'ALL': 6750 }
	},
	//Dallas VSR Hybrid
	{	name: "urd_dallas_vsr_hybrid",
		redline: {'ALL': 8400 }
	},
	//SCG 007 LMH
	{	name: "urd_scg007_lmh",
		redline: {'ALL': 7200 }
	},
	//Moyoda GR010 Hyper
	{	name: "urd_gr010",
		redline: {'ALL': 7500 }
	},
	//JT5 Shiro 2016
	{	name: "urd_jt5_2016_shiro_r1",
		redline: {'ALL': 7460 }
	},
	{	name: "urd_jt5_2016_shiro_r2",
		redline: {'ALL': 7460 }
	},
	{	name: "urd_jt5_2016_shiro_r3",
		redline: {'ALL': 7460 }
	},
	//JT5 SNX 2021
	{	name: "urd_jt5_snx_2021",
		redline: {'ALL': 8600 }
	},
	//JT5 Shiro 2021
	{	name: "urd_jt5_shiro_2021",
		redline: {'ALL': 8600 }
	},
	//JT5 Moyoda 2021
	{	name: "urd_jt5_moyoda_2021",
		redline: {'ALL': 8600 }
	},
	//JT5 Shiro 2022
	{	name: "urd_jt5_shiro_2022",
		redline: {'ALL': 8600 }
	},
	//Maures LCK EGT1
	{	name: "urd_maures_gtr_97",
		redline: {'ALL': 6900 }
	},
	//Radical SR10 XXR 2023
	{	name: "urd_radical_sr10xxr_2023",
		redline: {'ALL': 6900 }
	},
	//Radical SR3 XXR 2023
	{	name: "urd_radical_sr3xxr_2023",
		redline: {'ALL': 10000 }
	},
	//Darche Cup 2021
	{	name: "urd_darche_cup_2021",
		redline: {'ALL': 8300 }
	},
	//Mercedes-Benz CLR LM
	{	name: "urd_mercedes_clr_lm",
		redline: {'ALL': 6800 }
	},
	//Oreca 07 Gibson 2021
	{	name: "urd_loire07_21",
		redline: {'ALL': 8500 }
	}
];

const dnr_ACRedlines_generic = [
	//ARC Chevrette 28
	{	name: "vrc_arc_chevrette28",
		redline: {'ALL': 7500 }
	},
	//1991 Jordan 191
	{	name: "vrc_1991_jordan_191",
		redline: {'ALL': 12600 }
	},
	//ERC 1999 Fortix
	{	name: "vrc_erc_1999_fortix",
		redline: {'ALL': 8000 }
	},
	{	name: "vrc_erc_1999_fortix_csp",
		redline: {'ALL': 8000 }
	},
	//ERC 1999 Gojira
	{	name: "vrc_erc_1999_gojira",
		redline: {'ALL': 8000 }
	},
	{	name: "vrc_erc_1999_gojira_csp",
		redline: {'ALL': 8000 }
	},
	//ERC 1994 Vokker
	{	name: "vrc_erc_1994_vokker",
		redline: {'ALL': 8000 }
	},
	{	name: "vrc_erc_1994_vokker_csp",
		redline: {'ALL': 8000 }
	},
	//Formula Williams-Renault FW19
	{	name: "vrc_1997_williams_fw19",
		redline: {'ALL': 16800 }
	}
];


const dnr_ACCRedlines = [
	//GT2
	{	name: "Audi R8 LMS GT2 2021",
		redline: {'ALL': 8400 }
	},
	{	name: "KTM Xbow GT2 2021",
		redline: {'ALL': 7100 }
	},
	{	name: "Maserati GT2 2023",
		redline: {'ALL': 7650 }
	},
	{	name: "Mercedes AMG GT2 2023",
		redline: {'ALL': 7000 }
	},
	{	name: "Porsche 935 2019",
		redline: {'ALL': 6900 }
	},
	{	name: "Porsche 991 II GT2 RS CS EVO 2023",
		redline: {'ALL': 6900 }
	},
	//GT3
	{	name: "Aston Martin Vantage V12 GT3 2013",
		redline: {'ALL': 7600 }
	},
	{	name: "Aston Martin V8 Vantage GT3 2019",
		redline: {'ALL': 7100 }
	},
	{	name: "Audi R8 LMS 2015",
		redline: {'ALL': 8000 }
	},
	{	name: "Audi R8 LMS Evo 2019",
		redline: {'ALL': 8000 }
	},
	{	name: "Audi R8 LMS Evo II 2022",
		redline: {'ALL': 8000 }
	},
	{	name: "Bentley Continental GT3 2015",
		redline: {'ALL': 7100 }
	},
	{	name: "Bentley Continental GT3 2018",
		redline: {'ALL': 7000 }
	},
	{	name: "BMW M4 GT3 2021",
		redline: {'ALL': 6750 }
	},
	{	name: "BMW M6 GT3 2017",
		redline: {'ALL': 6350 }
	},
	{	name: "Emil Frey Jaguar G3 2021",
		redline: {'ALL': 8100 }
	},
	{	name: "Ferrari 296 GT3 2023",
		redline: {'ALL': 7100 }
	},
	{	name: "Ferrari 488 GT3 2018",
		redline: {'ALL': 7250 }
	},
	{	name: "Ferrari 488 GT3 Evo 2020",
		redline: {'ALL': 7250 }
	},
	{	name: "Ford Mustang GT3 2024",
		redline: {'ALL': 7900 }
	},
	{	name: "Honda NSX GT3 2017",
		redline: {'ALL': 7200 }
	},
	{	name: "Honda NSX GT3 Evo 2019",
		redline: {'ALL': 7200 }
	},
	{	name: "Lamborghini Huracán GT3 2015",
		redline: {'ALL': 8000 }
	},
	{	name: "Lamborghini Huracán GT3 Evo 2019",
		redline: {'ALL': 8000 }
	},
	{	name: "Lamborghini Huracán GT3 Evo2 2023",
		redline: {'ALL': 8000 }
	},
	{	name: "Lexus RCF GT3 2016",
		redline: {'ALL': 7250 }
	},
	{	name: "McLaren 650S GT3 2015",
		redline: {}
	},
	{	name: "McLaren 720S GT3 2019",
		redline: {'ALL': 7500 }
	},
	{	name: "McLaren 720s GT3 Evo 2023",
		redline: {'ALL': 7200 }
	},
	{	name: "Mercedes AMG GT3 2015",
		redline: {'ALL': 7100 }
	},
	{	name: "Mercedes AMG GT3 Evo 2020",
		redline: {'ALL': 7150 }
	},
	{	name: "Nissan GT R Nismo GT3 2015",
		redline: {'ALL': 7200 }
	},
	{	name: "Nissan GT R Nismo GT3 2018",
		redline: {'ALL': 6800 }
	},
	{	name: "Porsche 911 GT3 R 2018",
		redline: {'ALL': 9000 }
	},
	{	name: "Porsche 911 II GT3 R 2019",
		redline: {'ALL': 8700 }
	},
	{	name: "Porsche 992 GT3 R 2023",
		redline: {'ALL': 8900 }
	},
	{	name: "Lamborghini Gallardo G3 Reiter 2017",
		redline: {}
	},
	//GT4
	{	name: "Alpine A110 GT4 2018",
		redline: {'ALL': 6400 }
	},
	{	name: "Aston Martin Vantage AMR GT4 2018",
		redline: {'ALL': 6900 }
	},
	{	name: "Audi R8 LMS GT4 2016",
		redline: {'ALL': 8500 }
	},
	{	name: "BMW M4 GT4 2018",
		redline: {'ALL': 7200 }
	},
	{	name: "Chevrolet Camaro GT4 R 2017",
		redline: {'ALL': 7000 }
	},
	{	name: "Ginetta G55 GT4 2012",
		redline: {'ALL': 6900 }
	},
	{	name: "KTM Xbow GT4 2016",
		redline: {'ALL': 6300 }
	},
	{	name: "Maserati Gran Turismo MC GT4 2016",
		redline: {'ALL': 6800 }
	},
	{	name: "McLaren 570s GT4 2016",
		redline: {'ALL': 7500 }
	},
	{	name: "Mercedes AMG GT4 2016",
		redline: {'ALL': 6700 }
	},
	{	name: "Porsche 718 Cayman GT4 MR 2019",
		redline: {'ALL': 7600 }
	},
	//Cup
	{	name: "Porsche 991 II GT3 Cup 2017",
		redline: {'ALL': 8300 }
	},
	{	name: "Porsche 992 GT3 Cup 2021",
		redline: {'ALL': 8300 }
	},
	//ST
	{	name: "Lamborghini Huracán ST 2015",
		redline: {'ALL': 7900 }
	},
	{	name: "Lamborghini Huracán ST Evo2 2021",
		redline: {'ALL': 8400 }
	},
	//CHL
	{	name: "Ferrari 488 Challenge Evo 2020",
		redline: {'ALL': 7800 }
	},
	//TCX
	{	name: "BMW M2 Cup 2020",
		redline: {'ALL': 7200 }
	},
];


const dnr_AMS2Redlines = [
	//Copa Montana
	{	name: "Copa Montana", redline: {} },
	//COPA Truck
	{	name: "Iveco Stralis", redline: {} },
	{	name: "MAN TGX", redline: {} },
	{	name: "Mercedes-Benz Actros", redline: {} },
	{	name: "Vulkan Truck", redline: {} },
	{	name: "Volkswagen Constellation", redline: {} },
	//Cadillac DPi-VR
	{	name: "Cadillac DPi-VR", redline: {"ALL": 7100} },
	//F3 Brasil
	{	name: "Dallara F301", redline: {} },
	{	name: "Dallara F309", redline: {} },
	//Formula Dirt
	{	name: "Formula Dirt", redline: {} },
	//Formula Inter MG-15
	{	name: "Formula Inter MG-15", redline: {} },
	//Formula Reiza
	...["Formula Reiza", "Formula Reiza - Low Downforce"].map(name => ({
		name, redline: {} })),
	//Formula Trainer Advanced
	{	name: "Formula Trainer Advanced", redline: {} },
	//Formula Ultimate
	...["Formula Ultimate Gen1", "Formula Ultimate Gen1 - Low Downforce"].map(name => ({
		name, redline: {} })),
	...["Formula Ultimate Gen2", "Formula Ultimate Gen2 - Low Downforce"].map(name => ({
		name, redline: {} })),
	//Formula USA 2023
	...["Formula USA 2023", "Formula USA 2023 - Speedway"].map(name => ({
		name, redline: {"ALL": 11665} })),
	//Formula USA Gen 3
	...["Lola B2K00 Ford-Cosworth", "Lola B2K00 Ford-Cosworth - Speedway"].map(name => ({
		name, redline: {} })),
	...["Lola B2K00 Mercedes-Benz", "Lola B2K00 Mercedes-Benz - Speedway"].map(name => ({
		name, redline: {} })),
	...["Lola B2K00 Toyota", "Lola B2K00 Toyota - Speedway"].map(name => ({
		name, redline: {} })),
	...["Reynard 2Ki Ford-Cosworth", "Reynard 2Ki Ford-Cosworth - Speedway"].map(name => ({
		name, redline: {} })),
	...["Reynard 2Ki Honda", "Reynard 2Ki Honda - Speedway"].map(name => ({
		name, redline: {} })),
	...["Reynard 2Ki Mercedes-Benz", "Reynard 2Ki Mercedes-Benz - Speedway"].map(name => ({
		name, redline: {} })),
	...["Reynard 2Ki Toyota", "Reynard 2Ki Toyota - Speedway"].map(name => ({
		name, redline: {} })),
	//McLaren Mercedes MP4/12
	{	name: "McLaren Mercedes MP4/12", redline: {} },
	//Formula V10 Gen 2
	...["Formula V10 Gen2", "Formula V10 Gen2 - Low Downforce"].map(name => ({
		name, redline: {} })),
	//Formula Vee Gen2
	{	name: "Formula Vee Gen2", redline: {} },
	//Ginetta G40 Cup
	{	name: "Ginetta G40 Cup", redline: {} },
	//Ginetta G55 GT4 Supercup
	{	name: "Ginetta G55 GT4 Supercup", redline: {"ALL": 6695} },
	//GT Open
	{	name: "Ginetta G55 GT3", redline: {} },
	{	name: "Ultima GTR Race", redline: {} },
	//GT1
	...["McLaren F1 GTR", "McLaren F1 GTR - Low Downforce"].map(name => ({
		name, redline: {} })),
	...["Mercedes-Benz CLK LM", "Mercedes-Benz CLK LM - Low Downforce"].map(name => ({
		name, redline: {"ALL": 8670} })),
	...["Porsche 911 GT1-98", "Porsche 911 GT1-98 - Low Downforce"].map(name => ({
		name, redline: {"ALL": 7800} })),
	//GT3 Gen 1
	{	name: "Audi R8 LMS GT3", redline: {"ALL": 8150} },
	{	name: "BMW M6 GT3", redline: {"ALL": 6775} },
	{	name: "McLaren 720S GT3", redline: {"ALL": 7800} },
	{	name: "Mercedes-AMG GT3", redline: {"ALL": 7150} },
	{	name: "Nissan GT-R Nismo GT3", redline: {} },
	//GT3 Gen 2
	...["Aston Martin Vantage GT3 Evo", "Aston Martin Vantage GT3 Evo - Low Downforce"].map(name => ({
		name, redline: {"ALL": 6700} })),
	...["Audi R8 LMS GT3 evo II", "Audi R8 LMS GT3 evo II - Low Downforce"].map(name => ({
		name, redline: {"ALL": 8150} })),
	...["BMW M4 GT3", "BMW M4 GT3 - Low Downforce"].map(name => ({
		name, redline: {"ALL": 6800} })),
	...["Chevrolet Corvette Z06 GT3.R", "Chevrolet Corvette Z06 GT3.R - Low Downforce"].map(name => ({
		name, redline: {"ALL": 7900} })),
	...["Lamborghini Huracan GT3 EVO2", "Lamborghini Huracan GT3 EVO2 - Low Downforce"].map(name => ({
		name, redline: {"ALL": 8150} })),
	...["McLaren 720S GT3 Evo", "McLaren 720S GT3 Evo - Low Downforce"].map(name => ({
		name, redline: {"ALL": 7600} })),
	...["Mercedes-AMG GT3 Evo", "Mercedes-AMG GT3 Evo - Low Downforce"].map(name => ({
		name, redline: {"ALL": 6987} })),
	...["Porsche 992 GT3 R", "Porsche 992 GT3 R - Low Downforce"].map(name => ({
		name, redline: {"ALL": 9180} })),
	//GT4
	{	name: "Alpine A110 GT4 Evo", redline: {"ALL": 7000} },
	{	name: "Aston Martin Vantage GT4 Evo", redline: {"ALL": 6800} },
	{	name: "Audi R8 LMS GT4", redline: {} },
	{	name: "BMW M4 GT4", redline: {} },
	{	name: "Chevrolet Camaro GT4.R", redline: {} },
	{	name: "Ginetta G55 GT4", redline: {"ALL": 6800} },
	{	name: "McLaren 570S GT4", redline: {} },
	{	name: "Mercedes-AMG GT4", redline: {"ALL": 6435} },
	//GT5
	{	name: "Ginetta G40", redline: {} },
	{	name: "Puma P052", redline: {} },
	//GTE
	...["Aston Martin Vantage GTE", "Aston Martin Vantage GTE - Low Downforce"].map(name => ({
		name, redline: {"ALL": 6750} })),
	...["BMW M8 GTE", "BMW M8 GTE - Low Downforce"].map(name => ({
		name, redline: {"ALL": 6630} })),
	...["Chevrolet Corvette C8.R", "Chevrolet Corvette C8.R - Low Downforce"].map(name => ({
		name, redline: {} })),
	...["Porsche 911 RSR GTE", "Porsche 911 RSR GTE - Low Downforce"].map(name => ({
		name, redline: {"ALL": 9300} })),
	//Hypercars
	{	name: "Brabham BT62", redline: {} },
	{	name: "Lamborghini Veneno Roadster", redline: {"ALL": 8350} },
	//Karting
	{	name: "Kart 2-Stroke 125cc Direct", redline: {} },
	{	name: "Kart 4-Stroke Race", redline: {} },
	{	name: "Kart 2-Stroke 125cc Shifter", redline: {} },
	{	name: "Kart Cross", redline: {} },
	//Mitsubishi Lancer
	{	name: "Mitsubishi Lancer R", redline: {} },
	{	name: "Mitsubishi Lancer RS", redline: {} },
	//Ligier European Series
	...["Ligier JS P4", "Ligier JS2 R"].map(name => ({
		name, redline: {} })),
	//LMDh
	...["Alpine A424", "Alpine A424 - Low Downforce"].map(name => ({
		name, redline: {} })),
	...["Aston Martin Valkyrie Hypercar", "Aston Martin Valkyrie Hypercar - Low Downforce"].map(name => ({
		name, redline: {"ALL": 8200} })),
	...["BMW M Hybrid V8", "BMW M Hybrid V8 - Low Downforce"].map(name => ({
		name, redline: {"ALL": 7850} })),
	...["Cadillac V-Series.R", "Cadillac V-Series.R - Low Downforce"].map(name => ({
		name, redline: {"ALL": 8650} })),
	...["Lamborghini SC63", "Lamborghini SC63 - Low Downforce"].map(name => ({
		name, redline: {"ALL": 8000} })),
	...["Porsche 963", "Porsche 963 - Low Downforce"].map(name => ({
		name, redline: {"ALL": 7750} })),
	//LMP2 Gen 1 & Gen 2
	...["Ligier JS P217", "Ligier JS P217 - Low Downforce"].map(name => ({
		name, redline: {} })),
	...["Oreca 07", "Oreca 07 - Low Downforce"].map(name => ({
		name, redline: {"ALL": 8400} })),
	//MINI JCW UK
	{	name: "MINI Cooper JCW", redline: {} },
	//P1 Gen 1
	{	name: "Ginetta G58", redline: {"ALL": 6695} },
	{	name: "MetalMoro AJR Chevrolet", redline: {"ALL": 6258} },
	{	name: "MetalMoro AJR Honda", redline: {"ALL": 7095} },
	{	name: "MetalMoro AJR Judd", redline: {"ALL": 10645} },
	{	name: "MetalMoro AJR Nissan", redline: {"ALL": 7195} },
	//P1 Gen 2
	{	name: "Ginetta G58 Gen2", redline: {"ALL": 6695} },
	{	name: "Ligier JS P320", redline: {"ALL": 6600} },
	{	name: "MetalMoro AJR Gen2 Chevrolet", redline: {"ALL": 6258} },
	{	name: "MetalMoro AJR Gen2 Honda", redline: {"ALL": 7095} },
	{	name: "MetalMoro AJR Gen2 Nissan", redline: {"ALL": 7094} },
	{	name: "Sigma P1 G5", redline: {"ALL": 6188} },
	//P2
	{	name: "MetalMoro MRX Duratec Turbo P2", redline: {} },
	{	name: "Sigma P1", redline: {} },
	//P3
	{	name: "MetalMoro MRX Honda P3", redline: {} },
	{	name: "MetalMoro MRX Duratec Turbo P3", redline: {} },
	{	name: "Roco 001", redline: {} },
	//P4
	{	name: "MCR S2000", redline: {} },
	//Porsche Carrera Cup
	...["Porsche 911 GT3 Cup 3.8", "Porsche 911 GT3 Cup 4.0"].map(name => ({
		name, redline: {"ALL": 8228} })),
	//RX
	{	name: "Citroen DS3 RX", redline: {"ALL": 7615} },
	{	name: "MINI Countryman R60 RX", redline: {} },
	{	name: "Mitsubishi Lancer Evo10 RX", redline: {} },
	//Sprint Race
	{	name: "Sprint Race", redline: {} },
	//Stock Car
	...[	"Chevrolet Cruze Stock Car 2019",
		"Chevrolet Cruze Stock Car 2020", "Toyota Corolla Stock Car 2020",
		"Chevrolet Cruze Stock Car 2021", "Toyota Corolla Stock Car 2021",
		"Chevrolet Cruze Stock Car 2022", "Toyota Corolla Stock Car 2022",
		"Chevrolet Cruze Stock Car 2023", "Toyota Corolla Stock Car 2023",
		"Chevrolet Cruze Stock Car 2024", "Toyota Corolla Stock Car 2024"
	].map(name => ({ name, redline: {} })),
	//Super Trophy Trucks
	{	name: "Super Trophy Trucks", redline: {} },
	//Super Trofeo
	...["Lamborghini Huracan Super Trofeo EVO2", "Lamborghini Huracan Super Trofeo EVO2 - Low Downforce"].map(name => ({
		name, redline: {} })),
	//SuperKart
	{	name: "Superkart 250cc", redline: {} }
];


const dnr_EAWRCRedlines = [
	//WRC
	{	name: "Ford Puma Rally1 HYBRID",
		carid: "103",
		redline: {'ALL': 7700 }
	},
	{	name: "Ford Puma Rally1 HYBRID",
		carid: "124",
		redline: {'ALL': 7950 }
	},
	{	name: "Hyundai i20 N Rally1 HYBRID",
		carid: "104",
		redline: {'ALL': 7950 }
	},
	{	name: "Hyundai i20 N Rally1 HYBRID",
		carid: "125",
		redline: {'ALL': 7950 }
	},
	{	name: "Toyota GR Yaris Rally1 HYBRID",
		carid: "105",
		redline: {'ALL': 7950 }
	},
	{	name: "Toyota GR Yaris Rally1 HYBRID",
		carid: "126",
		redline: {'ALL': 7950 }
	},
	//WRC2
	{	name: "Citroën C3 Rally2",
		carid: "4",
		redline: {'ALL': 6950 }
	},
	{	name: "Ford Fiesta Rally2",
		carid: "5",
		redline: {'ALL': 6950 }
	},
	{	name: "Toyota GR Yaris Rally2",
		carid: "120",
		redline: {'ALL': 6950 }
	},
	{	name: "Volkswagen Polo GTI R5",
		carid: "9",
		redline: {'ALL': 6950 }
	},
	//FIA Junior WRC
	{	name: "Ford Fiesta Rally3",
		carid: "106",
		redline: {'ALL': 7000 }
	},
	{	name: "Ford Fiesta Rally3 Evo",
		carid: "121",
		redline: {'ALL': 7000 }
	},
	//World Rally Car 2017-2021
	{	name: "Citroën C3 WRC",
		carid: "130",
		redline: {'ALL': 7450 }
	},
	{	name: "Hyundai i20 Coupe WRC '21",
		carid: "139",
		redline: {'ALL': 7835 }
	},
	{	name: "Volkswagen Polo 2017",
		carid: "95",
		redline: {'ALL': 7925 }
	},
	//World Rally Car 2012-2016
	{	name: "MINI John Cooper Works WRC",
		carid: "134",
		redline: {'ALL': 7910 }
	},
	{	name: "Volkswagen Polo R WRC 2013",
		carid: "133",
		redline: {'ALL': 7925 }
	},
	//World Rally Car 1997-2011
	{	name: "Citroën Xsara WRC",
		carid: "13",
		redline: {'ALL': 6000 }
	},
	{	name: "Citroën C4 WRC",
		carid: "12",
		redline: {'ALL': 6875 }
	},
	{	name: "Ford Focus RS Rally 2001",
		carid: "14",
		redline: {'ALL': 6700 }
	},
	{	name: "Mitsubishi Lancer Evolution VI",
		carid: "24",
		redline: {'ALL': 6250 }
	},
	{	name: "Ford Focus RS Rally 2008",
		carid: "15",
		redline: {'ALL': 6825 }
	},
	{	name: "MINI Countryman Rally Edition",
		carid: "86",
		redline: {'ALL': 7910 }
	},
	{	name: "Peugeot 206 Rally",
		carid: "16",
		redline: {'ALL': 6000 }
	},
	{	name: "SEAT Córdoba WRC",
		carid: "21",
		redline: {'ALL': 6950 }
	},
	{	name: "ŠKODA Fabia WRC",
		carid: "17",
		redline: {'ALL': 7150 }
	},
	{	name: "SUBARU Impreza 2001",
		carid: "18",
		redline: {'ALL': 7450 }
	},
	{	name: "SUBARU Impreza 2008",
		carid: "20",
		redline: {'ALL': 6590 }
	},
	//Rally 2
	{	name: "Ford Fiesta R5 MK7 Evo 2",
		carid: "112",
		redline: {'ALL': 6875 }
	},
	{	name: "Peugeot 208 T16 R5",
		carid: "85",
		redline: {'ALL': 6950 }
	},
	{	name: "Volkswagen Polo GTI R5",
		carid: "116",
		redline: {'ALL': 6950 }
	},
	//Rally 3
	{	name: "Ford Fiesta Rally3",
		carid: "123",
		redline: {'ALL': 7000 }
	},
	{	name: "Renault Clio Rally3",
		carid: "122",
		redline: {'ALL': 6825 }
	},
	//Rally 4
	{	name: "Citroën C2 R2 Max",
		carid: "128",
		redline: {'ALL': 8122 }
	},
	{	name: "Ford Fiesta MK8 Rally4",
		carid: "45",
		redline: {'ALL': 6965 }
	},
	{	name: "Opel Adam R2",
		carid: "45",
		redline: {'ALL': 8075 }
	},
	{	name: "Opel Corsa Rally4",
		carid: "135",
		redline: {'ALL': 6000 }
	},
	{	name: "Peugeot 208 Rally4",
		carid: "7",
		redline: {'ALL': 6225 }
	},
	{	name: "Renault Clio Rally4",
		carid: "137",
		redline: {'ALL': 6000 }
	},
	{	name: "Renault Twingo II",
		carid: "48",
		redline: {'ALL': 6950 }
	},
	//NR4 R4
	{	name: "Mitsubishi Lancer Evolution X",
		carid: "60",
		redline: {'ALL': 6030 }
	},
	{	name: "McRae R4",
		carid: "62",
		redline: {'ALL': 8865 }
	},
	{	name: "SUBARU WRX STI NR4",
		carid: "61",
		redline: {'ALL': 6765 }
	},
	//S2000
	{	name: "Opel Corsa S2000",
		carid: "87",
		redline: {'ALL': 8200 }
	},
	{	name: "Peugeot 207 S2000",
		carid: "36",
		redline: {'ALL': 7915 }
	},
	//S1600
	{	name: "Ford Puma S1600",
		carid: "43",
		redline: {'ALL': 8070 }
	},
	{	name: "Peugeot 206 S1600",
		carid: "136",
		redline: {'ALL': 8475 }
	},
	{	name: "Renault Clio S1600",
		carid: "42",
		redline: {'ALL': 8860 }
	},
	//F2 Kit Car
	{	name: "Citroën Xsara Kit Car",
		carid: "129",
		redline: {'ALL': 9075 }
	},
	{	name: "Renault Maxi Mégane",
		carid: "34",
		redline: {'ALL': 8360 }
	},
	{	name: "SEAT Ibiza Kit Car",
		carid: "31",
		redline: {'ALL': 8365 }
	},
	{	name: "Vauxhall Astra Rally Car",
		carid: "32",
		redline: {'ALL': 8173 }
	},
	{	name: "Volkswagen Golf IV Kit Car",
		carid: "30",
		redline: {'ALL': 8360 }
	},
	//Group A
	{	name: "Ford Escort RS Cosworth",
		carid: "22",
		redline: {'ALL': 6706 }
	},
	{	name: "Mitsubishi Galant VR4",
		carid: "83",
		redline: {'ALL': 7400 }
	},
	//H3 RWD
	{	name: "Ford Escort MK2 McRae Motorsport",
		carid: "94",
		redline: {'ALL': 8150 }
	},
	//H2 RWD
	{	name: "Fiat 131 Abarth Rally",
		carid: "71",
		redline: {'ALL': 7852 }
	},
	{	name: "Opel Kadett C GT/E",
		carid: "73",
		redline: {'ALL': 8375 }
	},
	//H2 FWD
	{	name: "Volkswagen Golf GTI",
		carid: "79",
		redline: {'ALL': 6636 }
	},
];

const dnr_EAWRCRedlines_generic = [
	//WRC2
	{	name: "Hyundai i20 N Rally2",
		carid: "99",
		redline: {'ALL': 6925 }
	},
	{	name: "ŠKODA Fabia RS Rally2",
		carid: "107",
		redline: {'ALL': 6950 }
	},
	{	name: "ŠKODA Fabia Rally2 Evo",
		carid: "8",
		redline: {'ALL': 6950 }
	},
	//World Rally Car 2017-2021
	{	name: "Ford Fiesta WRC",
		carid: "118",
		redline: {'ALL': 7700 }
	},
	//Rally 2
	{	name: "ŠKODA Fabia Rally2 Evo",
		carid: "117",
		redline: {'ALL': 6950 }
	},
	{	name: "ŠKODA Fabia RS Rally2",
		carid: "119",
		redline: {'ALL': 6950 }
	},
	//S2000
	{	name: "Fiat Grande Punto Abarth S2000",
		carid: "35",
		redline: {'ALL': 8010 }
	},
	//F2 Kit Car
	{	name: "Peugeot 306 Maxi",
		carid: "29",
		redline: {'ALL': 10290 }
	},
	//Group A
	{	name: "Lancia Delta HF Integrale",
		carid: "23",
		redline: {'ALL': 6925 }
	},
	{	name: "SUBARU Legacy RS",
		carid: "26",
		redline: {'ALL': 7025 }
	},
	//Group B 4WD
	{	name: "Audi Sport quattro S1 (E2)",
		carid: "50",
		redline: {'ALL': 8000 }
	},
	{	name: "Ford RS200",
		carid: "51",
		redline: {'ALL': 8500 }
	},
	{	name: "Lancia Delta S4",
		carid: "52",
		redline: {'ALL': 8000 }
	},
	{	name: "MG Metro 6R4",
		carid: "53",
		redline: {'ALL': 9250 }
	},
	{	name: "Peugeot 205 T16 Evo 2",
		carid: "54",
		redline: {'ALL': 8000 }
	},
	//Group B RWD
	{	name: "BMW M1 Procar Rally",
		carid: "55",
		redline: {'ALL': 8615 }
	},
	{	name: "Lancia 037 Evo 2",
		carid: "57",
		redline: {'ALL': 7890 }
	},
	{	name: "Opel Manta 400",
		carid: "58",
		redline: {'ALL': 7300 }
	},
	{	name: "Porsche 911 SC RS",
		carid: "59",
		redline: {'ALL': 7500 }
	},
	//H3 RWD
	{	name: "BMW M3 Evo Rally",
		carid: "63",
		redline: {'ALL': 8400 }
	},
	{	name: "Ford Sierra Cosworth RS500",
		carid: "65",
		redline: {'ALL': 7000 }
	},
	{	name: "Renault 5 Turbo",
		carid: "69",
		redline: {'ALL': 7500 }
	},
	{	name: "Lancia Stratos",
		carid: "64",
		redline: {'ALL': 8200 }
	},
	{	name: "Opel Ascona 400",
		carid: "68",
		redline: {'ALL': 7200 }
	},
	//H2 RWD
	{	name: "Alpine Renault A110 1600 S",
		carid: "75",
		redline: {'ALL': 7500 }
	},
	{	name: "Ford Escort RS 1600 MK1",
		carid: "131",
		redline: {'ALL': 7700 }
	},
	{	name: "Ford Escort MK2",
		carid: "70",
		redline: {'ALL': 9000 }
	},
	{	name: "Hillman Avenger",
		carid: "67",
		redline: {'ALL': 6963 }
	},
	{	name: "Talbot Sunbeam Lotus",
		carid: "74",
		redline: {'ALL': 7500 }
	},
	//H2 FWD
	{	name: "Peugeot 309 GTI",
		carid: "77",
		redline: {'ALL': 6500 }
	},
	{	name: "Peugeot 205 GTI",
		carid: "76",
		redline: {'ALL': 6468 }
	},
	//H1 FWD
	{	name: "Lancia Fulvia HF",
		carid: "81",
		redline: {'ALL': 6500 }
	},
	{	name: "MINI Cooper S",
		carid: "82",
		redline: {'ALL': 6915 }
	},
	{	name: "Vauxhall Nova Sport",
		carid: "78",
		redline: {'ALL': 6500 }
	},
];


const dnr_iRacingRedlines = [
	{	name: 'Acura ARX-06',
		redline: {'R': 9550, 'N': 9550, '1': 8550, '2': 9100, '3': 9300, '4': 9400, '5': 9455, '6': 9700, '7': 9700 }
	},
	{	name: 'Aston Martin DBR9 GT1',
		redline: {}
	},
	{	name: 'Aston Martin Vantage GT3 EVO',
		redline: {'R': 6750, 'N': 6750, '1': 6900, '2': 6900, '3': 6900, '4': 6850, '5': 6800, '6': 6900 }
	},
	{	name: 'Audi RS 3 LMS TCR',
		redline: {'ALL': 6700 }
	},
	{	name: 'BMW M2 CS Racing',
		redline: {}
	},
	{	name: 'BMW M Hybrid V8',
		redline: {'ALL': 7900 }
	},
	{	name: 'BMW M4 GT4',
		redline: {'R': 7100, 'N': 7100, '1': 7100, '2': 7100, '3': 7050, '4': 7050, '5': 7050, '6': 6950 }
	},
	{	name: 'BMW M4 G82 GT4 EVO',
		redline: {'ALL': 7000 }
	},
	{	name: 'BMW Z4 GT3',
		redline: {'ALL': 8800 }
	},
	{	name: 'Cadillac CTS-V Racecar',
		redline: {'ALL': 7400 }
	},
	{	name: 'Cadillac V-Series.R',
		redline: {'R': 5200, 'N': 5200, '1': 8250, '2': 8350, '3': 8500, '4': 8600, '5': 8680, '6': 8750, '7': 8775 }
	},
	{	name: 'Chevrolet Corvette C6R GT1',
		redline: {}
	},
	{	name: 'Corvette C7 Daytona Prototype',
		redline: {}
	},
	{	name: 'Chevrolet Corvette Z06 GT3.R',
		redline: {'ALL': 7675 }
	},
	{	name: 'Dallara DW-12',
		redline: {'ALL': 11650 }
	},
	{	name: 'Dallara F312 F3',
		redline: {}
	},
	{	name: 'Dallara IL15 Indy NXT',
		redline: {'R': 7670, 'N': 7670, '1': 7670, '2': 7670, '3': 7670, '4': 7670, '5': 7670, '6': 7750 }
	},
	{	name: 'Dallara IR01',
		redline: {'ALL': 20000 }
	},
	{	name: 'Dallara IR-05',
		redline: {'ALL': 10250 }
	},
	{	name: 'Dallara IR18',
		redline: {'ALL': 11650 }
	},
	{	name: 'Dallara P217 LMP2',
		redline: {}
	},
	{	name: 'Ferrari 488 GTE',
		redline: {'ALL': 6550 }
	},
	{	name: 'Ferrari 488 GT3',
		redline: {'ALL': 7100 }
	},
	{	name: 'Ferrari 488 GT3 Evo 2020',
		redline: {'ALL': 7200 }
	},
	{	name: 'Ferrari 296 GT3',
		redline: {'R': 7500, 'N': 7500, '1': 7360, '2': 7440, '3': 7420, '4': 7360, '5': 7350, '6': 7900 }
	},
	{	name: 'Ferrari 296 Challenge',
		redline: {'ALL': 8000 }
	},
	{	name: 'FIA F4',
		redline: {'ALL': 7000 }
	},
	{	name: 'Ford GT GT2',
		redline: {}
	},
	{	name: 'Ford GT GT3',
		redline: {}
	},
	{	name: 'Ford GT GTE',
		redline: {}
	},
	{	name: 'Ford Mustang FR500S',
		redline: {}
	},
	{	name: 'Ford Mustang GT3',
		redline: {'1': 8000, '2': 8000, '3': 8000, '4': 8000, '5': 8000, '6': 8250 }
	},
	{	name: 'Ford Mustang GT4',
		redline: {'1': 7300, '2': 7300, '3': 7300, '4': 7300, '5': 7300, '6': 7300 }
	},
	{	name: 'Formula Renault 2.0',
		redline: {}
	},
	{	name: 'Formula Renault 3.5',
		redline: {}
	},
	{	name: 'Formula Vee',
		redline: {}
	},
	{	name: 'Honda Civic Type R TCR',
		redline: {'ALL': 6700 }
	},
	{	name: 'Hyundai Elantra N TCR',
		redline: {}
	},
	{	name: 'Hyundai Veloster N TCR',
		redline: {}
	},
	{	name: 'Indy Pro 2000 PM-18',
		redline: {'ALL': 9000 }
	},
	{	name: 'Kia Optima',
		redline: {}
	},
	{	name: 'Ligier JS P320',
		redline: {'R': 5500, 'N': 3500, '1': 6675, '2': 6700, '3': 6810, '4': 6850, '5': 6920, '6': 6950 }
	},
	{	name: 'Lotus 49',
		redline: {'ALL': 9000 }
	},
	{	name: 'Lotus 79',
		redline: {'ALL': 10600 }
	},
	{	name: 'Lucas Oil Off-Road Racing Series Pro-2 Lite',
		redline: {}
	},
	{	name: 'Lucas Oil Off-Road Racing Series Pro-2',
		redline: {}
	},
	{	name: 'Lucas Oil Off-Road Racing Series Pro-4',
		redline: {}
	},
	{	name: 'Mazda MX-5 Cup',
		redline: {'ALL': 7400 }
	},
	{	name: 'Mazda MX-5 Roadster',
		redline: {}
	},
	{	name: 'Mclaren 570s GT4',
		redline: {}
	},
	{	name: 'NASCAR Ford Mustang',
		redline: {'ALL': 8850 }
	},
	{	name: 'NASCAR Chevrolet Camaro ZL1',
		redline: {'ALL': 8850 }
	},
	{	name: 'NASCAR Toyota Camry',
		redline: {'ALL': 8850 }
	},
	{	name: 'Porsche 718 Cayman GT4',
		redline: {'ALL': 7500 }
	},
	{	name: 'Porsche 911 GT3 Cup (991)',
		redline: {}
	},
	{	name: 'Porsche 911 GT3 R',
		redline: {}
	},
	{	name: 'Porsche 919 2016',
		redline: {'ALL': 8850 }
	},
	{	name: 'Porsche 963 GTP',
		redline: {'ALL': 8010 }
	},
	{	name: 'Pro Mazda',
		redline: {}
	},
	{	name: 'Radical SR8',
		redline: {}
	},
	{	name: 'Radical SR10',
		redline: {}
	},
	{	name: 'Ray Formula 1600',
		redline: {}
	},
	{	name: 'Riley Daytona Prototype',
		redline: {}
	},
	{	name: 'SCCA Spec Racer Ford',
		redline: {}
	},
	{	name: 'Skip Barber Formula 2000',
		redline: {'ALL': 6200 }
	},
	{	name: 'Stock Car Pro Chevrolet Cruze',
		redline: {}
	},
	{	name: 'Stock Car Pro Toyota Corolla',
		redline: {}
	},
	{	name: 'Subaru WRX STI',
		redline: {}
	},
	{	name: 'Super Formula Lights 324',
		redline: {}
	},
	{	name: 'Super Formula SF23 - Honda',
		redline: {'R': 8050, 'N': 8050, '1': 8940, '2': 8940, '3': 8970, '4': 9050, '5': 9070, '6': 9095 }
	},
	{	name: 'Super Formula SF23 - Toyota',
		redline: {'R': 8050, 'N': 8050, '1': 8940, '2': 8940, '3': 8970, '4': 9050, '5': 9070, '6': 9095 }
	},
	{	name: 'Supercars Ford Mustang GT',
		redline: {'ALL': 7250 }
	},
	{	name: 'Supercars Ford Mustang Gen3',
		redline: {'R': 6880, 'N': 6880, '1': 6880, '2': 7010, '3': 7140, '4': 7240, '5': 7320, '6': 7400 }
	},
	{	name: 'Supercars Chevrolet Camaro Gen3',
		redline: {'R': 6880, 'N': 6880, '1': 6880, '2': 7010, '3': 7140, '4': 7240, '5': 7320, '6': 7400 }
	},
	{	name: 'Toyota GR86',
		redline: {'ALL': 7250 }
	},
	{	name: 'USF2000',
		redline: {'ALL': 7000 }
	},
	{	name: 'VW Jetta TDI Cup',
		redline: {'ALL': 4500 }
	},
//More than 10 Leds Cars
	{	name: 'Acura NSX GT3 EVO 22',
		redline: {'R': 7270, 'N': 7270, '1': 7370, '2': 7370, '3': 7370, '4': 7370, '5': 7320, '6': 7450}
	},
	{	name: 'Aston Martin Vantage GT4',
		redline: {'R': 6700, 'N': 6700, '1': 6550, '2': 6600, '3': 6700, '4': 6750, '5': 6750, '6': 6750 }
	},
	{	name: 'Audi R18 2016',
		redline: {}
	},
	{	name: 'Audi R8 LMS',
		redline: {}
	},
	{	name: 'Audi R8 LMS EVO II GT3',
		redline: {'R': 8300, 'N': 8300, '1': 8300, '2': 8300, '3': 8200, '4': 8100, '5': 8050, '6': 8230 }
	},
	{	name: 'BMW M4 GT3 EVO',
		redline: {'R': 6600, 'N': 6600, '1': 6600, '2': 6700, '3': 6800, '4': 6850, '5': 6900, '6': 6950 }
	},
	{	name: 'BMW M8 GTE',
		redline: {'ALL': 6800 }
	},
	{	name: 'Chevrolet Corvette C8.R',
		redline: {'ALL': 6900 }
	},
	{	name: 'Ferrari 499P',
		redline: {'R': 7590, 'N': 7590, '1': 6780, '2': 7230, '3': 7400, '4': 7470, '5': 7520, '6': 7710, '7': 7900 }
	},
	{	name: 'HPD ARX-01c',
		redline: {'R': 9850, 'N': 5050, '1': 9850, '2': 9950, '3': 9505, '4': 9600, '5': 9450, '6': 10000 }
	},
	{	name: 'Lamborghini Huracan GT3 EVO',
		redline: {'ALL': 8000 }
	},
	{	name: 'McLaren 720S GT3 EVO',
		redline: {'R': 7530, 'N': 7530, '1': 7245, '2': 7040, '3': 6960, '4': 6888, '5': 6854, '6': 8010 }
	},
	{	name: 'Mclaren MP4-30',
		redline: {}
	},
	{	name: 'McLaren MP4-12C GT3',
		redline: {'R': 7100, 'N': 7100, '1': 7100, '2': 7100, '3': 7100, '4': 7100, '5': 7100, '6': 7400 }
	},
	{	name: 'Mercedes AMG GT3',
		redline: {'ALL': 6800 }
	},
	{	name: 'Mercedes-AMG GT3 2020',
		redline: {'R': 3500, 'N': 3500, '1': 7120, '2': 7000, '3': 7030, '4': 7070, '5': 7095, '6': 7600 }
	},
	{	name: 'Mercedes AMG GT4',
		redline: {'R': 3500, 'N': 3500, '1': 6300, '2': 6400, '3': 6590, '4': 6680, '5': 6720, '6': 6650 }
	},
	{	name: 'Mercedes W12',
		redline: {}
	},
	{	name: 'Mercedes-AMG W13 E Performance',
		redline: {}
	},
	{	name: 'Porsche 911 GT3 Cup (992)',
		redline: {'R': 8600, 'N': 8600, '1': 7900, '2': 8200, '3': 8400, '4': 8500, '5': 8600, '6': 9000 }
	},
	{	name: 'Porsche 911 GT3 R (992)',
		redline: {'R': 8600, 'N': 8600, '1': 8830, '2': 8825, '3': 8820, '4': 8785, '5': 8780, '6': 9200 }
	},
	{	name: 'Porsche 911 RSR',
		redline: {'ALL': 9000 }
	},
	{	name: 'Renault Clio R.S. V',
		redline: {}
	},
	{	name: 'Supercars Holden ZB Commodore',
		redline: {'ALL': 7250 }
	},
	{	name: 'Williams-Toyota FW31',
		redline: {}
	},
];

const dnr_iRacingRedlines_generic = [
	{	name: '87 Buick LeSabre',
		redline: {'ALL': 7600 }
	},
	{	name: '87 Chevy Monte Carlo',
		redline: {'ALL': 7600 }
	},
	{	name: '87 Ford Thunderbird',
		redline: {'ALL': 7600 }
	},
	{	name: '87 Pontiac Grand Prix',
		redline: {'ALL': 7600 }
	},
	{	name: 'Chevrolet National Impala',
		redline: {'ALL': 7300 }
	},
	{	name: 'Gen 4 Chevrolet Impala',
		redline: {'ALL': 9500 }
	},
	{	name: 'Late Model Stock',
		redline: {'ALL': 6400 }
	},
	{	name: 'Modified - SK',
		redline: {'ALL': 6800 }
	},
	{	name: 'Modified - Tour',
		redline: {'ALL': 8100 }
	},
	{	name: 'Street Stock',
		redline: {'ALL': 6500 }
	},
	{	name: 'Super Late Model',
		redline: {'ALL': 7350 }
	},
	{	name: 'Chevrolet Silverado',
		redline: {'ALL': 7300 }
	},
	{	name: 'Ford F150',
		redline: {'ALL': 7300 }
	},
	{	name: 'Toyota Tundra TRD Pro',
		redline: {'ALL': 7300 }
	},
	{	name: 'Superstar Racing Experience',
		redline: {'ALL': 7000 }
	},
	{	name: 'Chevrolet Camaro Class B',
		redline: {'ALL': 8400 }
	},
	{	name: 'Ford Mustang Class B',
		redline: {'ALL': 8400 }
	},
	{	name: 'Toyota Supra Class B',
		redline: {'ALL': 8400 }
	},
];


const dnr_LMURedlines = [
	// HYPERCAR
	// Alpine A424
	...["Alpine Endurance Team 2024",
		"Alpine Endurance Team 2025",
		"Alpine Custom Team 2024", "Alpine Custom Team 2025"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 8750}
	})),
	// Aston Martin Valkyrie LMH
	...["Aston Martin THOR Team 2025",
		"AM Valkyrie Custom Team 2025"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 8160}
	})),
	// BMW M Hybrid V8
	...["BMW M Team WRT 2024",
		"BMW M Team WRT 2025",
		"BMWMH Custom Team 2024", "BMWMH Custom Team 2025"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 7720}
	})),
	// Cadillac V-Series.R
	...[
		"Action Express Racing", "Cadillac Racing",
		"Cadillac Racing 2024", "Whelen Cadillac Racing 2024",
		"Cadillac Hertz Team Jota 2025", "Cadillac WTR 2025", "Cadillac Whelen 2025",
		"VLMDH Custom Team 2023", "VLMDH Custom Team 2024", "VLMDH Custom Team 2025"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 8665}
	})),
	// Ferrari 499P
	...["Ferrari AF Corse",
		"AF Corse 2024", "Ferrari AF Corse 2024",
		"Ferrari AF Corse 2025", "AF Corse 2025",
		"499P Custom Team 2023", "499P Custom Team 2024", "499P Custom Team 2025"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 8300}
	})),
	// Glickenhaus SGC007
	...["Glickenhaus Racing",
		"Glickenhaus Custom Team 2023"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 7040}
	})),
	// Isotta Fraschini TIP06
	...["Isotta TIPO6 2024",
		"Isotta Fraschini Custom Team 2024"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 8048}
	})),
	// Lamborghini SC63
	...["Lamborghini Iron Lynx 2024",
		"SC63 Custom Team 2024"
	].map(name => ({
		name, carclass: "Hyper",
		redline: {"R": 7920, "N": 7920, "1": 7920, "2": 7920, "3": 7920, "4": 7920, "5": 7920, "6": 7920, "7": 8070}
	})),
	// Peugeot 9X8
	...["Peugeot TotalEnergies",
		"Peugeot TotalEnergies 2024",
		"Peugeot TotalEnergies 2025",
		"Peugeot 9x8 Custom Team 2023", "9x8 Wing Custom Team 2023", "Peugeot 9x8 Custom Team 2024", "9x8 Wing Custom Team 2024", "Peugeot 9x8 Custom Team 2025", "9x8 Wing Custom Team 2025"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 8535}
	})),
	// Porsche 963
	...["Hertz Team Jota", "Porsche Penske Motorsport", "Proton Competition",
		"Hertz Team Jota 2024", "Porsche Penske Motorsport 2024", "Proton Competition 2024",
		"Porsche Penske Motorsport 2025", "Proton Competition 2025",
		"Porsche 963 Custom Team 2023", "Porsche 963 Custom Team 2024", "Porsche 963 Custom Team 2025"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 7980}
	})),
	// Toyota GR010
	...["Toyota Gazoo Racing",
		"Toyota Gazoo Racing 2024",
		"Toyota Gazoo Racing 2025",
		"Toyota GR010 Custom Team 2023", "Toyota GR010 Custom Team 2024", "Toyota GR010 Custom Team 2025"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 8350}
	})),
	// Vanwall 680
	...["Floyd Vanwall Racing Team",
		"Vanwall Custom Team 2023"
	].map(name => ({
		name, carclass: "Hyper", redline: {"ALL": 8900}
	})),
	
	// LMGT3
	// Aston Martin Vantage AMR
	...["Heart of Racing Team 2024", "D'Station Racing 2024",
		"Racing Spirit of Léman 2025", "Heart of Racing Team 2025",
		"AMR GT3 Custom Team", "AMR GT3 Custom Team 2025"
	].map(name => ({
		name, carclass: "GT3", redline: {"ALL": 7010}
	})),
	// BMW M4
	...["Team WRT 2024",
		"The Bend Team WRT 2025", "Team WRT 2025",
		"BMW GT3 Custom Team", "BMW GT3 Custom Team 2025"
	].map(name => ({
		name, carclass: "GT3", redline: {"ALL": 7180}
	})),
	// Chevrolet Corvette Z06
	...["TF Sport",
		"AWA Racing 2025", "TF Sport 2025",
		"Z06GT3R Custom Team", "Z06GT3R Custom Team 2025"
	].map(name => ({
		name, carclass: "GT3", redline: {"ALL": 7810}
	})),
	// Ferrari 296
	...["Vista AF Corse 2024", "JMW Motorsport 2024 2024", "JMW Motorsport 2024", "GR Racing 2024", "Spirit Of Race 2024",
		"Vista AF Corse 2025", "Kessel Racing 2025", "Richard Mille AF Corse 2025", "Ziggo Sport Tempesta 2025",
		"296GT3 Custom Team 2024", "296GT3 Custom Team 2025"
	].map(name => ({
		name, carclass: "GT3", redline: {"ALL": 7550}
	})),
	// Ford Mustang
	...["Proton Racing 2024",
		"Proton Competition 2025",
		"Mustang Custom Team 2024", "Mustang Custom Team 2025"
	].map(name => ({
		name, carclass: "GT3", redline: {"ALL": 7610}
	})),
	// Lamborghini Huracan EVO2
	...["Iron Lynx 2024", "Iron Dames 2024",
		"Huracan Custom Team 2024"
	].map(name => ({
		name, carclass: "GT3", redline: {"ALL": 8100}
	})),
	// Lexus RCF
	...["Akkodis ASP Team 2024",
		"Akkodis ASP Team 2025",
		"Lexus Custom Team 2024", "Lexus Custom Team 2025"
	].map(name => ({
		name, carclass: "GT3", redline: {"ALL": 6900}
	})),
	// McLaren 720S EVO
	...["United Autosports 2024", "Inception Racing 2024",
		"United Autosports 2025",
		"McLaren Custom Team 2024", "McLaren Custom Team 2025"
	].map(name => ({
		name, carclass: "GT3", redline: {"ALL": 7688}
	})),
	// Mercedes-AMG
	...["Iron Lynx 2025",
		"Mercedes AMG Custom Team 2025"
	].map(name => ({
		name, carclass: "GT3", redline: {"ALL": 7333}
	})),
	// Porsche 911 GT3 R
	...["Manthey Ema 2024", "Manthey PureRxcing 2024",
		"Iron Dames 2025", "Manthey 2025", "Manthey 1st Phorm 2025",
		"911GT3R Custom Team 2024", "911GT3R Custom Team 2025"
	].map(name => ({
		name, carclass: "GT3", redline: {"ALL": 9164}
	})),
	
	// LMGTE AM
	// Aston Martin Vantage AMR
	...["D'station Racing", "GMB Motorsport", "Northwest AMR", "ORT by TF", "TF Sport", "The Heart of Racing",
		"AMV Custom Team 2023"
	].map(name => ({
		name, carclass: "GTE", redline: {"ALL": 6800}
	})),
	// Corvette C8.R
	...["Corvette Racing",
		"C8RGTE Custom Team 2023"
	].map(name => ({
		name, carclass: "GTE", redline: {"ALL": 7110}
	})),
	// Ferrari 488 EVO
	...["AF Corse", "JMW Motorsport", "Kessel Racing", "Walkenhorst Motorsport",
		"488GTE Custom Team 2023"
	].map(name => ({
		name, carclass: "GTE", redline: {"ALL": 6940}
	})),
	// Porsche 911 RSR-19
	...["Dempsey-Proton Racing", "GR Racing", "Iron Dames", "Iron Lynx", "Project 1 - AO", "Proton Competition",
		"911GTE Custom Team 2023"
	].map(name => ({
		name, carclass: "GTE", redline: {"ALL": 9030}
	})),
	// LMP2 Oreca 07
	{	name: {},
		carclass: "LMP2",
		redline: {"R": 7925, "N": 7925, "1": 7925, "2": 7925, "3": 7925, "4": 7925, "5": 7925, "6": 8410}
	}
];


function dnr_SelectCarRedline() {
	let dnr_car;

	if ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsa') {
		dnr_car = [...dnr_ACRedlines, ...dnr_ACRedlines_generic].find(({ name }) => name == $prop('CarId'));
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'AssettoCorsaCompetizione') {
		dnr_car = dnr_ACCRedlines.find(({ name }) => name == $prop('CarModel'));
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'Automobilista2') {
		dnr_car = dnr_AMS2Redlines.find(({ name }) => name == $prop('CarModel'));
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'EAWRC23') {
		dnr_car = [...dnr_EAWRCRedlines, ...dnr_EAWRCRedlines_generic].find(({ name, carid }) => name == $prop('CarModel') && carid == $prop('CarId'));
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'IRacing') {
		dnr_car = [...dnr_iRacingRedlines, ...dnr_iRacingRedlines_generic].find(({ name }) => name == $prop('CarModel'));
	}
	if ($prop('DataCorePlugin.CurrentGame') == 'LMU') {
		dnr_car = $prop('CarClass') == 'LMP2'
			? dnr_LMURedlines.find(({ carclass }) => carclass == 'LMP2')
			: dnr_LMURedlines.find(({ name, carclass }) => name == $prop('CarModel') && carclass == $prop('CarClass'));
	}
	return dnr_car;
};


function dnr_RedlineState() {
	const dnr_car = dnr_SelectCarRedline();
	const dnr_isLastGear = $prop('Gear') == $prop('CarSettings_MaxGears');
	const dnr_lastGearRedline = !((($prop('DNRLEDs.LastGearRedline') ?? true) == false) && dnr_isLastGear);
	const dnr_SimHubGlobalRedline = $prop('Rpms') >= $prop('CarSettings_RedLineRPM');

	// Fall back to SimHub redline when the car is not listed
	if (!dnr_car) return dnr_lastGearRedline && dnr_SimHubGlobalRedline;

	// Return false if the redline object is empty (no redline) or override
	if (Object.keys(dnr_car.redline).length == 0) {
		if ($prop('DNRLEDs.ForceRedline') == 1 || $prop('DNRLEDs.ForceRedline') == null)
			return dnr_lastGearRedline && dnr_SimHubGlobalRedline;
		return false;
	}

	// Use the 'ALL' key for the redline if present, applying to all gears
	const redlineValue = dnr_car.redline[$prop('Gear')] ?? dnr_car.redline['ALL'];

	// If no specific redline or 'ALL' redline exists, don't show redline
	if (redlineValue == undefined) return false;

	// Return redline state from dataset
	return dnr_lastGearRedline && $prop('Rpms') >= redlineValue;
};


function dnr_RedlineValue() {
	const dnr_car = dnr_SelectCarRedline();

	// Fall back to SimHub redline when the car is not listed or redline object is empty (no redline)
	if (!dnr_car || Object.keys(dnr_car.redline).length == 0) return $prop('CarSettings_RedLineRPM');

	// Use the 'ALL' key for the redline if present, applying to all gears
	const redlineValue = dnr_car.redline[$prop('Gear')] ?? dnr_car.redline['ALL'];

	// Return the redline value or null if undefined
	return redlineValue ?? $prop('CarSettings_RedLineRPM');
};


function dnr_RpmStartValue() {
	if ($prop('DataCorePlugin.CurrentGame') == 'EAWRC23') {
		return Math.min(
			$prop('GameRawData.SessionUpdate.shiftlights_rpm_start'),
			dnr_RedlineValue() * 0.9);
	}
	//iRacing excluded because doesn't work for cars with gear dependent redline/rpmstart values
	//if ($prop('DataCorePlugin.CurrentGame') == 'IRacing') {
	//	return $prop('GameRawData.Telemetry.PlayerCarSLFirstRPM');
	//}
};


function dnr_ButtonBoxButtonEffectprocedure(dnr_ledLength, dnr_buttonState, dnr_ButtonBoxButtonEffect, dnr_Press_Hex, dnr_Press_Delay, dnr_Toggle_Hex, dnr_Toggle_Blink, dnr_Toggle_BlinkFrequency) {

UpdateGlobalColours.update();
const { dnr_TCcolour_Hex, dnr_ABScolour_Hex, dnr_BBcolour_Hex, dnr_MAPcolour_Hex, dnr_IgnitionOn_Hex, dnr_EngineOff_Hex, dnr_EngineOn_Hex, dnr_Flasher_Hex, dnr_PitLimiter_Hex1 } = UpdateGlobalColours;

const TDM_Togglecolour = dnr_TDM_Colour_Hex('main');
const dnr_TCcolour = $prop('TCLevel') != 0
		? dnr_TCcolour_Hex
		: '#FFFF0000';
const dnr_TCCutcolour = dnr_TCCut_propertySelect() != 0
		? dnr_TCcolour_Hex
		: '#FFFF0000';
const dnr_ABScolour = $prop('ABSLevel') != 0
	? dnr_ABScolour_Hex
	: '#FFFF0000';

switch (dnr_ButtonBoxButtonEffect) {

//No effect (Buttonstate)
case null:
case 0:
	if (dnr_changed_maxTime(300, dnr_buttonState))
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: null);
	return [null];

//Headlights
case 1:
	return dnr_lights()
		? dnr_lightsHighbeam()
			? Array(dnr_ledLength).fill('#FF0000FF')
			: Array(dnr_ledLength).fill('#FF00FF00')
		: [null];

//Flasher
case 2:
	return dnr_flash()
		? Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
			? dnr_Flasher_Hex
			: '#FF000000')
		: [null];

//Headlights & flasher
case 3:
	if (dnr_flash()) return Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
		? dnr_Flasher_Hex
		: '#FF000000');
	return dnr_lights()
		? dnr_lightsHighbeam()
			? Array(dnr_ledLength).fill('#FF0000FF')
			: Array(dnr_ledLength).fill('#FF00FF00')
		: [null];

//Rain Light
case 4:
	return dnr_rainlights()
		? Array(dnr_ledLength).fill((Math.floor(Date.now() / 500) % 2)
			? '#FFFFFF00'
			: null)
		: [null];

//Left Indicator
case 5:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorLeft') == 1)
			return Array(dnr_ledLength).fill('#FFFFA500');
	}
	else {
		if ($prop('TurnIndicatorLeft') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? '#FFFFA500'
				: '#FF000000');
	}
	return [null];
		
//Right Indicator
case 6:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill('#FFFFA500');
	}
	else {
		if ($prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? '#FFFFA500'
				: '#FF000000');
	}
	return [null];

//Wipers
case 7:
	return dnr_wipers()
		? Array(dnr_ledLength).fill('#FF1E90FF')
		: [null];

//Ignition
case 8:
	if ($prop('EngineIgnitionOn') == 1) return Array(dnr_ledLength).fill(dnr_IgnitionOn_Hex);
	return [null];

//Engine Start & Ignition/Engine Start Combined
case 9:
case 10:
	if ($prop('EngineIgnitionOn') == 1 && $prop('EngineStarted') == 0)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 750) % 2)
			? dnr_EngineOff_Hex
			: '#FF000000');
	if ($prop('EngineStarted') == 1) return Array(dnr_ledLength).fill(dnr_EngineOn_Hex);
	return [null];

//DRS
case 11:
	if ($prop('DRSEnabled') == 1) return Array(dnr_ledLength).fill('#FF008000');

	if ($prop('DRSAvailable') == 1)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
			? '#FF008000'
			: null);

	if ($prop('DNRLEDs.DRSDetectionPoint') ?? true) {
		if (dnr_DRS_detection()) return Array(dnr_ledLength).fill('#FFFFFF00');
	}
	return [null];

//KERS / ERS Lap Deploy Limit
case 12:
	KERS = dnr_KERS();

	if (KERS > 50) return Array(dnr_ledLength).fill('#FF008000');
	if (KERS > 25 && KERS <= 50) return Array(dnr_ledLength).fill('#FFFFFF00');
	if (KERS > 10 && KERS <= 25) return Array(dnr_ledLength).fill('#FFFF8C00');
	if (KERS > 0 && KERS <= 10) return Array(dnr_ledLength).fill('#FFFF0000');
	if (KERS <= 0) return [null];
	return [null];

//P2P
case 13:
	return $prop('PushToPassActive') 
		? Array(dnr_ledLength).fill($prop('DNRLEDs.P2PColour') ?? '#FF008000') 
		: [null];

//Pit Limiter
case 14:
	//Pitlane Entry warning
	if ($prop('IsInPitLane') == 1 && $prop('SpeedKmh') > 1 && $prop('PitLimiterOn') == 0)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 125) % 2)
			? '#FFFF0000'
			: '#FF000000');
	
	//Pitlane Exit warning
	if (dnr_isdecreasing_maxTime (10000, $prop('IsInPitLane'), 'PITEXIT') &&
		$prop('IsInPitLane') == 0 &&
		$prop('PitLimiterOn') == 1)
			return Array(dnr_ledLength).fill((Math.floor(Date.now() / 125) % 2)
				? '#FF00FF00'
				: '#FF000000');
	
	//Limiter On
	if ($prop('PitLimiterOn') == 1) return Array(dnr_ledLength).fill(dnr_PitLimiter_Hex1);
	return [null];

//Momentary Press
case 15:
	return Array(dnr_ledLength).fill(dnr_changed_minTime(dnr_Press_Delay == 0 ? 1 : dnr_Press_Delay, dnr_buttonState)
		? dnr_Press_Hex
		: null);

//Latching Toggle
case 16:
	if (root.btn == null) root.btn = false;
	if (root.debouncestate == null) root.debouncestate = true;

	if (dnr_buttonState) {
		if (!root.debouncestate) {
			root.btn = !root.btn;
			root.debouncestate = true;
		}
	}
	else {
		root.debouncestate = false;
	}

	return root.btn
		? dnr_Toggle_Blink
			? Array(dnr_ledLength).fill((Math.floor(Date.now() / dnr_Toggle_BlinkFrequency) % 2)
				? dnr_Toggle_Hex
				: null)
			: Array(dnr_ledLength).fill(dnr_Toggle_Hex)
		: Array(dnr_ledLength).fill(dnr_Press_Hex);

//Kill LEDs
case 17:
	return Array(dnr_ledLength).fill('#FF00FF00');

//TC +
case 18:
	if (dnr_isincreasing_maxTime(500, $prop('TCLevel'), 'TCplus')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: dnr_TCcolour);
	}
	return Array(dnr_ledLength).fill(dnr_TCcolour);

//TC -
case 19:
	if (dnr_isdecreasing_maxTime(500, $prop('TCLevel'), 'TCmin')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: dnr_TCcolour);
	}
	return Array(dnr_ledLength).fill(dnr_TCcolour);

//TC Cut +
case 20:
	if (dnr_isincreasing_maxTime(500, dnr_TCCut_propertySelect(), 'TCCUTplus')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: dnr_TCCutcolour);
	}
	return Array(dnr_ledLength).fill(dnr_TCCutcolour);

//TC Cut -
case 21:
	if (dnr_isdecreasing_maxTime(500, dnr_TCCut_propertySelect(), 'TCCUTmin')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: dnr_TCCutcolour);
	}
	return Array(dnr_ledLength).fill(dnr_TCCutcolour);

//ABS +
case 22:
	if (dnr_isincreasing_maxTime(500, $prop('ABSLevel'), 'ABSplus')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: dnr_ABScolour);
	}
	return Array(dnr_ledLength).fill(dnr_ABScolour);

//ABS -
case 23:
	if (dnr_isdecreasing_maxTime(500, $prop('ABSLevel'), 'ABSmin')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: dnr_ABScolour);
	}
	return Array(dnr_ledLength).fill(dnr_ABScolour);

//Engine Map +
case 24:
	if (dnr_isincreasing_maxTime(500, $prop('EngineMap'), 'MAPplus')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: dnr_MAPcolour_Hex);
	}
	return Array(dnr_ledLength).fill(dnr_MAPcolour_Hex);

//Engine Map -
case 25:
	if (dnr_isdecreasing_maxTime(500, $prop('EngineMap'), 'MAPmin')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: dnr_MAPcolour_Hex);
	}
	return Array(dnr_ledLength).fill(dnr_MAPcolour_Hex);

//Brake Bias +
case 26:
	if (dnr_isincreasing_maxTime(500, $prop('BrakeBias'), 'BBplus')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: dnr_BBcolour_Hex);
	}
	return Array(dnr_ledLength).fill(dnr_BBcolour_Hex);

//Brake Bias -
case 27:
	if (dnr_isdecreasing_maxTime(500, $prop('BrakeBias'), 'BBmin')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: dnr_BBcolour_Hex);
	}
	return Array(dnr_ledLength).fill(dnr_BBcolour_Hex);

//Fuel Adjust + & - (Buttonstate)
case 28:
case 29:
	if (dnr_changed_maxTime(300, dnr_buttonState))
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: '#FF00FF00');
	if ($prop('DataCorePlugin.CurrentGame') == 'IRacing')
		return $prop('GameRawData.Telemetry.dpFuelFill') == 1
			? Array(dnr_ledLength).fill('#FF00FF00')
			: [null];
	return Array(dnr_ledLength).fill('#FF00FF00');

//TDM Toggle
case 30:
	return Array(dnr_ledLength).fill(TDM_Togglecolour);

//ERS Mode
case 31:
	return Array(dnr_ledLength).fill(dnr_ERS_Colour_Hex());

//Hazard Lights
case 32:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorLeft') == 1 && $prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill('#FFFFA500');
	}
	else {
		if ($prop('TurnIndicatorLeft') == 1 && $prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? '#FFFFA500'
				: '#FF000000');
	}
	return [null];

//Parking Brake
case 33:
	return dnr_parkingBrake()
		? Array(dnr_ledLength).fill('#FFFF0000')
		: [null];

default:
	if ($prop('DataCorePlugin.CurrentGame') != 'IRacing') return [null];
}

//iRacing effects
if ($prop('DataCorePlugin.CurrentGame') == 'IRacing') {

switch (dnr_ButtonBoxButtonEffect) {

//Refuel
case 49:
	return $prop('GameRawData.Telemetry.dpFuelFill') == 1
		? Array(dnr_ledLength).fill('#FF00FF00')
		: Array(dnr_ledLength).fill('#FFFF0000');

//Pass Left & Pass right (Buttonstate)
case 50:
case 51:
	if (dnr_changed_minTime(1500, dnr_buttonState))
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 200) % 2)
			? '#FFFFFF00'
			: '#FF000000');

//Auto Fuel
case 52:
	return $prop('GameRawData.Telemetry.dpFuelAutoFillActive') == 1 &&
		$prop('GameRawData.Telemetry.dpFuelAutoFillEnabled') == 1
				? Array(dnr_ledLength).fill('#FF00FF00')
				: Array(dnr_ledLength).fill('#FFFF0000');

//No Refuel
case 53:
	return $prop('GameRawData.Telemetry.dpFuelFill') == 0 &&
		$prop('GameRawData.Telemetry.dpFuelAutoFillActive') == 0
			? Array(dnr_ledLength).fill('#FFFF0000')
			: [null];

//New Tyres
case 54:
	return ($prop('GameRawData.Telemetry.dpLFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpLRTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpLTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpTireChange') == 1)
				? Array(dnr_ledLength).fill('#FF00FF00')
				: Array(dnr_ledLength).fill('#FFFF0000');

//No Tyres
case 55:
	return 	(($prop('GameRawData.Telemetry.dpLFTireChange') == 0 &&
			$prop('GameRawData.Telemetry.dpLRTireChange') == 0 &&
			$prop('GameRawData.Telemetry.dpRFTireChange') == 0 &&
			$prop('GameRawData.Telemetry.dpRRTireChange') == 0 ||
		
			$prop('GameRawData.Telemetry.dpLTireChange') == 0 &&
			$prop('GameRawData.Telemetry.dpRTireChange') == 0 ||
		
			$prop('GameRawData.Telemetry.dpTireChange') == 0) &&
		
			$prop('GameRawData.Telemetry.PitSvFlags') >= 0)
				? Array(dnr_ledLength).fill('#FFFF0000')
				: [null];

//Tyre Compound Dry
case 56:
	return 	(($prop('GameRawData.Telemetry.dpLFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpLRTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpLTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpTireChange') == 1) &&
		
			$prop('GameRawData.Telemetry.PitSvTireCompound') == 0 &&
		
			$prop('GameRawData.Telemetry.PitSvFlags') > 0)
				? Array(dnr_ledLength).fill('#FF00FF00')
				: [null];

//Tyre Compound Wet
case 57:
	return 	(($prop('GameRawData.Telemetry.dpLFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpLRTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpLTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpTireChange') == 1) &&
		
			$prop('GameRawData.Telemetry.PitSvTireCompound') == 1 &&
		
			$prop('GameRawData.Telemetry.PitSvFlags') > 0)
				? Array(dnr_ledLength).fill('#FF1E90FF')
				: [null];

//Windshield Tear Off
case 58:
	return ($prop('GameRawData.Telemetry.dpWindshieldTearoff') == 1)
		? Array(dnr_ledLength).fill('#FFFFFF00')
		: [null];
		
//Clear Pit Flags
case 59:
	return ($prop('GameRawData.Telemetry.PitSvFlags') == 0)
		? Array(dnr_ledLength).fill('#FFFF1493')
		: [null];

//New Tyres Left
case 60:
	return ($prop('GameRawData.Telemetry.dpLFTireChange') == 1 &&
		$prop('GameRawData.Telemetry.dpLRTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpLTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill('#FF00FF00')
			: Array(dnr_ledLength).fill('#FFFF0000');

//New Tyres Right
case 61:
	return ($prop('GameRawData.Telemetry.dpRFTireChange') == 1 &&
		$prop('GameRawData.Telemetry.dpRRTireChange') == 1 ||

		$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill('#FF00FF00')
			: Array(dnr_ledLength).fill('#FFFF0000');

//Fast Repair
case 62:
	return $prop('GameRawData.Telemetry.dpFastRepair') == 1
		? Array(dnr_ledLength).fill('#FF00FF00')
		: Array(dnr_ledLength).fill('#FFFF0000');

//New Tyre Left Front
case 63:
	return ($prop('GameRawData.Telemetry.dpLFTireChange') == 1 ||

		$prop('GameRawData.Telemetry.dpLTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill('#FF00FF00')
			: Array(dnr_ledLength).fill('#FFFF0000');

//New Tyre Left Rear
case 64:
	return ($prop('GameRawData.Telemetry.dpLRTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpLTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill('#FF00FF00')
			: Array(dnr_ledLength).fill('#FFFF0000');

//New Tyre Right Front
case 65:
	return ($prop('GameRawData.Telemetry.dpRFTireChange') == 1 ||

		$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill('#FF00FF00')
			: Array(dnr_ledLength).fill('#FFFF0000');

//New Tyre Right Rear
case 66:
	return ($prop('GameRawData.Telemetry.dpRRTireChange') == 1 ||

		$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill('#FF00FF00')
			: Array(dnr_ledLength).fill('#FFFF0000');

default:
	return [null];
}
}
};


function dnr_ButtonBoxButtonEffectprocedureTDM(dnr_ledLength, dnr_buttonState, dnr_ButtonBoxButtonEffect, dnr_Press_Delay, dnr_Toggle_Blink, dnr_Toggle_BlinkFrequency) {

const TDM_colour = dnr_TDM_Colour_Hex('alt');

switch (dnr_ButtonBoxButtonEffect) {

//No effect (Buttonstate)
case null:
case 0:
	if (dnr_changed_maxTime(300, dnr_buttonState))
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: null);
	return [null];

//Headlights
case 1:
	return dnr_lights()
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Flasher
case 2:
	return dnr_flash()
		? Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
			? TDM_colour
			: '#FF000000')
		: [null];

//Headlights & flasher
case 3:
	if (dnr_flash()) return Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
		? TDM_colour
		: '#FF000000');
	return dnr_lights()
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Rain Light
case 4:
	return dnr_rainlights()
		? Array(dnr_ledLength).fill((Math.floor(Date.now() / 500) % 2)
			? TDM_colour
			: null)
		: [null];

//Left Indicator
case 5:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorLeft') == 1)
			return Array(dnr_ledLength).fill(TDM_colour);
	}
	else {
		if ($prop('TurnIndicatorLeft') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? TDM_colour
				: '#FF000000');
	}
	return [null];
		
//Right Indicator
case 6:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill(TDM_colour);
	}
	else {
		if ($prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? TDM_colour
				: '#FF000000');
	}
	return [null];

//Wipers
case 7:
	return dnr_wipers()
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Ignition
case 8:
	if ($prop('EngineIgnitionOn') == 1) return Array(dnr_ledLength).fill(TDM_colour);
	return [null];

//Engine Start & Ignition/Engine Start Combined
case 9:
case 10:
	if ($prop('EngineIgnitionOn') == 1 && $prop('EngineStarted') == 0)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 750) % 2)
			? TDM_colour
			: '#FF000000');
	if ($prop('EngineStarted') == 1) return Array(dnr_ledLength).fill(TDM_colour);
	return [null];

//DRS
case 11:
	if ($prop('DRSEnabled') == 1) return Array(dnr_ledLength).fill('#FF008000');

	if ($prop('DRSAvailable') == 1)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
			? '#FF008000'
			: null);

	if ($prop('DNRLEDs.DRSDetectionPoint') ?? true) {
		if (dnr_DRS_detection()) return Array(dnr_ledLength).fill('#FFFFFF00');
	}
	return [null];

//KERS / ERS Lap Deploy Limit
case 12:
	KERS = dnr_KERS();

	if (KERS > 50) return Array(dnr_ledLength).fill('#FF008000');
	if (KERS > 25 && KERS <= 50) return Array(dnr_ledLength).fill('#FFFFFF00');
	if (KERS > 10 && KERS <= 25) return Array(dnr_ledLength).fill('#FFFF8C00');
	if (KERS > 0 && KERS <= 10) return Array(dnr_ledLength).fill('#FFFF0000');
	if (KERS <= 0) return [null];
	return [null];

//P2P
case 13:
	return $prop('PushToPassActive') 
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Pit Limiter
case 14:
	//Pitlane Entry warning
	if ($prop('IsInPitLane') == 1 && $prop('SpeedKmh') > 1 && $prop('PitLimiterOn') == 0)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 125) % 2)
			? '#FFFF0000'
			: '#FF000000');
	
	//Pitlane Exit warning
	if (dnr_isdecreasing_maxTime (10000, $prop('IsInPitLane'), 'PITEXIT') &&
		$prop('IsInPitLane') == 0 &&
		$prop('PitLimiterOn') == 1)
			return Array(dnr_ledLength).fill((Math.floor(Date.now() / 125) % 2)
				? '#FF00FF00'
				: '#FF000000');
	
	//Limiter On
	if ($prop('PitLimiterOn') == 1) return Array(dnr_ledLength).fill(TDM_colour);
	return [null];

//Momentary Press
case 15:
	return Array(dnr_ledLength).fill(dnr_changed_minTime(dnr_Press_Delay == 0 ? 1 : dnr_Press_Delay, dnr_buttonState)
		? TDM_colour
		: null);

//Latching Toggle
case 16:
	if (root.btn == null) root.btn = false;
	if (root.debouncestate == null) root.debouncestate = true;

	if (dnr_buttonState) {
		if (!root.debouncestate) {
			root.btn = !root.btn;
			root.debouncestate = true;
		}
	}
	else {
		root.debouncestate = false;
	}

	return root.btn
		? dnr_Toggle_Blink
			? Array(dnr_ledLength).fill((Math.floor(Date.now() / dnr_Toggle_BlinkFrequency) % 2)
				? TDM_colour
				: null)
			: Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Kill LEDs
case 17:
	return Array(dnr_ledLength).fill(TDM_colour);

//TC +
case 18:
	if (dnr_isincreasing_maxTime(500, $prop('TCLevel'), 'TCplus')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2) ? '#FF000000' : TDM_colour);
	}
	return Array(dnr_ledLength).fill(TDM_colour);

//TC -
case 19:
	if (dnr_isdecreasing_maxTime(500, $prop('TCLevel'), 'TCmin')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2) ? '#FF000000' : TDM_colour);
	}
	return Array(dnr_ledLength).fill(TDM_colour);

//TC Cut +
case 20:
	if (dnr_isincreasing_maxTime(500, dnr_TCCut_propertySelect(), 'TCCUTplus')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2) ? '#FF000000' : TDM_colour);
	}
	return Array(dnr_ledLength).fill(TDM_colour);

//TC Cut -
case 21:
	if (dnr_isdecreasing_maxTime(500, dnr_TCCut_propertySelect(), 'TCCUTmin')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2) ? '#FF000000' : TDM_colour);
	}
	return Array(dnr_ledLength).fill(TDM_colour);

//ABS +
case 22:
	if (dnr_isincreasing_maxTime(500, $prop('ABSLevel'), 'ABSplus')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2) ? '#FF000000' : TDM_colour);
	}
	return Array(dnr_ledLength).fill(TDM_colour);

//ABS -
case 23:
	if (dnr_isdecreasing_maxTime(500, $prop('ABSLevel'), 'ABSmin')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2) ? '#FF000000' : TDM_colour);
	}
	return Array(dnr_ledLength).fill(TDM_colour);

//Engine Map +
case 24:
	if (dnr_isincreasing_maxTime(500, $prop('EngineMap'), 'MAPplus')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2) ? '#FF000000' : TDM_colour);
	}
	return Array(dnr_ledLength).fill(TDM_colour);

//Engine Map -
case 25:
	if (dnr_isdecreasing_maxTime(500, $prop('EngineMap'), 'MAPmin')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2) ? '#FF000000' : TDM_colour);
	}
	return Array(dnr_ledLength).fill(TDM_colour);

//Brake Bias +
case 26:
	if (dnr_isincreasing_maxTime(500, $prop('BrakeBias'), 'BBplus')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2) ? '#FF000000' : TDM_colour);
	}
	return Array(dnr_ledLength).fill(TDM_colour);

//Brake Bias -
case 27:
	if (dnr_isdecreasing_maxTime(500, $prop('BrakeBias'), 'BBmin')) {
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2) ? '#FF000000' : TDM_colour);
	}
	return Array(dnr_ledLength).fill(TDM_colour);

//Fuel Adjust + & - (Buttonstate)
case 28:
case 29:
	if (dnr_changed_maxTime(300, dnr_buttonState))
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
			? '#FF000000'
			: TDM_colour);
	if ($prop('DataCorePlugin.CurrentGame') == 'IRacing')
		return $prop('GameRawData.Telemetry.dpFuelFill') == 1
			? Array(dnr_ledLength).fill(TDM_colour)
			: [null];
	return Array(dnr_ledLength).fill(TDM_colour);

//TDM Toggle
case 30:
	return Array(dnr_ledLength).fill(TDM_colour);

//ERS Mode
case 31:
	return Array(dnr_ledLength).fill(dnr_ERS_Colour_Hex());

//Hazard Lights
case 32:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorLeft') == 1 && $prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill(TDM_colour);
	}
	else {
		if ($prop('TurnIndicatorLeft') == 1 && $prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? TDM_colour
				: '#FF000000');
	}
	return [null];

//Parking Brake
case 33:
	return dnr_parkingBrake()
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

default:
	if ($prop('DataCorePlugin.CurrentGame') != 'IRacing') return [null];
}

//iRacing effects
if ($prop('DataCorePlugin.CurrentGame') == 'IRacing') {

switch (dnr_ButtonBoxButtonEffect) {

//Refuel
case 49:
	return $prop('GameRawData.Telemetry.dpFuelFill') == 1
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Pass Left & Pass right (Buttonstate)
case 50:
case 51:
	if (dnr_changed_minTime(1500, dnr_buttonState))
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 200) % 2)
			? TDM_colour
			: '#FF000000');

//Auto Fuel
case 52:
	return $prop('GameRawData.Telemetry.dpFuelAutoFillActive') == 1 &&
		$prop('GameRawData.Telemetry.dpFuelAutoFillEnabled') == 1
			? Array(dnr_ledLength).fill(TDM_colour)
			: [null];

//No Refuel
case 53:
	return $prop('GameRawData.Telemetry.dpFuelFill') == 0 &&
		$prop('GameRawData.Telemetry.dpFuelAutoFillActive') == 0
			? Array(dnr_ledLength).fill(TDM_colour)
			: [null];

//New Tyres
case 54:
	return ($prop('GameRawData.Telemetry.dpLFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpLRTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpLTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpTireChange') == 1)
				? Array(dnr_ledLength).fill(TDM_colour)
				: [null];

//No Tyres
case 55:
	return 	(($prop('GameRawData.Telemetry.dpLFTireChange') == 0 &&
			$prop('GameRawData.Telemetry.dpLRTireChange') == 0 &&
			$prop('GameRawData.Telemetry.dpRFTireChange') == 0 &&
			$prop('GameRawData.Telemetry.dpRRTireChange') == 0 ||
		
			$prop('GameRawData.Telemetry.dpLTireChange') == 0 &&
			$prop('GameRawData.Telemetry.dpRTireChange') == 0 ||
		
			$prop('GameRawData.Telemetry.dpTireChange') == 0) &&
		
			$prop('GameRawData.Telemetry.PitSvFlags') >= 0)
				? Array(dnr_ledLength).fill(TDM_colour)
				: [null];

//Tyre Compound Dry
case 56:
	return 	(($prop('GameRawData.Telemetry.dpLFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpLRTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpLTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpTireChange') == 1) &&
		
			$prop('GameRawData.Telemetry.PitSvTireCompound') == 0 &&
		
			$prop('GameRawData.Telemetry.PitSvFlags') > 0)
				? Array(dnr_ledLength).fill(TDM_colour)
				: [null];

//Tyre Compound Wet
case 57:
	return 	(($prop('GameRawData.Telemetry.dpLFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpLRTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRFTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpLTireChange') == 1 &&
			$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
			$prop('GameRawData.Telemetry.dpTireChange') == 1) &&
		
			$prop('GameRawData.Telemetry.PitSvTireCompound') == 1 &&
		
			$prop('GameRawData.Telemetry.PitSvFlags') > 0)
				? Array(dnr_ledLength).fill(TDM_colour)
				: [null];

//Windshield Tear Off
case 58:
	return ($prop('GameRawData.Telemetry.dpWindshieldTearoff') == 1)
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];
		
//Clear Pit Flags
case 59:
	return ($prop('GameRawData.Telemetry.PitSvFlags') == 0)
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//New Tyres Left
case 60:
	return ($prop('GameRawData.Telemetry.dpLFTireChange') == 1 &&
		$prop('GameRawData.Telemetry.dpLRTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpLTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill(TDM_colour)
			: [null];

//New Tyres Right
case 61:
	return ($prop('GameRawData.Telemetry.dpRFTireChange') == 1 &&
		$prop('GameRawData.Telemetry.dpRRTireChange') == 1 ||

		$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill(TDM_colour)
			: [null];

//Fast Repair
case 62:
	return $prop('GameRawData.Telemetry.dpFastRepair') == 1
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//New Tyre Left Front
case 63:
	return ($prop('GameRawData.Telemetry.dpLFTireChange') == 1 ||

		$prop('GameRawData.Telemetry.dpLTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill(TDM_colour)
			: [null];

//New Tyre Left Rear
case 64:
	return ($prop('GameRawData.Telemetry.dpLRTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpLTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill(TDM_colour)
			: [null];

//New Tyre Right Front
case 65:
	return ($prop('GameRawData.Telemetry.dpRFTireChange') == 1 ||

		$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill(TDM_colour)
			: [null];

//New Tyre Right Rear
case 66:
	return ($prop('GameRawData.Telemetry.dpRRTireChange') == 1 ||

		$prop('GameRawData.Telemetry.dpRTireChange') == 1 ||
		
		$prop('GameRawData.Telemetry.dpTireChange') == 1)
			? Array(dnr_ledLength).fill(TDM_colour)
			: [null];

default:
	return [null];
}
}
};


function dnr_WheelButtonEffectprocedure(dnr_ledLength, dnr_buttonState, dnr_WheelsButtonEffect, dnr_Press_Hex, dnr_Press_Delay, dnr_Toggle_Hex, dnr_Toggle_Blink, dnr_Toggle_BlinkFrequency) {

UpdateGlobalColours.update();
const { dnr_TCcolour_Hex, dnr_ABScolour_Hex, dnr_BBcolour_Hex, dnr_MAPcolour_Hex, dnr_IgnitionOn_Hex, dnr_EngineOff_Hex, dnr_EngineOn_Hex, dnr_Flasher_Hex, dnr_PitLimiter_Hex1 } = UpdateGlobalColours;

const TDM_Togglecolour = dnr_TDM_Colour_Hex('main');

switch (dnr_WheelsButtonEffect) {

//No effect (Buttonstate)
case null:
case 0:
	if (($prop('DNRLEDs.WheelInputEffects') ?? true) &&
		dnr_changed_maxTime(300, dnr_buttonState))
			return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
				? '#FF000000'
				: null);
		return [null];

//Headlights
case 1:
	return dnr_lights()
		? dnr_lightsHighbeam()
			? Array(dnr_ledLength).fill('#FF0000FF')
			: Array(dnr_ledLength).fill('#FF00FF00')
		: [null];

//Flasher
case 2:
	return dnr_flash()
		? Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
			? dnr_Flasher_Hex
			: '#FF000000')
		: [null];

//Headlights & flasher
case 3:
	if (dnr_flash()) return Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
		? dnr_Flasher_Hex
		: '#FF000000');
	return dnr_lights()
		? dnr_lightsHighbeam()
			? Array(dnr_ledLength).fill('#FF0000FF')
			: Array(dnr_ledLength).fill('#FF00FF00')
		: [null];

//Rain Light
case 4:
	return dnr_rainlights()
		? Array(dnr_ledLength).fill((Math.floor(Date.now() / 500) % 2)
			? '#FFFFFF00'
			: null)
		: [null];

//Left Indicator
case 5:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorLeft') == 1)
			return Array(dnr_ledLength).fill('#FFFFA500');
	}
	else {
		if ($prop('TurnIndicatorLeft') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? '#FFFFA500'
				: '#FF000000');
	}
	return [null];
		
//Right Indicator
case 6:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill('#FFFFA500');
	}
	else {
		if ($prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? '#FFFFA500'
				: '#FF000000');
	}
	return [null];

//Wipers
case 7:
	return dnr_wipers()
		? Array(dnr_ledLength).fill('#FF1E90FF')
		: [null];

//Ignition
case 8:
	if ($prop('EngineIgnitionOn') == 1) return Array(dnr_ledLength).fill(dnr_IgnitionOn_Hex);
	return [null];

//Engine Start & Ignition/Engine Start Combined
case 9:
case 10:
	if ($prop('EngineIgnitionOn') == 1 && $prop('EngineStarted') == 0)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 750) % 2)
			? dnr_EngineOff_Hex
			: '#FF000000');
	if ($prop('EngineStarted') == 1) return Array(dnr_ledLength).fill(dnr_EngineOn_Hex);
	return [null];

//DRS
case 11:
	if ($prop('DRSEnabled') == 1) return Array(dnr_ledLength).fill('#FF008000');

	if ($prop('DRSAvailable') == 1)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
			? '#FF008000'
			: null);

	if ($prop('DNRLEDs.DRSDetectionPoint') ?? true) {
		if (dnr_DRS_detection()) return Array(dnr_ledLength).fill('#FFFFFF00');
	}
	return [null];

//KERS / ERS Lap Deploy Limit
case 12:
	KERS = dnr_KERS();

	if (KERS > 50) return Array(dnr_ledLength).fill('#FF008000');
	if (KERS > 25 && KERS <= 50) return Array(dnr_ledLength).fill('#FFFFFF00');
	if (KERS > 10 && KERS <= 25) return Array(dnr_ledLength).fill('#FFFF8C00');
	if (KERS > 0 && KERS <= 10) return Array(dnr_ledLength).fill('#FFFF0000');
	if (KERS <= 0) return [null];
	return [null];

//P2P
case 13:
	return $prop('PushToPassActive') 
		? Array(dnr_ledLength).fill($prop('DNRLEDs.P2PColour') ?? '#FF008000') 
		: [null];

//Pit Limiter
case 14:
	//Pitlane Entry warning
	if ($prop('IsInPitLane') == 1 && $prop('SpeedKmh') > 1 && $prop('PitLimiterOn') == 0)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 125) % 2)
			? '#FFFF0000'
			: '#FF000000');
	
	//Pitlane Exit warning
	if (dnr_isdecreasing_maxTime (10000, $prop('IsInPitLane'), 'PITEXIT') &&
		$prop('IsInPitLane') == 0 &&
		$prop('PitLimiterOn') == 1)
			return Array(dnr_ledLength).fill((Math.floor(Date.now() / 125) % 2)
				? '#FF00FF00'
				: '#FF000000');
	
	//Limiter On
	if ($prop('PitLimiterOn') == 1) return Array(dnr_ledLength).fill(dnr_PitLimiter_Hex1);
	return [null];

//Value Increase
case 15:
	if (dnr_isincreasing_maxTime (500, $prop('TCLevel'), 'TC')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
    	    ? Array(dnr_ledLength).fill(dnr_TCcolour_Hex)
    	    : Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isincreasing_maxTime (500, dnr_TCCut_propertySelect(), 'TCCUT')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
        	? Array(dnr_ledLength).fill(dnr_TCcolour_Hex)
        	: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isincreasing_maxTime (500, $prop('ABSLevel'), 'ABS')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
        	? Array(dnr_ledLength).fill(dnr_ABScolour_Hex)
        	: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isincreasing_maxTime (500, $prop('BrakeBias'), 'BB')) {
		return Math.floor((Date.now() / 100) % 2) == 1
			? Array(dnr_ledLength).fill(dnr_BBcolour_Hex)
			: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isincreasing_maxTime (500, $prop('EngineMap'), 'MAP')) {
		return Math.floor((Date.now() / 100) % 2) == 1
			? Array(dnr_ledLength).fill(dnr_MAPcolour_Hex)
			: Array(dnr_ledLength).fill('#00000000');
	}
	return [null];

//Value Decrease
case 16:
	if (dnr_isdecreasing_maxTime (500, $prop('TCLevel'), 'TC')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
        	? Array(dnr_ledLength).fill(dnr_TCcolour_Hex)
        	: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isdecreasing_maxTime (500, dnr_TCCut_propertySelect(), 'TCCUT')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
        	? Array(dnr_ledLength).fill(dnr_TCcolour_Hex)
        	: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isdecreasing_maxTime (500, $prop('ABSLevel'), 'ABS')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
        	? Array(dnr_ledLength).fill(dnr_ABScolour_Hex)
        	: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isdecreasing_maxTime (500, $prop('BrakeBias'), 'BB')) {
		return Math.floor((Date.now() / 100) % 2) == 1
			? Array(dnr_ledLength).fill(dnr_BBcolour_Hex)
			: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isdecreasing_maxTime (500, $prop('EngineMap'), 'MAP')) {
		return Math.floor((Date.now() / 100) % 2) == 1
			? Array(dnr_ledLength).fill(dnr_MAPcolour_Hex)
			: Array(dnr_ledLength).fill('#00000000');
	}
	return [null];

//Momentary Press
case 17:
	return Array(dnr_ledLength).fill(dnr_changed_minTime(dnr_Press_Delay == 0 ? 1 : dnr_Press_Delay, dnr_buttonState)
		? dnr_Press_Hex
		: null);

//Latching Toggle
case 18:
	if (root.btn == null) root.btn = false;
	if (root.debouncestate == null) root.debouncestate = true;

	if (dnr_buttonState) {
		if (!root.debouncestate) {
			root.btn = !root.btn;
			root.debouncestate = true;
		}
	} else {
		root.debouncestate = false;
	}

	return root.btn
		? dnr_Toggle_Blink
			? Array(dnr_ledLength).fill((Math.floor(Date.now() / dnr_Toggle_BlinkFrequency) % 2)
				? dnr_Toggle_Hex
				: null)
			: Array(dnr_ledLength).fill(dnr_Toggle_Hex)
		: Array(dnr_ledLength).fill(dnr_Press_Hex);

//TDM Toggle
case 19:
	return Array(dnr_ledLength).fill(TDM_Togglecolour);

//TC Active
case 20:
	if ($prop('TCActive') == 1 || $prop('DahlDesign.TCActive') == true) {
		return Array(dnr_ledLength).fill(dnr_TCcolour_Hex);
	}
	return [null];

//ABS Active
case 21:
	if (dnr_ABSActive()) {
		return Array(dnr_ledLength).fill(dnr_ABScolour_Hex);
	}
	return [null];

//ERS Mode
case 22:
	return Array(dnr_ledLength).fill(dnr_ERS_Colour_Hex());

//Hazard Lights
case 23:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorLeft') == 1 && $prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill('#FFFFA500');
	}
	else {
		if ($prop('TurnIndicatorLeft') == 1 && $prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? '#FFFFA500'
				: '#FF000000');
	}
	return [null];

default:
	if ($prop('DataCorePlugin.CurrentGame') != 'IRacing') return [null];
}

//iRacing effects
if ($prop('DataCorePlugin.CurrentGame') == 'IRacing') {

switch (dnr_WheelsButtonEffect) {

//Pass Left & Pass right (Buttonstate)
case 30:
case 31:
	if (dnr_changed_minTime(1500, dnr_buttonState))
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 200) % 2)
			? '#FFFFFF00'
			: '#FF000000');

//Auto Fuel
case 32:
	return $prop('GameRawData.Telemetry.dpFuelAutoFillActive') == 1 &&
		$prop('GameRawData.Telemetry.dpFuelAutoFillEnabled') == 1
			? Array(dnr_ledLength).fill('#FF00FF00')
			: Array(dnr_ledLength).fill('#FFFF0000');

//Windshield Tear Off
case 33:
	return ($prop('GameRawData.Telemetry.dpWindshieldTearoff') == 1)
		? Array(dnr_ledLength).fill('#FFFFFF00')
		: [null];

//Fast Repair
case 34:
	return $prop('GameRawData.Telemetry.dpFastRepair') == 1
		? Array(dnr_ledLength).fill('#FF00FF00')
		: Array(dnr_ledLength).fill('#FFFF0000');

default:
	return [null];
}
}
};


function dnr_WheelButtonEffectprocedureTDM(dnr_ledLength, dnr_buttonState, dnr_WheelsButtonEffect, dnr_Press_Delay, dnr_Toggle_Blink, dnr_Toggle_BlinkFrequency) {

const TDM_colour = dnr_TDM_Colour_Hex('alt');

switch (dnr_WheelsButtonEffect) {

//No effect (Buttonstate)
case null:
case 0:
	if (($prop('DNRLEDs.WheelInputEffects') ?? true) &&
		dnr_changed_maxTime(300, dnr_buttonState))
			return Array(dnr_ledLength).fill((Math.floor(Date.now() / 100) % 2)
				? '#FF000000'
				: null);
		return [null];

//Headlights
case 1:
	return dnr_lights()
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Flasher
case 2:
	return dnr_flash()
		? Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
			? TDM_colour
			: '#FF000000')
		: [null];

//Headlights & flasher
case 3:
	if (dnr_flash()) return Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
		? TDM_colour
		: '#FF000000');
	return dnr_lights()
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Rain Light
case 4:
	return dnr_rainlights()
		? Array(dnr_ledLength).fill((Math.floor(Date.now() / 500) % 2)
			? TDM_colour
			: null)
		: [null];

//Left Indicator
case 5:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorLeft') == 1)
			return Array(dnr_ledLength).fill(TDM_colour);
	}
	else {
		if ($prop('TurnIndicatorLeft') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? TDM_colour
				: '#FF000000');
	}
	return [null];
		
//Right Indicator
case 6:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill(TDM_colour);
	}
	else {
		if ($prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? TDM_colour
				: '#FF000000');
	}
	return [null];

//Wipers
case 7:
	return dnr_wipers()
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Ignition
case 8:
	if ($prop('EngineIgnitionOn') == 1) return Array(dnr_ledLength).fill(TDM_colour);
	return [null];

//Engine Start & Ignition/Engine Start Combined
case 9:
case 10:
	if ($prop('EngineIgnitionOn') == 1 && $prop('EngineStarted') == 0)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 750) % 2)
			? TDM_colour
			: '#FF000000');
	if ($prop('EngineStarted') == 1) return Array(dnr_ledLength).fill(TDM_colour);
	return [null];

//DRS
case 11:
	if ($prop('DRSEnabled') == 1) return Array(dnr_ledLength).fill('#FF008000');

	if ($prop('DRSAvailable') == 1)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 150) % 2)
			? '#FF008000'
			: null);

	if ($prop('DNRLEDs.DRSDetectionPoint') ?? true) {
		if (dnr_DRS_detection()) return Array(dnr_ledLength).fill('#FFFFFF00');
	}
	return [null];

//KERS / ERS Lap Deploy Limit
case 12:
	KERS = dnr_KERS();

	if (KERS > 50) return Array(dnr_ledLength).fill('#FF008000');
	if (KERS > 25 && KERS <= 50) return Array(dnr_ledLength).fill('#FFFFFF00');
	if (KERS > 10 && KERS <= 25) return Array(dnr_ledLength).fill('#FFFF8C00');
	if (KERS > 0 && KERS <= 10) return Array(dnr_ledLength).fill('#FFFF0000');
	if (KERS <= 0) return [null];
	return [null];

//P2P
case 13:
	return $prop('PushToPassActive') 
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Pit Limiter
case 14:
	//Pitlane Entry warning
	if ($prop('IsInPitLane') == 1 && $prop('SpeedKmh') > 1 && $prop('PitLimiterOn') == 0)
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 125) % 2)
			? '#FFFF0000'
			: '#FF000000');
	
	//Pitlane Exit warning
	if (dnr_isdecreasing_maxTime (10000, $prop('IsInPitLane'), 'PITEXIT') &&
		$prop('IsInPitLane') == 0 &&
		$prop('PitLimiterOn') == 1)
			return Array(dnr_ledLength).fill((Math.floor(Date.now() / 125) % 2)
				? '#FF00FF00'
				: '#FF000000');
	
	//Limiter On
	if ($prop('PitLimiterOn') == 1) return Array(dnr_ledLength).fill(TDM_colour);
	return [null];

//Value Increase
case 15:
	if (dnr_isincreasing_maxTime (500, $prop('TCLevel'), 'TC')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
    	    ? Array(dnr_ledLength).fill(TDM_colour)
    	    : Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isincreasing_maxTime (500, dnr_TCCut_propertySelect(), 'TCCUT')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
        	? Array(dnr_ledLength).fill(TDM_colour)
        	: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isincreasing_maxTime (500, $prop('ABSLevel'), 'ABS')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
        	? Array(dnr_ledLength).fill(TDM_colour)
        	: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isincreasing_maxTime (500, $prop('BrakeBias'), 'BB')) {
		return Math.floor((Date.now() / 100) % 2) == 1
			? Array(dnr_ledLength).fill(TDM_colour)
			: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isincreasing_maxTime (500, $prop('EngineMap'), 'MAP')) {
		return Math.floor((Date.now() / 100) % 2) == 1
			? Array(dnr_ledLength).fill(TDM_colour)
			: Array(dnr_ledLength).fill('#00000000');
	}
	return [null];
		
//Value Decrease
case 16:
	if (dnr_isdecreasing_maxTime (500, $prop('TCLevel'), 'TC')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
        	? Array(dnr_ledLength).fill(TDM_colour)
        	: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isdecreasing_maxTime (500, dnr_TCCut_propertySelect(), 'TCCUT')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
        	? Array(dnr_ledLength).fill(TDM_colour)
        	: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isdecreasing_maxTime (500, $prop('ABSLevel'), 'ABS')) {
    	return Math.floor((Date.now() / 100) % 2) == 1
        	? Array(dnr_ledLength).fill(TDM_colour)
        	: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isdecreasing_maxTime (500, $prop('BrakeBias'), 'BB')) {
		return Math.floor((Date.now() / 100) % 2) == 1
			? Array(dnr_ledLength).fill(TDM_colour)
			: Array(dnr_ledLength).fill('#00000000');
	}
	if (dnr_isdecreasing_maxTime (500, $prop('EngineMap'), 'MAP')) {
		return Math.floor((Date.now() / 100) % 2) == 1
			? Array(dnr_ledLength).fill(TDM_colour)
			: Array(dnr_ledLength).fill('#00000000');
	}
	return [null];

//Momentary Press
case 17:
	return Array(dnr_ledLength).fill(dnr_changed_minTime(dnr_Press_Delay == 0 ? 1 : dnr_Press_Delay, dnr_buttonState)
		? TDM_colour
		: null);

//Latching Toggle
case 18:
	if (root.btn == null) root.btn = false;
	if (root.debouncestate == null) root.debouncestate = true;

	if (dnr_buttonState) {
		if (!root.debouncestate) {
			root.btn = !root.btn;
			root.debouncestate = true;
		}
	}
	else {
		root.debouncestate = false;
	}

	return root.btn
		? dnr_Toggle_Blink
			? Array(dnr_ledLength).fill((Math.floor(Date.now() / dnr_Toggle_BlinkFrequency) % 2)
				? TDM_colour
				: null)
			: Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//TDM Toggle
case 19:
	return Array(dnr_ledLength).fill(TDM_colour);

//TC Active
case 20:
	if ($prop('TCActive') == 1 || $prop('DahlDesign.TCActive') == true) {
		Array(dnr_ledLength).fill(TDM_colour);
	}
	return [null];

//ABS Active
case 21:
	if (dnr_ABSActive()) {
		Array(dnr_ledLength).fill(TDM_colour);
	}
	return [null];

//ERS Mode
case 22:
	return Array(dnr_ledLength).fill(dnr_ERS_Colour_Hex());

//Hazard Lights
case 23:
	if ($prop('DataCorePlugin.CurrentGame') == 'BeamNgDrive' || $prop('DataCorePlugin.CurrentGame') == 'ETS2' || $prop('DataCorePlugin.CurrentGame') == 'ATS') {
		if ($prop('TurnIndicatorLeft') == 1 && $prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill(TDM_colour);
	} else {
		if ($prop('TurnIndicatorLeft') == 1 && $prop('TurnIndicatorRight') == 1)
			return Array(dnr_ledLength).fill((Date.now() % 650) < 250
				? TDM_colour
				: '#FF000000');
	}
	return [null];

default:
	if ($prop('DataCorePlugin.CurrentGame') != 'IRacing') return [null];
}

//iRacing effects
if ($prop('DataCorePlugin.CurrentGame') == 'IRacing') {

switch (dnr_WheelsButtonEffect) {

//Pass Left & Pass right (Buttonstate)
case 30:
case 31:
	if (dnr_changed_minTime(1500, dnr_buttonState))
		return Array(dnr_ledLength).fill((Math.floor(Date.now() / 200) % 2)
			? TDM_colour
			: '#FF000000');

//Auto Fuel
case 32:
	return $prop('GameRawData.Telemetry.dpFuelAutoFillActive') == 1 &&
		$prop('GameRawData.Telemetry.dpFuelAutoFillEnabled') == 1
			? Array(dnr_ledLength).fill(TDM_colour)
			: [null];

//Windshield Tear Off
case 33:
	return ($prop('GameRawData.Telemetry.dpWindshieldTearoff') == 1)
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

//Fast Repair
case 34:
	return $prop('GameRawData.Telemetry.dpFastRepair') == 1
		? Array(dnr_ledLength).fill(TDM_colour)
		: [null];

default:
	return [null];
}
}
};


function dnr_WheelRotaryEffectprocedure(dnr_ledLength, dnr_allButtonStates, dnr_WheelsRotaryEffect) {

UpdateGlobalColours.update();
const { dnr_TCcolour_Hex, dnr_ABScolour_Hex, dnr_BBcolour_Hex, dnr_MAPcolour_Hex } = UpdateGlobalColours;
 
switch (dnr_WheelsRotaryEffect) {

// No effect (Buttonstate)
//case null:
//case 0:
//	if (($prop('DNRLEDs.WheelInputEffects') ?? true) &&
//		dnr_allButtonStates.some((state) => dnr_changed_maxTime(300, state))) {
//			return Array(dnr_ledLength).fill(Math.floor(Date.now() / 100) % 2
//				? '#FF000000'
//				: null);
//	}
//	return [null];

// TC (Static)
case 1:
	return Array(dnr_ledLength).fill(dnr_TCcolour_Hex);

// TC (Blinking when Active)
case 2:
	return $prop('TCActive') == 1 || $prop('DahlDesign.TCActive') == true
		? Array(dnr_ledLength).fill('#FF000000')
		: Array(dnr_ledLength).fill(dnr_TCcolour_Hex);

// ABS (Static)
case 3:
	return Array(dnr_ledLength).fill(dnr_ABScolour_Hex);

// ABS (Blinking when Active)
case 4:
	return dnr_ABSActive()
		? Array(dnr_ledLength).fill('#FF000000')
		: Array(dnr_ledLength).fill(dnr_ABScolour_Hex);

// Engine Map
case 5:
	return Array(dnr_ledLength).fill(dnr_MAPcolour_Hex);

// Brake Balance
case 6:
	return Array(dnr_ledLength).fill(dnr_BBcolour_Hex);

//ERS Mode
case 7:
	return Array(dnr_ledLength).fill(dnr_ERS_Colour_Hex());

// TC Cut (Static)
case 8:
	return Array(dnr_ledLength).fill(dnr_TCcolour_Hex);

// TC Cut (Blinking when Active)
case 9:
	return $prop('TCActive') == 1 || $prop('DahlDesign.TCActive') == true
		? Array(dnr_ledLength).fill('#FF000000')
		: Array(dnr_ledLength).fill(dnr_TCcolour_Hex);

default:
	return [null];
}
};


function dnr_WheelRotaryEffectprocedureTDM(dnr_ledLength, dnr_allButtonStates, dnr_WheelsRotaryEffect) {

const TDM_colour = dnr_TDM_Colour_Hex('alt');
 
switch (dnr_WheelsRotaryEffect) {

// No effect (Buttonstate)
//case null:
//case 0:
//	if (($prop('DNRLEDs.WheelInputEffects') ?? true) &&
//		dnr_allButtonStates.some((state) => dnr_changed_maxTime(300, state))) {
//			return Array(dnr_ledLength).fill(Math.floor(Date.now() / 100) % 2
//				? '#FF000000'
//				: null);
//	}
//	return [null];

// TC (Static)
case 1:
	return Array(dnr_ledLength).fill(TDM_colour);

// TC (Blinking when Active)
case 2:
	return $prop('TCActive') == 1 || $prop('DahlDesign.TCActive') == true
		? Array(dnr_ledLength).fill('#FF000000')
		: Array(dnr_ledLength).fill(TDM_colour);

// ABS (Static)
case 3:
	return Array(dnr_ledLength).fill(TDM_colour);

// ABS (Blinking when Active)
case 4:
	return dnr_ABSActive()
		? Array(dnr_ledLength).fill('#FF000000')
		: Array(dnr_ledLength).fill(TDM_colour);

// Engine Map
case 5:
	return Array(dnr_ledLength).fill(TDM_colour);

// Brake Balance
case 6:
	return Array(dnr_ledLength).fill(TDM_colour);

//ERS Mode
case 7:
	return Array(dnr_ledLength).fill(dnr_ERS_Colour_Hex());

// TC Cut (Static)
case 8:
	return Array(dnr_ledLength).fill(TDM_colour);

// TC Cut (Blinking when Active)
case 9:
	return $prop('TCActive') == 1 || $prop('DahlDesign.TCActive') == true
		? Array(dnr_ledLength).fill('#FF000000')
		: Array(dnr_ledLength).fill(TDM_colour);

default:
	return [null];
}
};