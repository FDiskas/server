import * as alt from 'alt-client';
import native from 'natives';

// Hands be in air until 'x' gets released ////
var hotkey = 88; //Change key - https://keycode.info/
var handsUp = false;
var status = false;
var dict = 'missminuteman_1ig_2';
native.requestAnimDict(dict);

// TODO: check native.taskHandsUp
alt.on('keydown', (key) => {
    if (alt.isMenuOpen() || native.isPauseMenuActive()) return;
    // X Key pressed
    if (key === hotkey) {
        handsUp = true;
        if (handsUp && native.isPedSittingInAnyVehicle(alt.Player.local.scriptID)) {
            alt.everyTick(() => {
                native.disableControlAction(2, 59, true);
            });
        }
    }
});

alt.on('keyup', (key) => {
    if (alt.isMenuOpen() || native.isPauseMenuActive()) return;
    if (key === hotkey) {
        handsUp = false;
        if (!handsUp && native.isPedSittingInAnyVehicle(alt.Player.local.scriptID)) {
            alt.everyTick(() => {
                native.enableControlAction(2, 59, true);
            });
        }
    }
});

/////// Just some variables ///////////////////
var hotkey = 88; //Change key - https://keycode.info/
var handsUp = false;
var status = false;
// const localPlayer = alt.Player.local;
var dict = 'missminuteman_1ig_2';
native.requestAnimDict(dict);
///////////////////////////////////////////////

alt.setInterval(() => {
    if (handsUp == true) {
        if (status == false) {
            native.taskPlayAnim(
                alt.Player.local.scriptID,
                dict,
                'handsup_enter',
                8.0,
                8.0,
                -1,
                50,
                0,
                false,
                false,
                false
            );
            status = true;
        }
    } else {
        if (status == true) {
            native.clearPedTasks(alt.Player.local.scriptID);
            status = false;
        }
    }
}, 10);

///////////////////////////////////////////////
