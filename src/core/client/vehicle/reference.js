const player = mp.players.local;

class PushBrokenDownClient {
    constructor() {
        this.config = {
            AllowVehicleClass: [0, 1, 2, 3, 4, 5, 6, 9, 18], // These are the normal vehicles in the game classes - to disable it, set it to false
            MaxVehicleCubedSize: 25, // This is the vehicle length * width - as an idea an ambulance is 21
            LockHandbrakeProtection: false, // If set - you can't push a locked vehicle (Theft prevention or ditching cars)
            EngineProtection: false, // If set - you can only push if the enginer is turned off
            VehicleHealthProtection: false, // Must be less than 1000 or false which de-activates checking vehicle health
            PushEventName: false, // Set this to send an event to your server with the relevant Vehicle and Player attached (ie 'pushing_car')
            LabelsDisplayed: true, // Show labels near the pushing positions when close enough
            DebugPositions: false, // View pushing positions as markers so they are more visible
            AllowVehicleSteering: true, // Allows the player to turn the wheels of the vehicle using A and D keys
        };

        // To change it from Shift or any other codes within this script - simply get the code from https://keycode.info/

        // DebugSection
        this.markersShown = false;
        this.visibleMarkers = [null, null, null];

        // Player animation control
        this.PlayerPushingStarted = false;
        this.PlayerPushing = false;
        this.shownLabels = false;

        mp.events.add({
            render: () => {
                this.canPushVehicle();
            },
        });
    }

