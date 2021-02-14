import * as alt from 'alt-client';
import native from 'natives';
import { Action } from '../../core/client/enums/actions';

alt.log(`Hello from example Client`);

let electric = [
    2445973230, // neon
    1560980623, // airtug
    1147287684, // caddy
    3164157193, // dilettante
    2400073108, // surge
    544021352, // khamelion
    2672523198, // voltic
    1031562256, // tezeract
    1392481335, // cyclone
    2765724541, // raiden
];

let mainHud = null;
let handbrakeActive = false;

alt.onServer(Action.PlayerConnected, (player) => {
    mainHud = new alt.WebView('http://resource/client/html/index.html');
    mainHud.unfocus();
    // mainHud.focus();
    alt.log('HUD Loaded.');
    // alt.showCursor(true);
});

alt.on('keydown', (key) => {
    if (key === 32) handbrakeActive = true; // space
});
alt.on('keyup', (key) => {
    if (key === 32) handbrakeActive = false; // space
});

alt.everyTick(() => {
    let vehicle = alt.Player.local.vehicle;
    if (vehicle) {
        let lightState = 0;
        let [, nightLights, longLights] = native.getVehicleLightsState(vehicle.scriptID, true, false);
        if (nightLights) lightState = 1;
        if (longLights) lightState = 2;
        mainHud.emit('speedometer:data', {
            gear: vehicle.gear,
            rpm: parseInt((vehicle.rpm * random(9900, 10000)).toFixed(0)),
            speed: parseInt((native.getEntitySpeed(vehicle.scriptID) * 3.6).toFixed(0)),
            isElectric: electric.includes(vehicle.model),
            isEngineRunning: native.getIsVehicleEngineRunning(vehicle.scriptID), //  vehicle.engineOn
            isVehicleOnAllWheels: native.isVehicleOnAllWheels(vehicle.scriptID),
            handbrakeActive: handbrakeActive, //vehicle.handbrakeActive,
            lightState: lightState,
            fuelPercentage: vehicle.nightlightOn,
            engineHealth: vehicle.engineHealth,
        });
    } else {
        mainHud.emit('speedometer:data', null);
    }
});

function random(min, max) {
    return min + Math.random() * (max - min);
}
