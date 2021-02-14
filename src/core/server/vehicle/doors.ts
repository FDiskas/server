import * as alt from 'alt-server';
import { Action } from '../../client/enums/actions';

alt.onClient(Action.PlayerToggleCarWindow, (player: alt.Player, windowIndex) => {
    const isWindowOpened = player.vehicle.isWindowOpened(windowIndex);

    player.vehicle.setWindowOpened(windowIndex, !isWindowOpened);

    // TODO: remove workaround https://github.com/altmp/altv-issues/issues/737
    if (!isWindowOpened) {
        alt.emitClient(player, Action.PlayerOpenCarWindow, windowIndex);
    } else {
        alt.emitClient(player, Action.PlayerCloseCarWindow, windowIndex);
    }
});

alt.onClient(Action.PlayerToggleCarDoor, (player: alt.Player, veh: alt.Vehicle['id'], index) => {
    const doorIndex = {
        '-1': 0,
        0: 1,
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
    };
    const vehicle = alt.Vehicle.getByID(veh);
    const doorState = vehicle.getDoorState(doorIndex[index]);

    // FIXME: https://github.com/altmp/altv-issues/issues/737
    // if (doorState > 0) {
    //     vehicle.setDoorState(doorIndex[index], alt.VehicleDoorState.Closed);
    //     alt.emitClient(player, Action.PlayerCloseCarDoor, vehicle, index);
    //     return;
    // }

    vehicle.setDoorState(doorIndex[index], alt.VehicleDoorState.OpenedLevel7);
    alt.emitClient(player, Action.PlayerOpenCarDoor, vehicle, index);
});
