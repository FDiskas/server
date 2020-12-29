import * as alt from 'alt-client';
import native from 'natives';

import { DrivingStyle } from '../enums/drivingStyle';
import { Action } from '../enums/actions';
import { loadModelAsync } from '../lib/async';
import { PedHash } from '../enums/pedHash';

alt.onServer('closestRoad', () => {
    const player = alt.Player.local;
    const [_, coords, direction] = native.getClosestRoad(
        player.pos.x,
        player.pos.y,
        player.pos.z,
        1.0,
        0,
        {
            x: player.pos.x + 30,
            y: player.pos.y + 30,
            z: player.pos.z,
        },
        {
            x: player.pos.x - 30,
            y: player.pos.y - 30,
            z: player.pos.z,
        },
        0,
        0,
        0,
        true
    );

    alt.emitServer('prepareMedic', coords, direction);
});
alt.onServer(Action.PedParamedicGetToCar, async (vehicle: alt.Vehicle, pedCoords: alt.IVector3) => {
    const driverStart = {
        x: pedCoords.x,
        y: pedCoords.y,
        z: pedCoords.z,
        model: PedHash.s_m_m_paramedic_01,
        heading: 45.0,
    };

    const driverDest = {
        x: alt.Player.local.pos.x,
        y: alt.Player.local.pos.y,
        z: alt.Player.local.pos.z,
    };

    const garage = {
        x: 291.23,
        y: -1436.542,
        z: 29.804,
    };

    // Create Bus driver
    let pedDriver = null;

    loadModelAsync(driverStart.model).then(() => {
        pedDriver = native.createPed(
            1,
            driverStart.model,
            driverStart.x,
            driverStart.y,
            driverStart.z,
            driverStart.heading,
            false,
            false
        );
        alt.on('resourceStop', () => {
            native.deletePed(pedDriver);
        });

        native.taskWanderStandard(pedDriver, 10.0, 10);
        alt.log(`PED Paramedic get in to car: ${vehicle.scriptID}`);
        // native.taskEnterVehicle(pedDriver, vehicle.scriptID, 6000, -1, 2.0, 0, 0);

        native.taskVehicleDriveToCoordLongrange(
            pedDriver,
            vehicle.scriptID,
            driverDest.x,
            driverDest.y,
            driverDest.z,
            220.0,
            DrivingStyle.crazy,
            10.0
        );
        native.setVehicleSiren(vehicle.scriptID, true);
    });

    alt.on('enteredVehicle', (vehicle, seat) => {
        alt.emit(Action.PedParamedicTakeToHospital, pedDriver, vehicle);
    });

    alt.on(Action.PedParamedicTakeToHospital, (driver, bus: alt.Vehicle) => {
        timerToGarage = alt.setTimeout(() => {
            alt.log('Take to Hospital');
            native.taskVehicleDriveToCoordLongrange(
                driver,
                bus.scriptID,
                garage.x,
                garage.y,
                garage.z,
                220.0,
                DrivingStyle.crazy,
                5.0
            );

            alt.setTimeout(() => {
                native.deletePed(pedDriver);
                alt.emitServer(Action.PedParamedicTakeToHospital, bus);
            }, 45000);
        }, 15000);
    });

    // const busDriverTag = alt.everyTick(() => {
    //     distance(pedDriver.pos, alt.Player.local.pos) < 50) {

    //     }
    // });
});
