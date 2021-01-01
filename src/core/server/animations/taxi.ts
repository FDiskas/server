import * as alt from 'alt-server';
import { Action } from '../../client/enums/actions';
import { emitInRange } from '../lib/distance';

alt.onClient(Action.PlayerWhistleStart, (player: alt.Player, scriptID: number) => {
    // Play sound for near by players
    emitInRange(Action.PlayerWhistleStart, player.pos, 30, [], scriptID);
});
