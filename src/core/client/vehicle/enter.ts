import * as alt from 'alt-client';
import native from 'natives';
import { Action } from '../enums/actions';
import { distance, getClosestVehicle } from '../lib/distance';

alt.on(Action.PlayerEnterVehicle, () => {
    const closest = getClosestVehicle(alt.Player.local);

    let sitting = false;
    const minDist = 2;

    const seatsList = [
        'seat_f',
        'seat_r',
        'seat_dside_f',
        'seat_pside_f',
        'seat_dside_r',
        'seat_pside_r',
        'seat_dside_r1',
        'seat_dside_r2',
        'seat_dside_r3',
        'seat_dside_r4',
        'seat_dside_r5',
        'seat_dside_r6',
        'seat_dside_r7',
        'seat_pside_r1',
        'seat_pside_r2',
        'seat_pside_r3',
        'seat_pside_r4',
        'seat_pside_r5',
        'seat_pside_r6',
        'seat_pside_r7',
    ];
    let closestSeat = 0;
    let closestDist = 5;
    // Filter only available seats
    let availableSeats = seatsList.filter(
        (seatName) => native.getEntityBoneIndexByName(closest.vehicle.scriptID, seatName) !== -1
    );

    availableSeats.forEach((seat, seatIndex) => {
        const seatBone = native.getEntityBoneIndexByName(closest.vehicle.scriptID, seat);
        const seatPos = native.getWorldPositionOfEntityBone(closest.vehicle.scriptID, seatBone);
        const seatDist = distance({ x: seatPos.x, y: seatPos.y, z: seatPos.z }, alt.Player.local.pos);

        if (closestDist > seatDist) {
            closestSeat = seatIndex - 1;
            closestDist = seatDist;
        }
    });

    if (closestDist <= minDist) {
        if (!native.areAnyVehicleSeatsFree(closest.vehicle.scriptID)) {
            return;
        }

        native.taskEnterVehicle(alt.Player.local.scriptID, closest.vehicle.scriptID, 10000, closestSeat, 1.0, 0, 0);
        sitting = true;

        if (sitting && native.getVehicleDoorLockStatus(closest.vehicle.scriptID) == 4) {
            alt.setTimeout(() => {
                native.clearPedTasksImmediately(alt.Player.local.scriptID);
            }, 1500);
        }
    }
});
