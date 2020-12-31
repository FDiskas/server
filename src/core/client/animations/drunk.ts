import * as alt from 'alt-client';
import native from 'natives';
import { Action } from '../enums/actions';

let times = 0;
let turnWeals = 0;
let turnTick = 0;

alt.on(Action.PlayerGetDrunk, async () => {
    native.requestAnimSet('move_m@drunk@verydrunk');
    alt.Player.local.setMeta('drunk', true);

    if (native.hasAnimSetLoaded('move_m@drunk@verydrunk')) {
        native.setPedMovementClipset(alt.Player.local.scriptID, 'move_m@drunk@verydrunk', 1.0);
        native.setPedConfigFlag(alt.Player.local.scriptID, 32, true);
    }

    native.animpostfxStopAll();
    native.animpostfxPlay('DrugsMichaelAliensFightIn', 0, false);

    // FIXME: Ugly
    alt.setTimeout(() => {
        native.animpostfxPlay('DrugsMichaelAliensFight', 0, true);
        alt.setTimeout(() => {
            native.animpostfxPlay('DrugsMichaelAliensFightOut', 0, false);
            alt.setTimeout(() => {
                stopDrunk();
            }, 10000);
        }, 60000);
    }, 5000);
});
// Make handling a vehicles hard
alt.on('enteredVehicle', (vehicle, seatNumber) => {
    if (seatNumber == 1 && alt.Player.local.getMeta('drunk')) {
        turnWeals = alt.setInterval(() => {
            var side = Math.random() > 0.5 ? -1 : 1; // Random Left or Right
            turnTick = alt.everyTick(() => {
                if (times >= 40) {
                    alt.clearEveryTick(turnTick);
                    times = 0;
                }
                native.setVehicleSteerBias(vehicle.scriptID, side);
                times++;
            });
        }, 10000);
    }
});
alt.on('leftVehicle', () => {
    stopDrunk();
});

alt.on('resourceStop', () => {
    stopDrunk();
});

const stopDrunk = () => {
    native.animpostfxStopAll();
    native.resetPedMovementClipset(alt.Player.local.scriptID, 0.0);
    alt.Player.local.setMeta('drunk', false);
    if (turnTick) alt.clearEveryTick(turnTick);
    if (turnWeals) alt.clearInterval(turnWeals);
};
