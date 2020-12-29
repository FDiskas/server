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

    await loadModelAsync(driverStart.model);
    // pedDriver = native.createPed(
    //     1,
    //     driverStart.model,
    //     driverStart.x,
    //     driverStart.y,
    //     driverStart.z,
    //     driverStart.heading,
    //     false,
    //     false
    // );
    pedDriver = native.createPedInsideVehicle(vehicle.scriptID, 20, driverStart.model, -1, false, false);
    alt.log(`native.createPedInsideVehicle(${vehicle.scriptID}, 20, ${driverStart.model}, -1, true, true)`);

    native.taskWanderStandard(pedDriver, 10.0, 10);
    native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle.scriptID, 0);
    // alt.log(`PED Paramedic: ${pedDriver} get in to car: ${vehicle.scriptID}`);

    // get ped model
    // native.createPedInsideVehicle(vehicle.scriptID, 20, driverStart.model, -1, true, true);

    // native.taskEnterVehicle(pedDriver, vehicle.scriptID, 1, -1, 16, 1, 0);

    if (native.isThisModelAHeli(vehicle.model)) {
        native.taskHeliMission(
            pedDriver,
            vehicle.scriptID,
            0,
            0,
            driverDest.x,
            driverDest.y,
            driverDest.z,
            32,
            1.0,
            -1.0,
            -1.0,
            10,
            10,
            5.0,
            4096
        );
        native.setVehicleSearchlight(vehicle.scriptID, true, true);

        // native.taskHeliChase(
        //     pedDriver,
        //     alt.Player.local.scriptID,
        //     alt.Player.local.pos.x,
        //     alt.Player.local.pos.y,
        //     alt.Player.local.pos.z
        // );
    } else {
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
    }

    // const busDriverTag = alt.everyTick(() => {
    //     distance(pedDriver.pos, alt.Player.local.pos) < 50) {

    //     }
    // });
});
// alt.on('resourceStop', () => {
//     native.deletePed(pedDriver);
//     vehicle.destroy();
// });
// alt.on('enteredVehicle', (vehicle, seat) => {
//     alt.emit(Action.PedParamedicTakeToHospital, pedDriver, vehicle);
// });

// alt.on(Action.PedParamedicTakeToHospital, (driver, bus: alt.Vehicle) => {
//     const timerToGarage = alt.setTimeout(() => {
//         alt.log('Take to Hospital');

//         // When arrive taskLeaveVehicle

//         // If heli then fly
//         // isThisModelAHeli

//         native.taskVehicleDriveToCoordLongrange(
//             driver,
//             bus.scriptID,
//             garage.x,
//             garage.y,
//             garage.z,
//             220.0,
//             DrivingStyle.crazy,
//             5.0
//         );

//         alt.setTimeout(() => {
//             native.deletePed(pedDriver);
//             alt.emitServer(Action.PedParamedicTakeToHospital, bus);
//         }, 45000);
//     }, 15000);
// });
