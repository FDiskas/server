import * as alt from 'alt-client';
import * as native from 'natives';

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

let handbrakeActive = false;
alt.on('keydown', (key) => {
    if (key === 32) handbrakeActive = true; // space
});
alt.on('keyup', (key) => {
    if (key === 32) handbrakeActive = false; // space
});

let webView = null;
alt.everyTick(() => {
    let vehicle = alt.Player.local.vehicle;
    if (vehicle) {
        if (!webView) {
            webView = new alt.WebView('http://resource/client/html/speedometer.html');
            webView.focus();
        } else {
            let lightState = 0;
            let [dayLights, nightLights, longLights] = native.getVehicleLightsState(vehicle.scriptID, true, false);
            if (nightLights) lightState = 1;
            if (longLights) lightState = 2;
            webView.emit('speedometer:data', {
                gear: vehicle.gear,
                rpm: parseInt((vehicle.rpm * 10000).toFixed(0)),
                speed: parseInt((native.getEntitySpeed(vehicle.scriptID) * 3.6).toFixed(0)),
                isElectric: electric.includes(vehicle.model),
                isEngineRunning: native.getIsVehicleEngineRunning(vehicle.scriptID), //  vehicle.engineOn
                isVehicleOnAllWheels: native.isVehicleOnAllWheels(vehicle.scriptID),
                handbrakeActive: handbrakeActive, //vehicle.handbrakeActive,
                lightState: lightState,
                fuelPercentage: vehicle.nightlightOn,
                engineHealth: vehicle.engineHealth,
            });
        }
    } else {
        if (webView) {
            webView.destroy();
            webView = null;
        }
    }
});
