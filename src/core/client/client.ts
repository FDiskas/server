import * as alt from 'alt-client';
import native from 'natives';
import './nametags';
import './handling/handsUp';
import './handling/crouch';
import './animations/drunk';
import './core/keyBindings';
import './intro/newjoiners';
// import './object/placement';
// import './weather/weather';
import './AI/takeFromAirport';
import './vehicle/doors';
import './vehicle/enter';

///// ADMIN
import './vehicle/tags';

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
