import * as alt from 'alt-server';
import { Action } from '../../client/enums/actions';

alt.onClient(Action.PlayerToggleCarWindow, (player: alt.Player, windowIndex) => {
    const isWindowOpened = player.vehicle.isWindowOpened(windowIndex);

    player.vehicle.setWindowOpened(windowIndex, isWindowOpened ? false : true);

    // TODO: remove workaround https://github.com/altmp/altv-issues/issues/737
    if (!isWindowOpened) {
        alt.emitClient(player, Action.PlayerOpenCarWindow, windowIndex);
    } else {
        alt.emitClient(player, Action.PlayerCloseCarWindow, windowIndex);
    }
});
