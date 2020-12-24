import * as alt from 'alt-client';
import * as native from 'natives';
import { Action } from '../enums/actions';
import { Key, NativeKey } from '../enums/keys';
import { TaskId } from '../enums/taskId';
import { getClosestVehicle } from '../lib/distance';

// https://docs.fivem.net/docs/game-references/controls/
alt.everyTick(() => {
    native.disableControlAction(0, NativeKey.InputEnter, true);
    if (native.isDisabledControlJustPressed(0, NativeKey.InputEnter)) {
        if (native.getIsTaskActive(alt.Player.local.scriptID, TaskId.CTaskEnterVehicle)) {
            native.clearPedTasksImmediately(alt.Player.local.scriptID);
            return;
        }
        if (
            alt.Player.local.vehicle &&
            native.isPedInVehicle(alt.Player.local.scriptID, alt.Player.local.vehicle.scriptID, false)
        ) {
            alt.emit(Action.PlayerExitVehicle);
        } else {
            alt.emit(Action.PlayerEnterVehicle);
        }
    }
});

alt.on('keydown', (key) => {
    if (alt.isMenuOpen() || native.isPauseMenuActive()) return;
    if (key === Key.E) {
        // Car window
        if (native.isPed alt.Player.local)
        if (alt.Player.local.vehicle) {
            alt.emit(Action.PlayerToggleCarWindow);
            return;
        }

        if (getClosestVehicle(alt.Player.local, 5).vehicle?.scriptID) {
            alt.emit(Action.PlayerToggleCarDoor);
            return;
        }

        alt.emit(Action.PlayerWhistle);
    }
});

alt.on('keyup', (key) => {
    if (alt.isMenuOpen() || native.isPauseMenuActive()) return;
    if (key === Key.E) {
        if (!getClosestVehicle(alt.Player.local, 5).vehicle?.scriptID) {
            alt.emit(Action.PlayerClearAnim);
        }
    }
});