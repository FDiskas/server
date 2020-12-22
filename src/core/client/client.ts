import * as alt from 'alt-client';
import native from 'natives';
import { distance, getClosestVehicle } from './lib/distance';
import './nametags';
import './handling/hansUp';
import './handling/crouch';
import './animations/drunk';
// import './intro/newjoiners';
// import './object/placement';
import './weather/weather';
import './AI/takeFromAirport';

import { Key } from './enums/keys';
import { loadModelAsync } from './lib/async';
import { Action } from './enums/actions';

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
        native.taskEnterVehicle(alt.Player.local.scriptID, closest, 5000, 2, 1.0, 2, 0);
    }
});
alt.on('keyup', async (key) => {
    if (key == 'G'.charCodeAt(0)) {
        // native.setPedConfigFlag(alt.Player.local.scriptID, 429, true); // disable start engine
        // native.setPedConfigFlag(alt.Player.local.scriptID, 241, true); // disable stop engine
        // native.setPedConfigFlag(alt.Player.local.scriptID, 184, true); // disable auto shuffle

        const closest = getClosestVehicle(alt.Player.local);

        let sitting = false;
        const minDist = 5;

        // const doorsList = ['door_dside_f', 'door_pside_f', 'door_pside_r', 'door_dside_r'];
        const seatsList = ['seat_pside_f', 'seat_pside_r', 'seat_dside_r'];
        const plyPos = alt.Player.local.pos;
        let closestDoor = 2;
        let closestDist = 1000;
        // const allSeats = native.getVehicleModelNumberOfSeats(closest);
        for (let i = 0; i < seatsList.length; i++) {
            const curr = seatsList[i];
            const doorBone = native.getEntityBoneIndexByName(closest.vehicle.scriptID, curr);
            const doorPos = native.getWorldPositionOfEntityBone(closest.vehicle.scriptID, doorBone);
            const doorDist = distance({ x: doorPos.x, y: doorPos.y, z: doorPos.z }, plyPos);

            if (!closestDoor || closestDist > doorDist) {
                closestDoor = i;
                closestDist = doorDist;
                // Don't keep looping if you litterally touch the door since no other door will be closer
                if (doorDist <= 0.1)
                    // don't know if .1 will be enough
                    break;
            }
        }

        // const boneFRDoor = native.getEntityBoneIndexByName(closest, 'door_dside_r'); //Front Left
        // const boneFLDoor = native.getEntictyBoneIndexByName(closest, 'door_dside_f'); //Front Right
        // const boneBRDoor = native.getEntityBoneIndexByName(closest, 'door_pside_r');
        // const boneBLDoor = native.getEntityBoneIndexByName(closest, 'door_pside_f');

        // const posFRDoor = native.getWorldPositionOfEntityBone(closest, boneFRDoor);
        // const posFLDoor = native.getWorldPositionOfEntityBone(closest, boneFLDoor);
        // const posBRDoor = native.getWorldPositionOfEntityBone(closest, boneBRDoor);
        // const posBLDoor = native.getWorldPositionOfEntityBone(closest, boneBLDoor);

        // const distFLDoor = native.getDistanceBetweenCoords(
        //     posFLDoor.x,
        //     posFLDoor.y,
        //     posFLDoor.z,
        //     alt.Player.local.pos.x,
        //     alt.Player.local.pos.y,
        //     alt.Player.local.pos.z,
        //     true
        // );

        // alt.log(JSON.stringify({ minDist, distFLDoor }));

        alt.log(`Closest Door Index: ${closestDoor}`);
        alt.log(`Closest Distance: ${closestDist}`);
        if (closestDist <= minDist) {
            if (!native.areAnyVehicleSeatsFree(closest.vehicle.scriptID)) {
                alt.log('no free seats left');

                return;
            }

            if (native.isVehicleSeatFree(closest.vehicle.scriptID, closestDoor, false)) {
                native.taskEnterVehicle(
                    alt.Player.local.scriptID,
                    closest.vehicle.scriptID,
                    5000,
                    closestDoor,
                    1.0,
                    0,
                    0
                );
                sitting = true;
            }

            if (sitting && native.getVehicleDoorLockStatus(closest.vehicle.scriptID) == 4) {
                alt.setTimeout(() => {
                    native.clearPedTasksImmediately(alt.Player.local.scriptID);
                }, 1500);
            }
        }

        // native.taskEnterVehicle(alt.Player.local.scriptID, closest, 0, 0, 1.0, 1, 0);
        // native.setPedIntoVehicle(alt.Player.local.scriptID, closest, -2);

        const busDriverStart = {
            x: -1366.612,
            y: 56.541,
            z: 54.098,
            model: 's_m_y_airworker',
            heading: 45.0,
        };

        const busDriverEnd = {
            x: 693.068,
            y: 671.056,
            z: 128.911,
        };

        loadModelAsync(busDriverStart.model).then(() => {
            const busDriver = native.createPed(
                1,
                native.getHashKey(busDriverStart.model),
                busDriverStart.x,
                busDriverStart.y,
                busDriverStart.z,
                busDriverStart.heading,
                false,
                false
            );
            alt.on('resourceStop', () => {
                native.deleteVehicle(
                    getClosestVehicle({ pos: native.getPedBoneCoords(busDriver, 31086, 0, 0, 0) }).vehicle.scriptID
                );
                native.deletePed(busDriver);
            });

            native.giveWeaponToPed(busDriver, 0x1b06d571, 100, false, true);

            native.requestAnimSet('move_m@drunk@verydrunk');

            if (native.hasAnimSetLoaded('move_m@drunk@verydrunk')) {
                native.setPedMovementClipset(busDriver, 'move_m@drunk@verydrunk', 0x3e800000);
                native.setPedConfigFlag(busDriver, 100, true);
            }

            native.taskWanderStandard(busDriver, 10.0, 10);

            native.taskVehicleDriveToCoordLongrange(
                busDriver,
                closest.vehicle.scriptID,
                busDriverEnd.x,
                busDriverEnd.y,
                busDriverEnd.z,
                120,
                117,
                15
            );
        });
    }
});

