import * as alt from 'alt-client';
import game from 'natives';
import { Menu } from '../utils/menu';
import { Player } from '../utils/player';
import { WeaponCollection } from '../collections/weaponCollection';
import { WeaponComponentCollection } from '../collections/weaponComponentCollection';
import { AbstractMenu } from './abstractMenu';
import { AbstractSubMenu } from './abstractSubMenu';

import { UIMenuItem, BadgeStyle } from '@durtyfree/altv-nativeui';

export class WeaponCustomizationMenu extends AbstractSubMenu {
    static componentCollection: WeaponComponentCollection;
    static weaponCollection: WeaponCollection;
    private weaponInfo: UIMenuItem;

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title);
        WeaponCustomizationMenu.componentCollection = new WeaponComponentCollection();
        WeaponCustomizationMenu.weaponCollection = new WeaponCollection();
        this.addItem((this.weaponInfo = new UIMenuItem('')));
        this.weaponInfo.RightBadge = BadgeStyle.Gun;
        this.menuObject.MenuOpen.on(() => {
            let weaponHash = game.getCurrentPedWeapon(alt.Player.local.scriptID, undefined, undefined)[1];
            let weapon = WeaponCustomizationMenu.weaponCollection.weapons[weaponHash];
            let description = game.getLabelText(weapon.description);
            this.weaponInfo.Text = game.getLabelText(weapon.name);
            this.weaponInfo.Description =
                description == 'NULL'
                    ? ''
                    : description.length > 140
                    ? description.substr(0, 139) + '...'
                    : description;
            this.menuObject.MenuItems.splice(1);
            WeaponCustomizationMenu.componentCollection.components[weaponHash]?.forEach((component) => {
                let item = new UIMenuItem(
                    game.getLabelText(component.name),
                    game.getLabelText(component.description) == 'NULL' ? '' : game.getLabelText(component.description)
                );
                this.addItem(item, async () => {
                    let hasComponent = game.hasPedGotWeaponComponent(
                        alt.Player.local.scriptID,
                        weaponHash,
                        alt.hash(component.key)
                    );
                    hasComponent
                        ? await Player.removeWeaponComponent(weaponHash, alt.hash(component.key))
                        : await Player.addWeaponComponent(weaponHash, alt.hash(component.key));
                    this.toggleItem(item, hasComponent);
                });
            });
        });
    }

    private toggleItem(item: UIMenuItem, hasComponent: boolean) {
        Menu.lockMenuItem(item);
        hasComponent ? (item.RightLabel = 'Removed') : (item.RightLabel = 'Added');
        alt.setTimeout(() => {
            item.RightLabel = '';
            Menu.unlockMenuItem(item);
        }, 1500);
    }
}
