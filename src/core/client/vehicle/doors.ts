import * as alt from 'alt-client';
import * as native from 'natives';
import { Action } from '../enums/actions';
import { Key } from '../enums/keys';
import { distance, getClosestVehicle } from '../lib/distance';

const windowList = [
    'window_lf',
    'window_rf',
    'window_lr',
    'window_rr',
    'window_lm',
    'window_rm',
    'window_lf1',
    'window_lf2',
    'window_lf3',
    'window_rf1',
    'window_rf2',
    'window_rf3',
    'window_lr1',
    'window_lr2',
    'window_lr3',
    'window_rr1',
    'window_rr2',
    'window_rr3',
];

alt.on(Action.PlayerToggleCarWindow, () => {
    if (alt.Player.local.vehicle) {
        let availableWindows = windowList.filter(
            (windowName) => native.getEntityBoneIndexByName(alt.Player.local.vehicle.scriptID, windowName) !== -1
        );

        const data = { window: -1, distance: 0 };
        for (const windowIndex in availableWindows) {
            const windowBone = native.getEntityBoneIndexByName(
                alt.Player.local.vehicle.scriptID,
                availableWindows[windowIndex]
            );
            const windowPos = native.getWorldPositionOfEntityBone(alt.Player.local.vehicle.scriptID, windowBone);
            const windowDist = distance(alt.Player.local.pos, { ...windowPos });

            if (windowDist < data.distance || data.distance == 0) {
                data.window = parseInt(windowIndex);
                data.distance = windowDist;
            }
        }

        alt.emitServer(Action.PlayerToggleCarWindow, data.window);
    }
});

alt.on(Action.PlayerToggleCarDoor, () => {
    const doorList = {
        handle_dside_f: -1,
        handle_pside_f: 0,
        handle_pside_r: 1,
        handle_dside_r: 2,
    };
    const plyPos = alt.Player.local.pos;
    const vehicle = getClosestVehicle(alt.Player.local).vehicle;
    let closestDoor;
    let closestDist = 1000;

    Object.keys(doorList).forEach((handle) => {
        const doorBone = native.getEntityBoneIndexByName(vehicle.scriptID, handle);
        const doorPos = native.getWorldPositionOfEntityBone(vehicle.scriptID, doorBone);
        const doorDist = distance({ x: doorPos.x, y: doorPos.y, z: doorPos.z }, plyPos);

        if (!closestDoor || closestDist > doorDist) {
            closestDoor = handle;
            closestDist = doorDist;
            if (doorDist <= 0.1) return;
        }
    });
    alt.emitServer(Action.PlayerToggleCarDoor, vehicle.id, doorList[closestDoor]);
});

// TODO: remove workaround https://github.com/altmp/altv-issues/issues/737
alt.onServer(Action.PlayerOpenCarWindow, (windowIndex) => {
    native.rollDownWindow(alt.Player.local.vehicle.scriptID, windowIndex);
});
alt.onServer(Action.PlayerCloseCarWindow, (windowIndex) => {
    native.rollUpWindow(alt.Player.local.vehicle.scriptID, windowIndex);
});
alt.onServer(Action.PlayerOpenCarDoor, (vehicle: alt.Vehicle, doorIndex) => {
    native.taskOpenVehicleDoor(alt.Player.local.scriptID, vehicle.scriptID, 10000, doorIndex, 1.0);
});
alt.onServer(Action.PlayerCloseCarDoor, (vehicle: alt.Vehicle, windowIndex) => {
    native.playVehicleDoorCloseSound(vehicle.scriptID, windowIndex);
});
