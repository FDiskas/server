import * as alt from 'alt-client';
import * as native from 'natives';
import { Player } from '../utils/player';
import { Menu } from '../utils/menu';
import { AnimationFlag } from '../enums/animationFlag';
import { PedHash } from '../enums/pedHash';
import { tick } from '../mod/tick';
import { Enum } from '../utils/enum';
import { Game } from '../utils/game';
import { AbstractMenu } from './abstractMenu';
import { AbstractSubMenu } from './abstractSubMenu';
import { UIMenuItem, UIMenuCheckboxItem, BadgeStyle } from '@durtyfree/altv-nativeui';
import { Sounds } from '../enums/sounds';

export class PlayerMenu extends AbstractSubMenu {
    modelMenu: ModelMenu;
    soundMenu: SoundMenu;
    private animationItem: UIMenuItem;
    reviveItem: UIMenuItem;
    healItem: UIMenuItem;
    invisibilityItem: UIMenuCheckboxItem;
    godmodeItem: UIMenuCheckboxItem;
    ragdollItem: UIMenuCheckboxItem;
    collisionItem: UIMenuCheckboxItem;
    infiniteStaminaItem: UIMenuCheckboxItem;
    superJumpItem: UIMenuCheckboxItem;
    fastRunItem: UIMenuCheckboxItem;
    fastSwimItem: UIMenuCheckboxItem;
    thermalVisionItem: UIMenuCheckboxItem;
    nightVisionItem: UIMenuCheckboxItem;
    private suicideItem: UIMenuItem;

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title);
        this.modelMenu = new ModelMenu(this, 'Ped Models');
        this.soundMenu = new SoundMenu(this, 'Ped Sounds');
        this.addUserInputItem(
            (this.animationItem = new UIMenuItem('Play Custom Animation', 'Requires ~b~dictionary~s~ and ~b~name~s~.')),
            async () =>
                await this.playAnimation(await Game.getUserInput(), await Game.getUserInput(), this.animationItem)
        );
        this.addItem((this.reviveItem = new UIMenuItem('Revive Player')), () => Player.respawn());
        this.addItem((this.healItem = new UIMenuItem('Heal Player')), () => Player.heal());
        this.addItem((this.invisibilityItem = new UIMenuCheckboxItem('Player Invisibility')), (state?: boolean) =>
            native.setEntityVisible(alt.Player.local.scriptID, !state, false)
        );
        this.addItem((this.godmodeItem = new UIMenuCheckboxItem('Player Godmode')), (state?: boolean) =>
            Player.setInvincible(alt.Player.local, state)
        );
        this.addItem((this.ragdollItem = new UIMenuCheckboxItem('Disable Ragdoll')), (state?: boolean) =>
            native.setPedCanRagdoll(alt.Player.local.scriptID, !state)
        );
        this.addItem((this.collisionItem = new UIMenuCheckboxItem('Disable Collision')), (state?: boolean) =>
            native.setEntityCollision(alt.Player.local.scriptID, !state, true)
        );
        this.addItem((this.infiniteStaminaItem = new UIMenuCheckboxItem('Infinite Stamina')), (state?: boolean) =>
            state
                ? tick.register('player:infiniteStamina', () => native.resetPlayerStamina(alt.Player.local.scriptID), 0)
                : tick.clear('player:infiniteStamina')
        );
        this.addItem((this.superJumpItem = new UIMenuCheckboxItem('Super Jump')), (state?: boolean) =>
            state
                ? tick.register('player:superJump', () => native.setSuperJumpThisFrame(alt.Player.local.scriptID), 0)
                : tick.clear('player:superJump')
        );
        this.addItem((this.fastRunItem = new UIMenuCheckboxItem('Fast Run')), (state?: boolean) =>
            state
                ? native.setRunSprintMultiplierForPlayer(alt.Player.local.scriptID, 1.49)
                : native.setRunSprintMultiplierForPlayer(alt.Player.local.scriptID, 1)
        );
        this.addItem((this.fastSwimItem = new UIMenuCheckboxItem('Fast Swim')), (state?: boolean) =>
            state
                ? native.setSwimMultiplierForPlayer(alt.Player.local.scriptID, 1.49)
                : native.setSwimMultiplierForPlayer(alt.Player.local.scriptID, 1)
        );
        this.addItem((this.thermalVisionItem = new UIMenuCheckboxItem('Thermal Vision')), (state?: boolean) =>
            native.setSeethrough(state)
        );
        this.addItem((this.nightVisionItem = new UIMenuCheckboxItem('Night Vision')), (state?: boolean) =>
            native.setNightvision(state)
        );
        this.addItem((this.suicideItem = new UIMenuItem('Suicide')), async () => {
            Menu.lockMenuItem(this.suicideItem);
            await Player.playAnimation('mp_suicide', 'pill');
            alt.setTimeout(() => {
                native.setEntityHealth(alt.Player.local.scriptID, 0, 0);
                Menu.unlockMenuItem(this.suicideItem);
            }, 3200);
        });
        this.suicideItem.LeftBadge = BadgeStyle.Alert;
    }

    // https://alexguirre.github.io/animations-list/
    private async playAnimation(dict: string, value: string, item: UIMenuItem) {
        await Player.playAnimation(dict, value, AnimationFlag.EnablePlayerControl);
        Menu.selectItem(item, BadgeStyle.Tick);
        alt.setTimeout(() => Menu.deselectItem(item), native.getAnimDuration(dict, value) * 1000);
    }
}

class ModelMenu extends AbstractSubMenu {
    customItem: UIMenuItem;

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title);
        this.addUserInputItem((this.customItem = new UIMenuItem('Custom Player Model')), async () =>
            Player.setModel(alt.hash(await Game.getUserInput()))
        );
        Enum.getValues(PedHash).forEach((hash) =>
            this.addItem(new UIMenuItem(PedHash[+hash].toUpperCase()), () => Player.setModel(+hash))
        );
    }
}

class SoundMenu extends AbstractSubMenu {
    customItem: UIMenuItem;

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title);
        Sounds.forEach((sound) =>
            this.addItem(new UIMenuItem(sound.soundName.toUpperCase()), () => {
                return native.playSoundFrontend(-1, sound.soundName, sound.soundSetName, true);
            })
        );
    }
}
