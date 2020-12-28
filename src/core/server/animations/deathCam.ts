import * as alt from 'alt-server';
import { Action } from '../../client/enums/actions';

alt.on('playerDeath', (victim: alt.Player, killer: alt.Entity, weaponHash: number) => {
    alt.emitClient(victim, Action.PlayerPlayDeathCam, killer, weaponHash);
});
