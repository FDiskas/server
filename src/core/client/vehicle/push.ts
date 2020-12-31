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
function rotateRect(angle, ox, oy, x, y, w, h) {
    const xAx = Math.cos(angle); // x axis x
    const xAy = Math.sin(angle); // x axis y
    x -= ox; // move rectangle onto origin
    y -= oy;
    return [
        [
            // return array holding the resulting points
            x * xAx - y * xAy + ox, // Get the top left rotated position
            x * xAy + y * xAx + oy, // and move it back to the origin
        ],
        [
            (x + w) * xAx - y * xAy + ox, // Get the top right rotated position
            (x + w) * xAy + y * xAx + oy,
        ],
        [
            (x + w) * xAx - (y + h) * xAy + ox, // Get the bottom right rotated position
            (x + w) * xAy + (y + h) * xAx + oy,
        ],
        [
            x * xAx - (y + h) * xAy + ox, // Get the bottom left rotated position
            x * xAy + (y + h) * xAx + oy,
        ],
    ];
}

function vehicleLayout(Vehicle) {
    const [_, vehicleMin, vehicleMax] = native.getModelDimensions(Vehicle.model, null, null);
    const vehicleRotation = Vehicle.rot;
    const Xwidth = 0 - vehicleMin.x + vehicleMin.x;
    const Ywidth = 0 - vehicleMax.y + vehicleMax.y;
    const degree = ((vehicleRotation.z + 180) * Math.PI) / 180;
    alt.log(degree);

    alt.log(JSON.stringify(Vehicle.pos));
    const newDegrees = rotateRect(
        degree,
        Vehicle.pos.x,
        Vehicle.pos.y,
        Vehicle.pos.x - vehicleMax.x,
        Vehicle.pos.y - vehicleMax.y,
        Xwidth,
        Ywidth
    );

    const frontX = newDegrees[0][0] + (newDegrees[1][0] - newDegrees[0][0]) / 2;
    const frontY = newDegrees[0][1] + (newDegrees[1][1] - newDegrees[0][1]) / 2;

    const bottomX = newDegrees[2][0] + (newDegrees[3][0] - newDegrees[2][0]) / 2;
    const bottomY = newDegrees[2][1] + (newDegrees[3][1] - newDegrees[2][1]) / 2;

    return {
        front: { x: frontX, y: frontY },
        back: { x: bottomX, y: bottomY },
        center: { x: Vehicle.pos.x, y: Vehicle.pos.y },
        size: {
            lengthX: Xwidth,
            lengthY: Ywidth,
            min: { x: vehicleMin.x, y: vehicleMin.y },
            max: { x: vehicleMax.x, y: vehicleMax.y },
            z: vehicleMin.z,
        },
    };
}
