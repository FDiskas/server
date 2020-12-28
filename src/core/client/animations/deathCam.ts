import * as alt from 'alt-client';
import * as native from 'natives';
import { Action } from '../enums/actions';

let camera;
let endCam;
let camTimer;
let camTimer2;

alt.on('resourceStop', () => {
    native.doScreenFadeIn(500);
    native.clearPedTasks(alt.Player.local.scriptID);
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    if (camTimer) {
        alt.clearTimeout(camTimer);
    }
    if (camTimer2) {
        alt.clearTimeout(camTimer2);
    }
});

// TODO: Upon death - fly camera to the sky - nd keep watching from top
alt.onServer(Action.PlayerPlayDeathCam, (player) => {
    alt.emit('camera:SetupSky', alt.Player.local.pos);
    alt.setTimeout(() => {
        alt.emit('camera:FinishSky');
    }, 4000);
});

alt.on('camera:SetupSky', (pos) => {
    camera = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', pos.x, pos.y - 3, pos.z + 1, 0, 0, 0, 90, true, 0);

    native.setCamActive(camera, true);
    native.renderScriptCams(true, true, 4000, false, false, 0);
});

alt.on('camera:FinishSky', () => {
    camTimer = alt.setTimeout(() => {
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        const pos = alt.Player.local.pos;
        endCam = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', pos.x, pos.y, pos.z + 20, 0, 0, 0, 120, true, 0);

        native.pointCamAtEntity(endCam, alt.Player.local.scriptID, 0, 0, 0, false);
        native.setCamActiveWithInterp(endCam, camera, 30000, 10000, 10000);
        native.renderScriptCams(true, true, 5000, false, false, 0);
        native.clearPedTasks(alt.Player.local.scriptID);
        native.doScreenFadeOut(60000);
        camTimer2 = alt.setTimeout(() => {
            native.destroyAllCams(true);
            native.renderScriptCams(false, false, 0, false, false, 0);
            native.freezeEntityPosition(alt.Player.local.scriptID, false);
        }, 60000);
    }, 4000);
});
