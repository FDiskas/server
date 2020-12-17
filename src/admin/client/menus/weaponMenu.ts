import * as alt from 'alt-client';
import * as game from 'natives';
import { Player } from '../utils/player';
import { AmmoType } from '../enums/ammoType';
import { WeaponHash } from '../enums/weaponHash';
import { Enum } from '../utils/enum';
import { Game } from '../utils/game';
import { AbstractMenu } from './abstractMenu';
import { AbstractSubMenu } from './abstractSubMenu';
import { WeaponCustomizationMenu } from './weaponCustomizationMenu';
import { UIMenuItem, UIMenuCheckboxItem, BadgeStyle } from '@durtyfree/altv-nativeui';

export class WeaponMenu extends AbstractSubMenu {
    weaponCustomizationMenu: WeaponCustomizationMenu;
    giveWeaponItem: UIMenuItem;
    removeWeaponItem: UIMenuItem;
    giveAllWeaponsItem: UIMenuItem;
    refillAmmoItem: UIMenuItem;
    infiniteAmmoItem: UIMenuCheckboxItem;
    noReloadItem: UIMenuCheckboxItem;
    private removeAllWeaponsItem: UIMenuItem;

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title);
        this.weaponCustomizationMenu = new WeaponCustomizationMenu(this, 'Weapon Customization');
        this.addUserInputItem((this.giveWeaponItem = new UIMenuItem('Give Weapon')), async () =>
            Player.giveWeapon(alt.hash(await Game.getUserInput()), true)
        );
        this.addUserInputItem((this.removeWeaponItem = new UIMenuItem('Remove Weapon')), async () =>
            Player.removeWeapon(alt.hash(await Game.getUserInput()))
        );
        this.addItem((this.giveAllWeaponsItem = new UIMenuItem('Give All Weapons')), () =>
            Enum.getValues(WeaponHash).forEach((weaponHash) => Player.giveWeapon(+weaponHash))
        );
        this.addItem((this.refillAmmoItem = new UIMenuItem('Refill Ammo')), () =>
            Enum.getValues(AmmoType).forEach((type) => game.setPedAmmoByType(alt.Player.local.scriptID, +type, 250))
        );
        this.addItem((this.infiniteAmmoItem = new UIMenuCheckboxItem('Infinite Ammo')), (state?: boolean) =>
            Enum.getValues(WeaponHash).forEach((weaponHash) =>
                game.setPedInfiniteAmmo(alt.Player.local.scriptID, state, +weaponHash)
            )
        );
        this.addItem((this.noReloadItem = new UIMenuCheckboxItem('No Reload')), (state?: boolean) =>
            game.setPedInfiniteAmmoClip(alt.Player.local.scriptID, state)
        );
        this.addItem((this.removeAllWeaponsItem = new UIMenuItem('Remove All Weapons')), () =>
            Player.removeAllWeapons()
        );
        this.removeAllWeaponsItem.LeftBadge = BadgeStyle.Alert;
    }
}
