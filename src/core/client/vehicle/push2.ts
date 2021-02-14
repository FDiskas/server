import * as alt from 'alt-client';
import * as native from 'natives';
import { distance, getClosestVehicle } from '../lib/distance';
import { Key, NativeKey } from '../enums/keys';
import { Action } from '../enums/actions';
import { animationList } from '../enums/animationList';

const localPlayer = alt.Player.local;
var vehPush = {
    first: undefined,
    second: undefined,
    vehicle: undefined,
    isInFront: undefined,
    tickInstance: undefined,
};
vehPush.first = new alt.Vector3(0, 0, 0);
vehPush.second = new alt.Vector3(5, 5, 5);
vehPush.vehicle = null;
vehPush.isInFront = true;
alt.on('startVehPushing', function (Vehicle) {
    if (Vehicle && Vehicle.valid && Vehicle.scriptID > 0) {
        var distanceBetweenCoords = distance(localPlayer.pos, Vehicle.pos);
        var [, min] = native.getModelDimensions(native.getEntityModel(Vehicle.scriptID), vehPush.first, vehPush.second);

        if (distanceBetweenCoords < 4) {
            vehPush.vehicle = Vehicle;
            var entityForwardVector = native.getEntityForwardVector(Vehicle.scriptID);

            if (
                native.getDistanceBetweenCoords(
                    Vehicle.pos.x + entityForwardVector.x,
                    Vehicle.pos.y + entityForwardVector.y,
                    Vehicle.pos.z + entityForwardVector.z,
                    localPlayer.pos.x,
                    localPlayer.pos.y,
                    localPlayer.pos.z,
                    true
                ) >
                native.getDistanceBetweenCoords(
                    Vehicle.pos.x + entityForwardVector.x * -1,
                    Vehicle.pos.y + entityForwardVector.y * -1,
                    Vehicle.pos.z + entityForwardVector.z * -1,
                    localPlayer.pos.x,
                    localPlayer.pos.y,
                    localPlayer.pos.z,
                    true
                )
            ) {
                vehPush.isInFront = false;
                native.attachEntityToEntity(
                    localPlayer.scriptID,
                    Vehicle.scriptID,
                    native.getPedBoneIndex(localPlayer.scriptID, 0x188e),
                    0,
                    min.y - 0.3,
                    min.z + 1,
                    0,
                    0,
                    0,
                    true,
                    true,
                    true,
                    true,
                    2,
                    true
                );
            } else {
                vehPush.isInFront = true;
                native.attachEntityToEntity(
                    localPlayer.scriptID,
                    Vehicle.scriptID,
                    native.getPedBoneIndex(localPlayer.scriptID, 0x188e),
                    0,
                    min.y * -1 + 0.1,
                    min.z + 1,
                    0,
                    0,
                    0xb4,
                    true,
                    true,
                    true,
                    true,
                    2,
                    true
                );
            }
            alt.emit(Action.PlayerPlayAnim, animationList.push);
            vehPush.tickInstance = alt.everyTick(function () {
                if (vehPush.vehicle && vehPush.vehicle.valid) {
                    if (native.isDisabledControlPressed(0, 34)) {
                        native.taskVehicleTempAction(localPlayer.scriptID, vehPush.vehicle.scriptID, 11, 0x3e8);
                    }
                    if (native.isDisabledControlPressed(0, 9)) {
                        native.taskVehicleTempAction(localPlayer.scriptID, vehPush.vehicle.scriptID, 10, 0x3e8);
                    }
                    if (vehPush.isInFront) {
                        native.setVehicleForwardSpeed(vehPush.vehicle.scriptID, -1);
                    } else {
                        native.setVehicleForwardSpeed(vehPush.vehicle.scriptID, 1);
                    }
                    if (native.hasEntityCollidedWithAnything(vehPush.vehicle.scriptID)) {
                        native.setVehicleOnGroundProperly(vehPush.vehicle.scriptID, 5.0);
                    }
                    native.disableControlAction(0, NativeKey.InputEnter, true);
                    native.disableControlAction(0, NativeKey.InputJump, true);
                }
            });
        } else {
            alt.emit('stopPushVehicle', Vehicle);
        }
    } else {
        alt.emit('stopPushVehicle', Vehicle);
    }
});

alt.on('keydown', (key) => {
    if (key === Key.SHIFT) {
        alt.emit('startVehPushing', getClosestVehicle(alt.Player.local, 10).vehicle);
    }
});
alt.on('keyup', function (key) {
    if (key == Key.SHIFT) {
        alt.clearEveryTick(vehPush.tickInstance);
        alt.emit('stopPushVehicle', vehPush.vehicle);
    }
});
alt.on('stopPushVehicle', function () {
    if (vehPush.vehicle !== null) {
        alt.clearEveryTick(vehPush.tickInstance);
        native.detachEntity(localPlayer.scriptID, true, true);
        native.stopAnimTask(localPlayer.scriptID, 'missfinale_c2ig_11', 'pushcar_offcliff_m', 2);
        native.stopAnimTask(localPlayer.scriptID, 'missfinale_c2ig_11', 'pushcar_offcliff_f', 2);
        vehPush.vehicle = null;
        vehPush.isInFront = true;
    }
});
