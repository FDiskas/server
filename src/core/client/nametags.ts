import * as alt from 'alt-client';
import native from 'natives';
import { distance } from './lib/distance';

alt.everyTick(renderNameTags);

function renderNameTags() {
    for (let player of alt.Player.all) {
        if (player != alt.Player.local && player.scriptID) {
            if (
                distance(player.pos, alt.Player.local.pos) < 50 ||
                // TODO: If in the same car - display tags
                native.isPedSittingInAnyVehicle(alt.Player.local.scriptID) ===
                    native.isPedSittingInAnyVehicle(player.scriptID)
            ) {
                native.requestPedVisibilityTracking(player.scriptID);
                if (native.isTrackedPedVisible(player.scriptID)) {
                    native.setDrawOrigin(player.pos.x, player.pos.y, player.pos.z + 1, false);
                    native.beginTextCommandDisplayText('STRING');
                    native.setTextFont(4);
                    native.setTextDropShadow();
                    native.setTextCentre(true);
                    native.setTextScale(0.3, 0.3);
                    native.setTextProportional(true);
                    native.setTextColour(255, 255, 255, 255);
                    native.addTextComponentSubstringPlayerName(`${player.name} (${player.id})`);
                    native.endTextCommandDisplayText(0, 0, 0);
                    native.clearDrawOrigin();
                }
            }
        }
    }
}
