import * as alt from 'alt-client';
import native from 'natives';
import { Font } from './enums/font';
import { distance } from './lib/distance';

const namedTags = alt.everyTick(renderNameTags);
alt.on('resourceStop', () => {
    alt.clearEveryTick(namedTags);
});

function renderNameTags() {
    for (let player of alt.Player.all) {
        // if (player != alt.Player.local && player.scriptID) {
        if (
            distance(player.pos, alt.Player.local.pos) < 50
            // TODO: If in the same car - display tags
            // && native.isPedSittingInAnyVehicle(alt.Player.local.scriptID) ===
            //     native.isPedSittingInAnyVehicle(player.scriptID)
        ) {
            native.requestPedVisibilityTracking(player.scriptID);
            if (native.isTrackedPedVisible(player.scriptID)) {
                let scale =
                    (1 / distance(native.getGameplayCamCoord(), alt.Player.local.pos)) *
                    20 *
                    ((1 / native.getGameplayCamFov()) * 100);
                native.setTextScale(0, 0.04 * scale);
                native.setDrawOrigin(player.pos.x, player.pos.y, player.pos.z + 1, false);
                native.beginTextCommandDisplayText('STRING');
                native.setTextFont(Font.ChaletComprimeCologne);
                native.setTextOutline();
                native.setTextCentre(true);
                native.setTextProportional(true);
                native.setTextColour(255, 255, 255, 255);
                native.addTextComponentSubstringPlayerName(`${player.name} (${player.id})`);
                native.endTextCommandDisplayText(0, 0, 0);
                native.clearDrawOrigin();
            }
        }
        // }
    }
}
