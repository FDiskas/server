import * as alt from 'alt-client';
import native from 'natives';
import { Action } from '../enums/actions';

alt.on(Action.PlayerGetDrunk, async () => {
    let times = 0;
    let turnWeals = 0;
    let turnTick = 0;
    native.requestAnimSet('move_m@drunk@verydrunk');

    if (native.hasAnimSetLoaded('move_m@drunk@verydrunk')) {
        alt.Player.local.setMeta('drunk', true);
        native.setPedMovementClipset(alt.Player.local.scriptID, 'move_m@drunk@verydrunk', 1.0);
        native.setPedConfigFlag(alt.Player.local.scriptID, 32, true);
    }

    native.animpostfxStopAll();
    native.animpostfxPlay('DrugsMichaelAliensFightIn', 0, false);
    alt.setTimeout(() => {
        native.animpostfxPlay('DrugsMichaelAliensFight', 0, true);
        alt.setTimeout(() => {
            native.animpostfxPlay('DrugsMichaelAliensFightOut', 0, false);
            alt.setTimeout(() => {
                native.animpostfxStopAll();
                native.resetPedMovementClipset(alt.Player.local.scriptID, 0.0);
                alt.Player.local.setMeta('drunk', false);
                try {
                    alt.clearEveryTick(turnTick);
                    alt.clearInterval(turnWeals);
                } catch (e) {}
            }, 10000);
        }, 60000);
    }, 5000);

    // Make handling a vehicles hard
    alt.on('enteredVehicle', (vehicle, seatNumber) => {
        if (seatNumber == 1 && alt.Player.local.getMeta('drunk')) {
            turnWeals = alt.setInterval(() => {
                var side = Math.random() > 0.5 ? -1 : 1; // Random Left or Right
                turnTick = alt.everyTick(() => {
                    if (times >= 50) {
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
        try {
            alt.clearEveryTick(turnTick);
            alt.clearInterval(turnWeals);
        } catch (e) {}
    });
});
