import * as alt from 'alt-client';
import * as native from 'natives';
import { Action } from '../enums/actions';
import { animationList } from '../enums/animationList';
import { soundList } from '../enums/sounds';

alt.onServer(Action.PlayerWhistleStart, (scriptID: alt.Player['scriptID']) => {
    // Check if there is a ped in range
    alt.emit(Action.PlayerPlaySound, soundList.whistle, scriptID);
});

alt.on(Action.PlayerWhistleStop, () => {
    native.stopAnimTask(alt.Player.local.scriptID, animationList.taxi.dict, animationList.taxi.name, 1);
});
