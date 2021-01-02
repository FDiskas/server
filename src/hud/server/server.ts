import * as alt from 'alt-server';
import { Action } from '../../core/client/enums/actions';

alt.log(`Hello from HUD Server`);

alt.on('playerConnect', (player) => {
    alt.emitClient(player, Action.PlayerConnected);
});
