import * as alt from 'alt-client';
import * as native from 'natives';
import { getClosestVehicle } from '../lib/distance';
import { Action } from '../enums/actions';
import { Key } from '../enums/keys';

// https://rage.mp/files/file/252-perfect-for-rp-servers/
alt.on('keydown', (key) => {
    if (key === Key.SHIFT) {
        if (PushVehicle.canPush()) {
            PushVehicle.start();
        }
    }
});
alt.on('keyup', (key) => {
    if (key === Key.SHIFT) {
        PushVehicle.stop();
    }
});

class PushBrokenVehicle {
    // https://natives.altv.mp/#/0x29439776AAA00A62
    private allowedVehicleClass = [0, 1, 2, 3, 4, 5, 6, 9, 18];
    PlayerPushing: boolean;
    PlayerPushingStarted: boolean;
    Vehicle: alt.Vehicle;
    player: alt.Player;
    isVehiclePushable: boolean;
    tickInstance: number;
    tickDebugInstance: number;
    private readonly DebugPositions: boolean;
    private visibleMarkers: [{ x; y; z; color }?] = [];

    constructor() {
        this.player = alt.Player.local;
        this.isVehiclePushable = false;
        this.PlayerPushing = false;
        this.PlayerPushingStarted = false;
        this.DebugPositions = true;
    }

    canPush() {
        this.Vehicle = getClosestVehicle(this.player, 10).vehicle;
        if (!this.Vehicle) {
            alt.log('Cant find a car');
            return false;
        }
        // Make sure its on the ground
        if (!native.isVehicleOnAllWheels(this.Vehicle.scriptID)) {
            alt.log('isVehicleOnAllWheels', false);
            return false;
        }

        if (!(native.getVehicleClass(this.Vehicle.scriptID) in this.allowedVehicleClass)) {
            return false;
        }

        /**
         -4000: Engine is destroyed
         0 and below: Engine catches fire and health rapidly declines
         300: Engine is smoking and losing functionality
         1000: Engine is perfect
         */
        // Check if engine is not runing and health is belo 1000
        // if (
        //     native.getVehicleEngineHealth(this.Vehicle.scriptID) > 300 ||
        //     native.getIsVehicleEngineRunning(this.Vehicle.scriptID)
        // ) {
        //     alt.log('getVehicleEngineHealth', native.getVehicleEngineHealth(this.Vehicle.scriptID));
        //     return false;
        // }

        // Check if handbrake is off
        if (this.Vehicle.handbrakeActive) {
            alt.log('Vehicle.handbrakeActive', this.Vehicle.handbrakeActive);
            return false;
        }

        // Check if its not locked `Vehicle.lockState`
        // TODO: bug https://github.com/altmp/altv-issues/issues/737
        if (native.getVehicleDoorLockStatus(this.Vehicle.scriptID) !== 1) {
            alt.log('native.getVehicleDoorLockStatus', native.getVehicleDoorLockStatus(this.Vehicle.scriptID));
            return false;
        }

        const vehicleSize = this.vehicleLayout(this.Vehicle);

        /*
        {
            "front":{"x":-0.8793556094169617,"y":-1.9629359245300293},
            "back":{"x":0.879355788230896,"y":2.1384572982788086},
            "center":{"x":-1047.3475341796875,"y":-2714.539794921875},
            "size":{
                "lengthX":1.7587113976478577,
                "lengthY":4.101393222808838,
                "min":{
                    "x":-0.8793556094169617,
                    "y":-1.9629359245300293
                },
                "max":{
                    "x":0.879355788230896,
                    "y":2.1384572982788086
                },
                "z":-0.8242944478988647
             }
         }
         */
        alt.log(JSON.stringify(vehicleSize));

        const distanceFront = Math.round(
            native.vdist2(
                vehicleSize.front.x,
                vehicleSize.front.y,
                this.Vehicle.pos.z,
                this.player.pos.x,
                this.player.pos.y,
                this.player.pos.z
            ) / 3
        );

        const distanceBack = Math.round(
            native.vdist2(
                vehicleSize.back.x,
                vehicleSize.back.y,
                this.Vehicle.pos.z,
                this.player.pos.x,
                this.player.pos.y,
                this.player.pos.z
            ) / 3
        );

        this.Vehicle.setMeta('IsInFront', distanceFront < distanceBack);
        this.Vehicle.setMeta('distanceFront', distanceFront);
        this.Vehicle.setMeta('distanceBack', distanceBack);
        this.Vehicle.setMeta('vehicleSize', vehicleSize);

        alt.log('Get distance', 'Front', distanceFront, 'Back', distanceBack);
        this.isVehiclePushable =
            (distanceFront <= 2 || distanceBack <= 2) && vehicleSize.size.lengthY * vehicleSize.size.lengthX <= 25;

        return this.isVehiclePushable;
    }

