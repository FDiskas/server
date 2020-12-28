import * as alt from 'alt-client';
import * as native from 'natives';
import { FingerPoint } from '../handling/fingerPoint';
import { Action } from '../enums/actions';
import { Key, NativeKey } from '../enums/keys';
import { getClosestVehicle } from '../lib/distance';

// https://docs.fivem.net/docs/game-references/controls/
alt.everyTick(() => {
    native.disableControlAction(0, NativeKey.InputEnter, true);
    if (native.isDisabledControlJustPressed(0, NativeKey.InputEnter)) {
        if (alt.Player.local.vehicle) {
            alt.emit(Action.PlayerExitVehicle);
        } else {
            alt.emit(Action.PlayerEnterVehicle);
        }
    }
});

alt.on('keydown', (key) => {
    if (alt.isMenuOpen() || native.isPauseMenuActive()) {
        if (key === Key.Esc || key === Key.P) {
            alt.emit(Action.PlayerClearAnim);
        }
        return;
    }
    if (key == Key.B) {
        FingerPoint.start();
    }
    if (key === Key.E) {
        // Car window
        if (alt.Player.local.vehicle) {
            alt.emit(Action.PlayerToggleCarWindow);
            return;
        }

        if (getClosestVehicle(alt.Player.local, 10).vehicle?.scriptID) {
            alt.emit(Action.PlayerToggleCarDoor);
            return;
        }

        alt.emit(Action.PlayerWhistle);
    }
});

alt.on('keyup', (key) => {
    if (alt.isMenuOpen() || native.isPauseMenuActive()) {
        return;
    }
    if (key === Key.Esc || key === Key.P) {
        alt.emit(Action.PlayerPlayOpenMap);
    }
    if (key === Key.E) {
        if (!getClosestVehicle(alt.Player.local, 10).vehicle?.scriptID) {
            native.stopAnimPlayback(alt.Player.local.scriptID, 46, true);
        }
    }
    if (key == Key.B) {
        FingerPoint.stop();
    }
});
