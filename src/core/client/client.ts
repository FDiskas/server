import * as alt from 'alt-client';
import native from 'natives';
import './nametags';
import './handling/handsUp';
import './handling/crouch';
import './handling/openMap';
import './animations';
import './sounds';
import './core/keyBindings';
// import './intro/newjoiners';
// import './weather/weather';
import './AI/takeFromAirport';
import './vehicle/doors';
import './vehicle/enter';
import './core/notifications';

///// ADMIN
// import './vehicle/tags';

import { Action } from './enums/actions';
import { notificationMessage, NotificationType } from './core/notifications';

const disableIdleCamera = alt.setInterval(() => {
    native.invalidateIdleCam();
    native._0x9E4CFFF989258472(); // Disable vehicle idle camera
}, 19000);

alt.on('resourceStop', () => {
    if (disableIdleCamera) {
        alt.clearEveryTick(disableIdleCamera);
    }
});

alt.on('consoleCommand', async (cmd, ...args) => {
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

        if (alt.Player.local.vehicle && native.isPedSittingInAnyVehicle(alt.Player.local.scriptID)) {
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
        if (alt.Player.local.vehicle) {
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
        }

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

        // const whistle = alt.setInterval(() => {
        //     alt.emitServer(Action.PlayerWhistle, native.getPedBoneCoords(ped, 0x796e, 0, 0, 0), ped);
        // }, 5000);

        alt.on('resourceStop', () => {
            // if (whistle) {
            //     alt.clearInterval(whistle);
            // }
            alt.log('Resouce core stopped');
            native.deletePed(ped);
        });
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
