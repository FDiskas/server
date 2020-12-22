import * as alt from 'alt-client';
import native from 'natives';

import { WeaponHash } from '../enums/weaponHash';
import { DrivingStyle } from '../enums/drivingStyle';
import { Action } from '../enums/actions';
import { loadModelAsync } from '../lib/async';

alt.onServer(Action.TakeBusFromAirport, async (vehicle: alt.Vehicle) => {
    const driverStart = {
        x: -1016.289,
        y: -2759.372,
        z: 14.165,
        model: 's_m_y_airworker',
        heading: 45.0,
    };

    const driverDest = {
        x: 456.035,
        y: -644.921,
        z: 28.359,
    };

    const garage = {
        x: 441.69,
        y: -585.894,
        z: 28.5,
    };

    // Create Bus driver
    let pedDriver = null;
    let timerToBusStation = null;
    let timerToGarage = null;

    loadModelAsync(driverStart.model).then(() => {
        pedDriver = native.createPed(
            1,
            native.getHashKey(driverStart.model),
            driverStart.x,
            driverStart.y,
            driverStart.z,
            driverStart.heading,
            false,
            false
        );
        alt.on('resourceStop', () => {
            native.deletePed(pedDriver);
            native.deleteVehicle(alt.Player.local.getMeta('welcomeBus'));
        });

        native.giveWeaponToPed(pedDriver, WeaponHash.Pistol, 100, false, true);

        native.requestAnimSet('move_m@drunk@verydrunk');

        if (native.hasAnimSetLoaded('move_m@drunk@verydrunk')) {
            native.setPedMovementClipset(pedDriver, 'move_m@drunk@verydrunk', 0.0);
            native.setPedConfigFlag(pedDriver, 100, true);
            native.setPedIsDrunk(pedDriver, true);
        }

        native.taskWanderStandard(pedDriver, 10.0, 10);
        native.taskEnterVehicle(pedDriver, vehicle.scriptID, 60000, -1, 1.0, 0, 0);
    });

    alt.on('enteredVehicle', (vehicle, seat) => {
        if (seat !== 1) {
            alt.clearTimeout(timerToBusStation);
            alt.clearTimeout(timerToGarage);
            timerToBusStation = native.taskVehicleDriveToCoordLongrange(
                pedDriver,
                vehicle.scriptID,
                driverDest.x,
                driverDest.y,
                driverDest.z,
                220.0,
                DrivingStyle.perfect,
                5.0
            );
        }
    });

    alt.on('leftVehicle', (vehicle: alt.Vehicle, seat: number) => {
        if (seat !== 1) {
            alt.emit(Action.TakeBusToGarage, pedDriver, vehicle);
        }
    });

    alt.on(Action.TakeBusToGarage, (driver, bus: alt.Vehicle) => {
        timerToGarage = alt.setTimeout(() => {
            alt.log('Take Bus to garage');
            native.taskVehicleDriveToCoordLongrange(
                driver,
                bus.scriptID,
                garage.x,
                garage.y,
                garage.z,
                220.0,
                DrivingStyle.perfect,
                5.0
            );

            alt.setTimeout(() => {
                native.deletePed(pedDriver);
                alt.emitServer(Action.TakeBusToGarage, bus);
            }, 45000);
        }, 15000);
    });
});
