import * as alt from 'alt-client';
import * as native from 'natives';
import { getClosestVehicle } from '../lib/distance';

// https://rage.mp/files/file/252-perfect-for-rp-servers/
let everyTick;
alt.on('push', () => {
    const Vehicle = getClosestVehicle(alt.Player.local, 3).vehicle;
    if (Vehicle) {
        alt.log(Vehicle);
        native.requestAnimDict('missfinale_c2ig_11');
        native.taskPlayAnim(
            alt.Player.local.scriptID,
            'missfinale_c2ig_11',
            'pushcar_offcliff_m',
            2.0,
            -8.0,
            -1,
            35,
            0,
            false,
            false,
            false
        );

        everyTick = alt.everyTick(() => {
            native.setVehicleForwardSpeed(Vehicle.scriptID, 0.7);
        });
    }
});

alt.on('keydown', (key) => {
    if (key === 16) {
        alt.emit('push');
    }
});

alt.on('keyup', (key) => {
    if (key === 16) {
        alt.clearEveryTick(everyTick);
        native.clearPedTasks(alt.Player.local.scriptID);
    }
});
