import * as alt from 'alt-client';
import native from 'natives';
import { distance, getClosestVehicle } from './lib/distance';
import './nametags';
import './handling/handsUp';
import './handling/crouch';
import './animations/drunk';
import './core/keyBindings';
import './intro/newjoiners';
// import './object/placement';
// import './weather/weather';
import './AI/takeFromAirport';

import { Key } from './enums/keys';
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
alt.on(Action.PlayerEnterVehicle, () => {
    const closest = getClosestVehicle(alt.Player.local);

    let sitting = false;
    const minDist = 2;

    /*
        -1 = driver
        0 = passenger - door_pside_f
        1 = left back seat - door_dside_r
        2 = right back seat - door_pside_r
        3 = outside left 
        4 = outside right

        door_dside_f,   //Door left, front
        door_dside_r,   //Door left, back
        door_pside_f,   //Door right, front
        door_pside_r,   //Door right, back
        */
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
        alt.log(`Seat: ${seat}, Index: ${seatIndex - 1}`);
    });

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
        alt.log(`Supistos durys: ${closestSeat} Dist: ${closestDist}`);
        if (!native.areAnyVehicleSeatsFree(closest.vehicle.scriptID)) {
            alt.log('no free seats left');

            return;
        }

        native.taskEnterVehicle(alt.Player.local.scriptID, closest.vehicle.scriptID, 10000, closestSeat, 1.0, 0, 0);
        // native.setPedIntoVehicle(alt.Player.local.scriptID, closest.vehicle.scriptID, closestSeat - 1);
        sitting = true;

        if (sitting && native.getVehicleDoorLockStatus(closest.vehicle.scriptID) == 4) {
            alt.setTimeout(() => {
                native.clearPedTasksImmediately(alt.Player.local.scriptID);
            }, 1500);
        }
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
            alt.log('Resouce core stopped');
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

const vehicleTick = alt.everyTick(renderNameTags);
alt.on('resourceStop', () => {
    alt.clearEveryTick(vehicleTick);
});

function renderNameTags() {
    const seatsList = [
        'seat_f',
        'seat_r',
        'seat_dside_f',
        'seat_dside_r',
        'seat_pside_f',
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

    for (let vehicle of alt.Vehicle.all) {
        ///////////////////////////////////
        // const allSeats = native.getVehicleModelNumberOfSeats(vehicle.model);
        // let availableSeats = seatsList.filter(
        //     (seatName) => native.getEntityBoneIndexByName(vehicle.scriptID, seatName) !== -1
        // );

        for (let i = 0; i < seatsList.length; i++) {
            const seatBone = native.getEntityBoneIndexByName(vehicle.scriptID, seatsList[i]);
            if (seatBone !== -1) {
                const seatPos = native.getWorldPositionOfEntityBone(vehicle.scriptID, seatBone);
                // alt.log(JSON.stringify({ seatBone, seatPos }));

                let scale =
                    (1 / distance(native.getGameplayCamCoord(), { ...seatPos })) *
                    20 *
                    ((1 / native.getGameplayCamFov()) * 100);
                native.setTextScale(0, 0.04 * scale);
                native.setDrawOrigin(seatPos.x, seatPos.y, seatPos.z, false);
                native.beginTextCommandDisplayText('STRING');
                native.setTextFont(4);
                native.setTextOutline();
                native.setTextCentre(true);
                native.setTextProportional(true);
                native.setTextColour(255, 255, 255, 255);
                native.addTextComponentSubstringPlayerName(`${seatsList[i]} (${i - 1})`);
                native.endTextCommandDisplayText(0, 0, 0);
                native.clearDrawOrigin();
            }
        }

        ////////////////////////////////////////
    }
}
