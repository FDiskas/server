import * as alt from 'alt-client';
import game from 'natives';

export class Entity {
    static setInvincible(entity: alt.Entity, toggle: boolean) {
        game.setEntityCanBeDamaged(entity.scriptID, !toggle);
        game.setEntityInvincible(entity.scriptID, toggle);
    }
}
