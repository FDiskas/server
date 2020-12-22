import * as alt from 'alt-client';
import native from 'natives';

alt.on('keyup', async (key) => {
    if (key == 'B'.charCodeAt(0)) {
        const closest = native.getClosestVehicle(
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z,
            50,
            0,
            70
        );
        native.taskEnterVehicle(alt.Player.local.scriptID, closest, 5000, 1, 1.0, 2, 0);
    }
});
