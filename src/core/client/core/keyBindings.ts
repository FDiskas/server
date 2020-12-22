import * as alt from 'alt-client';
import * as native from 'natives';
import { Action } from '../enums/actions';
import { NativeKey } from '../enums/keys';
import { TaskId } from '../enums/taskId';

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
