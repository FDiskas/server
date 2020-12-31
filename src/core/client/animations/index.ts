import * as alt from 'alt-client';
import * as native from 'natives';
import { Action } from '../enums/actions';
import { loadAnim } from '../lib/async';

import './drunk';
import './taxi';
// import './deathCam';

/*
	Flags need to be added together for desired effects.
	ie. Upper Body + Last Frame = 16 + 2 = 18 <-- This value.
	normal = 0
	repeat = 1
	stop_last_frame = 2
	unk1 = 4
	unk2_air = 8
	upperbody = 16
	enablePlCtrl = 32
	unk3 = 64
	cancelable = 128
	unk4_creature = 256
	unk5_freezePos = 512
	unk6_rot90 = 1024
*/

alt.on(Action.PlayerPlayAnim, (data) => {
    playAnimation(alt.Player.local, data.dict, data.name, data.duration, data.flag);
});

alt.on(Action.PlayerClearAnim, () => {
    native.clearPedTasks(alt.Player.local.scriptID);
    native.clearPedTasksImmediately(alt.Player.local.scriptID);
    if (!alt.Player.local.vehicle) {
        native.clearPedSecondaryTask(alt.Player.local.scriptID);
    }
});

export function playAnimation(player: alt.Player, dict: string, name: string, duration: number, flag: number) {
    startAnimation(player, dict, name, duration, flag);
}

function startAnimation(player: alt.Player, dict: string, name: string, duration: number, flag: number) {
    native.clearPedTasks(alt.Player.local.scriptID);
    if (native.hasAnimDictLoaded(dict)) {
        native.taskPlayAnim(player.scriptID, dict, name, 1, -1, duration, flag, 1.0, false, false, false);
        return;
    }

    let res = loadAnim(dict);
    res.then(() => {
        native.taskPlayAnim(player.scriptID, dict, name, 1, -1, duration, flag, 1.0, false, false, false);
    });
}