alt.on('consoleCommand', async (cmd, ...args) => {
    if (cmd == 'bus') {
    }
    if (cmd == 'drunk') {
        alt.emit(Action.PlayerGetDrunk);
    }
    if (cmd == 'clone') {
        alt.log('player cloned');

        const ped = native.clonePed(
            alt.Player.local.scriptID,
            native.getEntityHeading(alt.Player.local.scriptID),
            true,
            true
        );

        if (native.isPedSittingInAnyVehicle(alt.Player.local.scriptID)) {
            native.setPedIntoVehicle(ped, alt.Player.local.vehicle.scriptID, -2);
        }

        const closest = native.getClosestVehicle(
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z,
            50,
            0,
            70
        );
        if (closest) {
            native.setPedIntoVehicle(ped, closest, -1);
        }

        const target = {
            x: -1291.7142333984375,
            y: 83.43296813964844,
            z: 54.8916015625,
        };

        native.taskWanderStandard(ped, 10.0, 10);
        native.taskVehicleDriveToCoordLongrange(
            ped,
            alt.Player.local.vehicle.scriptID,
            target.x,
            target.y,
            target.z,
            60,
            5,
            10
        );

        native.giveWeaponToPed(ped, 0x1b06d571, 100, false, true);

        // native.setPedIsDrunk(ped, true);

        // native.explodePedHead(ped, 0x1b06d571);

        // // Wind
        // native.setWindSpeed(12.0);

        // // playPedRingtone
        // native.playPedRingtone('Remote_Ring', ped, true);

        // // Money
        // native.networkInitializeCash(100, 100);
        // native.networkSpentCashDrop(100, true, true);
        // native.setPedMoney(alt.Player.local.scriptID, 500);
        // native.createMoneyPickups(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, 100, 100, 0);
        // // alt.log(native.getPedMoney(alt.Player.local.scriptID));
        // native.requestAnimSet('move_m@drunk@verydrunk');

        // if (native.hasAnimSetLoaded('move_m@drunk@verydrunk')) {
        //     native.setPedMovementClipset(ped, 'move_m@drunk@verydrunk', 0x3e800000);
        //     native.setPedConfigFlag(ped, 100, true);
        // }

        // native.setEntityAsMissionEntity(ped, true, false);
        native.giveWeaponToPed(ped, 0x1b06d571, 100, false, true);
        native.freezeEntityPosition(ped, false);
        native.setPedCanRagdoll(ped, true);
        native.setPedAlertness(ped, 3);
        // native.setPedAllowedToDuck(ped, true);
        // native.setPedCanRagdollFromPlayerImpact(ped, true);
        // native.taskSetBlockingOfNonTemporaryEvents(ped, false);
        native.setBlockingOfNonTemporaryEvents(ped, false);
        native.setPedFleeAttributes(ped, 0, true);
        native.setEntityInvincible(ped, false);
        native.setPedSeeingRange(ped, 50);

        alt.on('resourceStop', () => {
            native.deletePed(ped);
        });
    }
});

alt.on('keyup', async (key) => {
    if (key == Key.B) {
        // alt.emitServer('test');
        alt.emit('PlacingModule:setObject', 'bus');
    }
});

/**
export function serverEvent<Event extends keyof alt.IServerEvent>(event?: Event | string) {
    return function (target: any, property: Event | string) {
        if (!event) event = property;
        alt.on(event, target[property]);
    };
}

export function clientEvent(event?: string) {
    return function (target: any, property: string) {
        if (!event) event = property;
        alt.onClient(event, target[property]);
    };
}
*/
