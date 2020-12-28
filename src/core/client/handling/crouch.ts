import * as alt from 'alt-client';
import native from 'natives';
import { Key } from '../enums/keys';

let crouched = false;
alt.on('keydown', (key) => {
    if (alt.isMenuOpen() || native.isPauseMenuActive()) return;
    if (key == Key.Crl) {
        if (
            !native.isPlayerDead(alt.Player.local.scriptID) &&
            !native.isPedSittingInAnyVehicle(alt.Player.local.scriptID)
        ) {
            //ctrl
            native.disableControlAction(0, 36, true);
            native.requestAnimSet('move_ped_crouched');

            native.setPedMovementClipset(alt.Player.local.scriptID, 'move_ped_crouched', 0.45);
            crouched = true;
        }
    }
});

alt.on('keyup', (key) => {
    if (key == Key.Crl && crouched) {
        native.clearPedTasks(alt.Player.local.scriptID);
        native.enableControlAction(0, 36, true);
        crouched = false;

        if (alt.Player.local.getMeta('drunk')) {
            native.setPedMovementClipset(alt.Player.local.scriptID, 'move_m@drunk@verydrunk', 1.0);
        } else {
            native.resetPedMovementClipset(alt.Player.local.scriptID, 0.45);
        }
    }
});
