import * as alt from 'alt-client';
import * as native from 'natives';
import { Action } from '../enums/actions';
import { animationList } from '../enums/animationList';
import { Key } from '../enums/keys';
import { soundList } from '../enums/sounds';
import { getClosestPed } from '../lib/distance';

alt.on('keydown', async (key) => {
    if (key === Key.E) {
        if (native.isPedOnFoot(alt.Player.local.scriptID)) {
            // Check if there is a ped in range
            const closestPed = getClosestPed(alt.Player.local);

            if (closestPed.ped) {
                // Emit to server to trigger sound
                alt.emitServer(Action.PlayerWhistle, alt.Player.local.pos, alt.Player.local.scriptID);
            } else {
                // Play animation
                alt.emit(Action.PlayerPlayAnim, animationList.taxi);
                // Play sound for your self
                alt.emit(Action.PlayerPlaySound, soundList.whistle, alt.Player.local.scriptID);
            }
        }
    }
});

alt.onServer(Action.PlayerWhistle, (scriptId: number) => {
    alt.emit(Action.PlayerPlayAnim, animationList.taxi);
    alt.emit(Action.PlayerPlaySound, soundList.whistle, scriptId);
});

alt.on('keyup', (key) => {
    if (key === Key.E) {
        alt.emit(Action.PlayerClearAnim);
    }
});
