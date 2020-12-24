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

alt.onClient(Action.PlayerToggleCarDoor, (player: alt.Player, veh: alt.Vehicle['id'], doorIndex) => {
    const vehicle = alt.Vehicle.getByID(veh);
    const doorState = vehicle.getDoorState(doorIndex + 1);

    if (doorState === alt.VehicleDoorState.Unknown) {
        return;
    }
    if (doorState === alt.VehicleDoorState.Closed) {
        vehicle.setDoorState(doorIndex + 1, alt.VehicleDoorState.OpenedLevel7);
        alt.emitClient(player, Action.PlayerOpenCarDoor, vehicle, doorIndex);
    } else {
        // FIXME: https://github.com/altmp/altv-issues/issues/737
        vehicle.setDoorState(doorIndex + 1, alt.VehicleDoorState.Closed);
        alt.emitClient(player, Action.PlayerCloseCarDoor, vehicle, doorIndex);
    }
});
