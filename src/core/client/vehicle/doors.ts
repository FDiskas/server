import * as alt from 'alt-client';
import * as native from 'natives';
import { Action } from '../enums/actions';
import { soundList } from '../enums/sounds';
import { distance, getClosestVehicle } from '../lib/distance';

alt.on(Action.PlayerToggleCarWindow, () => {
    if (alt.Player.local.vehicle) {
        alt.emitServer(Action.PlayerToggleCarWindow, alt.Player.local.seat - 1);
    }
});

alt.on(Action.PlayerToggleCarDoor, () => {
    /**
    0 = Front Left Door
    1 = Front Right Door
    2 = Back Left Door
    3 = Back Right Door
    4 = Hood
    5 = Trunk (boot)
    6 = Back
    7 = Back2
     */
    const doorList = {
        handle_dside_f: -1,
        window_lf: -1,
        seat_dside_f: -1,
        door_dside_f: -1,

        handle_pside_f: 0,
        seat_pside_f: 0,
        window_rf: 0,
        door_pside_f: 0,

        handle_pside_r: 1,
        window_rr: 1,
        seat_pside_r: 1,
        door_pside_r: 1,

        handle_dside_r: 2,
        seat_dside_r: 2,
        window_lr: 2,
        door_dside_r: 2,

        boot: 5,
        windscreen_r: 5,
        reversinglight_l: 5,

        engine: 4,
        bonnet: 4,
    };
    const plyPos = alt.Player.local.pos;
    const vehicle = getClosestVehicle(alt.Player.local, 10).vehicle;
    let closestDoor;
    let closestDist = 2;
    let availableBones = Object.keys(doorList).filter(
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
    if (closestDist <= 1.5) {
        alt.emitServer(Action.PlayerToggleCarDoor, vehicle.id, doorList[closestDoor]);
    }
});

// TODO: remove workaround https://github.com/altmp/altv-issues/issues/737
alt.onServer(Action.PlayerOpenCarWindow, (windowIndex) => {
    native.rollDownWindow(alt.Player.local.vehicle.scriptID, windowIndex);
    alt.emitServer(Action.PlayerPlaySound, soundList.openWindow, alt.Player.local.scriptID);
});
alt.onServer(Action.PlayerCloseCarWindow, (windowIndex) => {
    native.rollUpWindow(alt.Player.local.vehicle.scriptID, windowIndex);
    alt.emitServer(Action.PlayerPlaySound, soundList.openWindow, alt.Player.local.scriptID);
});
alt.onServer(Action.PlayerOpenCarDoor, (vehicle: alt.Vehicle, doorIndex) => {
    if (doorIndex >= 4) {
        native.setVehicleDoorOpen(vehicle.scriptID, doorIndex, true, true);
    } else {
        native.taskOpenVehicleDoor(alt.Player.local.scriptID, vehicle.scriptID, 10000, doorIndex, 1.0);
    }
});
alt.onServer(Action.PlayerCloseCarDoor, (vehicle: alt.Vehicle, doorIndex) => {
    native.playVehicleDoorCloseSound(vehicle.scriptID, doorIndex);
});
