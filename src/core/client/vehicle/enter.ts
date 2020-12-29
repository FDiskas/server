import * as alt from 'alt-client';
import native from 'natives';
import { Action } from '../enums/actions';
import { distance, getClosestVehicle } from '../lib/distance';

alt.on(Action.PlayerEnterVehicle, () => {
    let sitting = false;

    const seatList = {
        seat_f: -1,
        seat_r: 0,
        seat_dside_f: -1,
        seat_pside_f: 0,
        seat_dside_r: 1,
        seat_pside_r: 2,
        seat_dside_r1: 3,
        seat_dside_r2: 5,
        seat_dside_r3: 7,
        seat_dside_r4: 9,
        seat_dside_r5: 11,
        seat_dside_r6: 13,
        seat_dside_r7: 15,
        seat_pside_r1: 4,
        seat_pside_r2: 6,
        seat_pside_r3: 8,
        seat_pside_r4: 10,
        seat_pside_r5: 12,
        seat_pside_r6: 14,
        seat_pside_r7: 16,
    };
    const plyPos = alt.Player.local.pos;
    const vehicle = getClosestVehicle(alt.Player.local, 6).vehicle;
    if (!vehicle) {
        return;
    }
    let closestDoor;
    let closestDist = 1000;
    let availableBones = Object.keys(seatList).filter(
        (seatName) => native.getEntityBoneIndexByName(vehicle.scriptID, seatName) !== -1
    );

    availableBones.forEach((handle) => {
        const doorBone = native.getEntityBoneIndexByName(vehicle.scriptID, handle);
        const doorPos = native.getWorldPositionOfEntityBone(vehicle.scriptID, doorBone);
        const doorDist = distance({ x: doorPos.x, y: doorPos.y, z: doorPos.z }, plyPos);

        if (!closestDoor || closestDist > doorDist) {
            closestDoor = handle;
            closestDist = doorDist;
            if (doorDist <= 0.1) return;
        }
    });

    if (!native.areAnyVehicleSeatsFree(vehicle.scriptID)) {
        return;
    }

    alt.log(
        `native.taskEnterVehicle(${alt.Player.local.scriptID}, ${vehicle.scriptID}, 10000, ${seatList[closestDoor]}, 1.0, 1, 0)`
    );
    //35 - _PED_FLAG_PUT_ON_MOTORCYCLE_HELMET
    //184 - _PED_FLAG_DISABLE_SHUFFLING_TO_DRIVER_SEAT
    //429 - _PED_FLAG_DISABLE_STARTING_VEH_ENGINE
    native.setPedConfigFlag(alt.Player.local.scriptID, 184, true);
    native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
    native.taskEnterVehicle(alt.Player.local.scriptID, vehicle.scriptID, 10000, seatList[closestDoor], 1.0, 1, 0);
    sitting = true;

    if (sitting && native.getVehicleDoorLockStatus(vehicle.scriptID) == 4) {
        alt.setTimeout(() => {
            native.clearPedTasksImmediately(alt.Player.local.scriptID);
        }, 1500);
    }
});