    start() {
        alt.log('Try to push', this.isVehiclePushable, !this.PlayerPushing, !this.player.vehicle);

        if (this.isVehiclePushable && !this.PlayerPushing && !this.player.vehicle) {
            alt.log('success', JSON.stringify(this.Vehicle.getMeta('vehicleSize')));
            this.PlayerPushing = true;
            native.freezeEntityPosition(this.player.scriptID, true);
            if (this.Vehicle.getMeta('IsInFront')) {
                native.attachEntityToEntity(
                    this.Vehicle.scriptID,
                    6286,
                    0.0,
                    this.Vehicle.getMeta('vehicleSize').size.max.x + 0.35,
                    this.Vehicle.getMeta('vehicleSize').size.max.y + 0.35,
                    this.Vehicle.getMeta('vehicleSize').size.z + 0.95,
                    0.0,
                    0.0,
                    180.0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    true
                );
            } else {
                native.attachEntityToEntity(
                    this.Vehicle.scriptID,
                    6286,
                    0.0,
                    this.Vehicle.getMeta('vehicleSize').size.min.y - 0.6,
                    this.Vehicle.getMeta('vehicleSize').size.min.y - 0.6,
                    this.Vehicle.getMeta('vehicleSize').size.z + 0.95,
                    0.0,
                    0.0,
                    0.0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    true
                );
            }

            native.requestAnimDict('missfinale_c2ig_11');
            native.taskPlayAnim(
                this.player.scriptID,
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
            native.freezeEntityPosition(this.player.scriptID, false);

            this.PlayerPushing = true;
            this.PlayerPushingStarted = false;

            alt.setTimeout(() => {
                alt.emitServer(Action.PlayerPushStart, this.Vehicle, this.player);
                this.PlayerPushingStarted = true;
            }, 400);
        }

        if (
            this.PlayerPushingStarted &&
            native.isEntityPlayingAnim(this.player.scriptID, 'missfinale_c2ig_11', 'pushcar_offcliff_m', 3)
        ) {
            alt.on('keydown', (key) => {
                if (key === Key.A) {
                    alt.log('Turn left');
                    native.taskVehicleTempAction(this.player.scriptID, this.Vehicle.scriptID, 11, 500);
                }

                if (key === Key.D) {
                    alt.log('Turn right');
                    // Vehicle.setSteeringAngle(-40); (Not supported yet)
                    native.taskVehicleTempAction(this.player.scriptID, this.Vehicle.scriptID, 10, 500);
                }
            });

            if (native.hasEntityCollidedWithAnything(this.Vehicle.scriptID)) {
                alt.log('hasEntityCollidedWithAnything');
                native.setVehicleOnGroundProperly(this.Vehicle.scriptID, 5.0);
            }

            if (!this.Vehicle.getMeta('IsInFront')) {
                this.tickInstance = alt.everyTick(() => {
                    native.setVehicleForwardSpeed(this.Vehicle.scriptID, 0.7);
                });
            } else {
                this.tickInstance = alt.everyTick(() => {
                    native.setVehicleForwardSpeed(this.Vehicle.scriptID, -0.7);
                });
            }
        }
    }

    stop() {
        alt.log('Stop pushing');
        alt.clearEveryTick(this.tickInstance);
        alt.clearEveryTick(this.tickDebugInstance);
        native.detachEntity(this.player.scriptID, true, false);
        native.stopAnimTask(this.player.scriptID, 'missfinale_c2ig_11', 'pushcar_offcliff_m', 2);
        alt.setTimeout(function () {
            native.freezeEntityPosition(alt.Player.local.scriptID, false);
        }, 100);
        this.PlayerPushing = false;
        this.isVehiclePushable = false;
    }

    vehicleLayout(Vehicle) {
        const [, vehicleMin, vehicleMax] = native.getModelDimensions(Vehicle.model, null, null);
        alt.log(JSON.stringify(vehicleMin), JSON.stringify(vehicleMax));

        const vehicleRotation = Vehicle.rot;
        // const Xwidth = 0 - vehicleMin.x + vehicleMax.x;
        const Xwidth = Math.hypot(vehicleMin.x - vehicleMax.x);

        // const Ywidth = 0 - vehicleMin.y + vehicleMax.y;
        const Ywidth = Math.hypot(vehicleMin.y - vehicleMax.y);
        const degree = ((vehicleRotation.z + 180) * Math.PI) / 180;

        alt.log('~g', JSON.stringify(Vehicle.pos));
        const newDegrees = this.rotateRect(
            degree,
            Vehicle.pos.x,
            Vehicle.pos.y,
            Vehicle.pos.x - vehicleMax.x,
            Vehicle.pos.y - vehicleMax.y,
            Xwidth,
            Ywidth
        );

        // const frontX = newDegrees[0][0] + (newDegrees[1][0] - newDegrees[0][0]) / 2;
        // const frontY = newDegrees[0][1] + (newDegrees[1][1] - newDegrees[0][1]) / 2;
        //
        // const bottomX = newDegrees[2][0] + (newDegrees[3][0] - newDegrees[2][0]) / 2;
        // const bottomY = newDegrees[2][1] + (newDegrees[3][1] - newDegrees[2][1]) / 2;

        /*
        {
            "front":{"x":-0.8793556094169617,"y":-1.9629359245300293},
            "back":{"x":0.879355788230896,"y":2.1384572982788086},
            "center":{"x":-1047.3475341796875,"y":-2714.539794921875},
            "size":{
                "lengthX":1.7587113976478577,
                "lengthY":4.101393222808838,
                "min":{
                    "x":-0.8793556094169617,
                    "y":-1.9629359245300293
                },
                "max":{
                    "x":0.879355788230896,
                    "y":2.1384572982788086
                },
                "z":-0.8242944478988647
             }
         }
         */

        // const frontX = newDegrees[0][0] + (newDegrees[1][0] - newDegrees[0][0]) / 2;
        // const frontX = vehicleMin.x;
        // const frontY = vehicleMin.y;
        //
        // const bottomX = vehicleMax.x;
        // const bottomY = vehicleMax.y;

        alt.log(JSON.stringify(newDegrees, null, 2));
        const frontX = newDegrees[0][0] + (newDegrees[1][0] - newDegrees[0][0]) / 2;
        const frontY = newDegrees[0][1] + (newDegrees[1][1] - newDegrees[0][1]) / 2;

        const bottomX = newDegrees[2][0] + (newDegrees[3][0] - newDegrees[2][0]) / 2;
        const bottomY = newDegrees[2][1] + (newDegrees[3][1] - newDegrees[2][1]) / 2;

        if (this.DebugPositions) {
            this.visibleMarkers = [];
            this.visibleMarkers.push({
                x: frontX,
                y: frontY,
                z: Vehicle.pos.z,
                color: 20,
            });
            this.visibleMarkers.push({
                x: bottomX,
                y: bottomY,
                z: Vehicle.pos.z,
                color: 20,
            });
            this.visibleMarkers.push({
                x: Vehicle.pos.x,
                y: Vehicle.pos.y,
                z: Vehicle.pos.z,
                color: 255,
            });
            alt.log('~g~display debug');
            this.tickDebugInstance = alt.everyTick(() => {
                this.visibleMarkers.forEach((marker) => this.placeMarker(marker.x, marker.y, marker.z, marker.color));
            });
        }

        return {
            front: { x: frontX, y: frontY },
            frontCoords: { x: frontX + Vehicle.pos.x, y: frontY + Vehicle.pos.y, z: Vehicle.pos.z },
            back: { x: bottomX, y: bottomY },
            backCoords: { x: bottomX + Vehicle.pos.x, y: bottomY + Vehicle.pos.y, z: Vehicle.pos.z },
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

    rotateRect(angle, ox, oy, x, y, w, h) {
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

    placeMarker(x, y, z, color) {
        native.drawMarker(
            2,
            x,
            y,
            z + 2,
            0,
            0,
            0,
            0,
            180,
            0,
            1,
            1,
            1,
            255,
            128,
            color,
            50,
            false,
            true,
            1,
            false,
            null,
            null,
            false
        );
        return true;
    }
}

export const PushVehicle = new PushBrokenVehicle();