    placeMarker(x, y, z, color) {
        return mp.markers.new(0, [x, y, z], 1, {
            direction: [x, y, z],
            rotation: new mp.Vector3(0, 0, 0),
            color: [color, 0, color, 255],
            visible: true,
            dimension: 0,
        });
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

    vehicleLayout(Vehicle) {
        const sizeofVehicle = mp.game.gameplay.getModelDimensions(Vehicle.model);
        const vehicleRotation = Vehicle.getRotation(2);
        const Xwidth = 0 - sizeofVehicle.min.x + sizeofVehicle.max.x;
        const Ywidth = 0 - sizeofVehicle.min.y + sizeofVehicle.max.y;
        const degree = ((vehicleRotation.z + 180) * Math.PI) / 180;

        const newDegrees = this.rotateRect(
            degree,
            Vehicle.position.x,
            Vehicle.position.y,
            Vehicle.position.x - sizeofVehicle.max.x,
            Vehicle.position.y - sizeofVehicle.max.y,
            Xwidth,
            Ywidth
        );

        const frontX = newDegrees[0][0] + (newDegrees[1][0] - newDegrees[0][0]) / 2;
        const frontY = newDegrees[0][1] + (newDegrees[1][1] - newDegrees[0][1]) / 2;

        const bottomX = newDegrees[2][0] + (newDegrees[3][0] - newDegrees[2][0]) / 2;
        const bottomY = newDegrees[2][1] + (newDegrees[3][1] - newDegrees[2][1]) / 2;

        if (this.config.DebugPositions) {
            if (this.visibleMarkers[0] !== null) {
                this.visibleMarkers[0].destroy();
                this.visibleMarkers[1].destroy();
                this.visibleMarkers[2].destroy();
            }
            this.visibleMarkers[0] = this.placeMarker(frontX, frontY, Vehicle.position.z, 20);
            this.visibleMarkers[1] = this.placeMarker(bottomX, bottomY, Vehicle.position.z, 20);
            this.visibleMarkers[2] = this.placeMarker(Vehicle.position.x, Vehicle.position.y, Vehicle.position.z, 255);
        }
        return {
            front: { x: frontX, y: frontY },
            back: { x: bottomX, y: bottomY },
            center: { x: Vehicle.position.x, y: Vehicle.position.y },
            size: {
                lengthX: Xwidth,
                lengthY: Ywidth,
                min: { x: sizeofVehicle.min.x, y: sizeofVehicle.min.y },
                max: { x: sizeofVehicle.max.x, y: sizeofVehicle.max.y },
                z: sizeofVehicle.min.z,
            },
        };
    }

    canPushVehicle() {
        if (this.config.LabelsDisplayed === true) {
            // Destroy any recent labels
            if (this.shownLabels !== false) {
                this.shownLabels.destroy();
                this.shownLabels = false;
            }
        }

        const idVehicle = mp.game.vehicle.getClosestVehicle(
            player.position.x,
            player.position.y,
            player.position.z,
            10,
            0,
            70
        );
        if (idVehicle === false) return false;

        const Vehicle = mp.vehicles.atHandle(idVehicle);
        const vehClass = Vehicle.getClass();

        if (!Vehicle.isOnAllWheels())
            // Make sure its on the ground
            return false;

        if (
            this.config.AllowVehicleClass !== null &&
            this.config.AllowVehicleClass !== false &&
            this.config.AllowVehicleClass.indexOf(vehClass) === -1
        )
            return false;

        if (this.config.EngineProtection === true && Vehicle.engine === true) return false;

        if (this.config.LockHandbrakeProtection === true && Vehicle.locked === true) return false;

        if (
            this.config.VehicleHealthProtection !== false &&
            Vehicle.getEngineHealth() >= this.config.VehicleHealthProtection
        )
            return false;

        const vehicleSize = this.vehicleLayout(Vehicle);

        const distanceFront = Math.round(
            mp.game.system.vdist2(
                vehicleSize.front.x,
                vehicleSize.front.y,
                Vehicle.position.z,
                player.position.x,
                player.position.y,
                player.position.z
            ) / 3
        );

        const distanceBack = Math.round(
            mp.game.system.vdist2(
                vehicleSize.back.x,
                vehicleSize.back.y,
                Vehicle.position.z,
                player.position.x,
                player.position.y,
                player.position.z
            ) / 3
        );

        Vehicle.IsInFront = distanceFront < distanceBack;
        Vehicle.distanceFront = distanceFront;
        Vehicle.distanceBack = distanceBack;
        Vehicle.vehicleSize = vehicleSize;

        if (
            (distanceFront <= 2 || distanceBack <= 2) &&
            vehicleSize.size.lengthY * vehicleSize.size.lengthX <= this.config.MaxVehicleCubedSize
        ) {
            if (this.config.LabelsDisplayed === true) {
                if (this.PlayerPushing !== true) {
                    if (Vehicle.IsInFront) {
                        this.shownLabels = mp.labels.new(
                            'Press ~r~[SHIFT]~g~ to push this broken down car',
                            new mp.Vector3(vehicleSize.front.x, vehicleSize.front.y, Vehicle.position.z),
                            {
                                los: true,
                                font: 1,
                                drawDistance: 5,
                            }
                        );
                    } else {
                        this.shownLabels = mp.labels.new(
                            'Press ~r~[SHIFT]~g~ to push this broken down car',
                            new mp.Vector3(vehicleSize.back.x, vehicleSize.back.y, Vehicle.position.z),
                            {
                                los: true,
                                font: 1,
                                drawDistance: 5,
                            }
                        );
                    }
                }
            }

            if (mp.keys.isDown(16) === true) {
                if (!this.PlayerPushing && !player.isInAnyVehicle(false)) {
                    this.PlayerPushing = true;
                    player.freezePosition(true);
                    if (Vehicle.IsInFront) {
                        player.attachTo(
                            Vehicle.handle,
                            6286,
                            0.0,
                            Vehicle.vehicleSize.size.max.y + 0.35,
                            Vehicle.vehicleSize.size.z + 0.95,
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
                        player.attachTo(
                            Vehicle.handle,
                            6286,
                            0.0,
                            Vehicle.vehicleSize.size.min.y - 0.6,
                            Vehicle.vehicleSize.size.z + 0.95,
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

                    mp.game.streaming.requestAnimDict('missfinale_c2ig_11');
                    player.taskPlayAnim(
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
                    player.freezePosition(false);

                    this.PlayerPushing = true;
                    this.PlayerPushingStarted = false;

                    setTimeout(() => {
                        if (this.config.PushEventName !== false)
                            mp.events.callRemote(this.config.PushEventName, Vehicle, player);
                        this.PlayerPushingStarted = true;
                    }, 400);
                }

                if (this.PlayerPushingStarted && player.isPlayingAnim('missfinale_c2ig_11', 'pushcar_offcliff_m', 3)) {
                    const LeftArrow = mp.keys.isDown(65);
                    if (LeftArrow && this.config.AllowVehicleSteering) {
                        // Vehicle.setSteeringAngle(40); (Not supported yet)
                        player.taskVehicleTempAction(Vehicle.handle, 11, 500);
                    }

                    const RightArrow = mp.keys.isDown(68);
                    if (RightArrow && this.config.AllowVehicleSteering) {
                        // Vehicle.setSteeringAngle(-40); (Not supported yet)
                        player.taskVehicleTempAction(Vehicle.handle, 10, 500);
                    }

                    if (Vehicle.hasCollidedWithAnything()) {
                        Vehicle.setOnGroundProperly();
                    }

                    if (!Vehicle.IsInFront) {
                        Vehicle.setForwardSpeed(1);
                    } else {
                        Vehicle.setForwardSpeed(-1);
                    }
                }
            } else if (this.PlayerPushing === true) {
                player.detach(true, false);
                player.stopAnimTask('missfinale_c2ig_11', 'pushcar_offcliff_m', 2);
                setTimeout(function () {
                    player.freezePosition(false);
                }, 100);
                this.PlayerPushing = false;
            }
        }
    }
}

const veh = new PushBrokenDownClient();
