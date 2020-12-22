import * as alt from 'alt-client';
import native from 'natives';

let crouched = false;
alt.on('keydown', (key) => {
    if (key == 17) {
        //ctrl
        native.disableControlAction(0, 36, true);
        if (
            !native.isPlayerDead(alt.Player.local.scriptID) &&
            !native.isPedSittingInAnyVehicle(alt.Player.local.scriptID)
        ) {
            if (!native.isPauseMenuActive()) {
                native.requestAnimSet('move_ped_crouched');
                if (crouched) {
                    native.clearPedTasks(alt.Player.local.scriptID);
                    alt.setTimeout(() => {
                        if (alt.Player.local.getMeta('drunk')) {
                            native.setPedMovementClipset(alt.Player.local.scriptID, 'move_m@drunk@verydrunk', 1.0);
                        } else {
                            native.resetPedMovementClipset(alt.Player.local.scriptID, 0.45);
                        }
                        crouched = false;
                    }, 200);
                } else {
                    native.setPedMovementClipset(alt.Player.local.scriptID, 'move_ped_crouched', 0.45);
                    crouched = true;
                }
            }
        }
    }
});
