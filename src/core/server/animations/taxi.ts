import * as alt from 'alt-server';
import { Action } from '../../client/enums/actions';
import { emitInRange } from '../lib/distance';

alt.onClient(Action.PlayerWhistle, (player: alt.Player, locationFrom, scriptID: string) => {
    emitInRange(Action.PlayerWhistle, locationFrom, 30, [], scriptID);
});
