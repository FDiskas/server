import * as alt from 'alt-client';
import * as native from 'natives';
import { FingerPoint } from '../handling/fingerPoint';
import { Action } from '../enums/actions';
import { Key } from '../enums/keys';
import { getClosestVehicle } from '../lib/distance';
import { animationList } from '../enums/animationList';

// https://docs.fivem.net/docs/game-references/controls/

let intervalEngine;

alt.on('keydown', (key) => {
    if (alt.isMenuOpen() || native.isPauseMenuActive()) {
        if (key === Key.Esc || key === Key.P || key === Key.BACKSPACE) {
            if (native.isPedOnFoot(alt.Player.local.scriptID)) {
                alt.emit(Action.PlayerClearAnim);
            }
        }
        return;
    }
    if (key === Key.SHIFT) {
        alt.emit('push');

    }
    if (key === Key.F) {
        //429 - _PED_FLAG_DISABLE_STARTING_VEH_ENGINE
        native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
        if (
            alt.Player.local.vehicle &&
            native.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID) &&
            alt.Player.local.seat === 1
        ) {
            intervalEngine = alt.setInterval(() => {
                if (!alt.Player.local.vehicle) {
                    alt.clearInterval(intervalEngine);
                    return;
                }
                native.setVehicleHandbrake(alt.Player.local.vehicle.scriptID, false);
                native.setVehicleEngineOn(alt.Player.local.vehicle.scriptID, true, true, false);
            }, 100);
        }
    }
    if (key === Key.G) {
        alt.emit(Action.PlayerEnterVehicle);
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

        // Taxi animation
        alt.emit(Action.PlayerPlayAnim, animationList.taxi);
        alt.emitServer(Action.PlayerWhistleStart, alt.Player.local.scriptID);
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
        alt.emit(Action.PlayerWhistleStop);
    }
    if (key === Key.F && intervalEngine) {
        alt.clearInterval(intervalEngine);
    }
    if (key == Key.B) {
        FingerPoint.stop();
    }
    // Start the engine UP Arrow
    if (key === Key.UP) {
        if (alt.Player.local.vehicle) {
            native.setVehicleEngineOn(alt.Player.local.vehicle.scriptID, true, false, true);
        }
    }
    // Stop the engine DOWN Arrow
    if (key === Key.DOWN) {
        if (alt.Player.local.vehicle) {
            native.setVehicleEngineOn(alt.Player.local.vehicle.scriptID, false, false, true);
        }
    }
});
