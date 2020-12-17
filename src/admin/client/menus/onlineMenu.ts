import { UIMenuItem as TypeUIMenuItem } from '@durtyfree/altv-nativeui';
import * as alt from 'alt-client';

import { Game } from '../utils/game';
import { AbstractMenu } from './abstractMenu';
import { AbstractSubMenu } from './abstractSubMenu';
import { UIMenuItem, BadgeStyle } from '@durtyfree/altv-nativeui';

export class OnlineMenu extends AbstractSubMenu {
    static spectatingPlayer: alt.Player;
    private reloadPlayerListItem: TypeUIMenuItem;

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title);
        this.addItem((this.reloadPlayerListItem = new UIMenuItem('Reload Player List')), () => this.reloadPlayerList());
        this.reloadPlayerListItem.LeftBadge = BadgeStyle.Alert;
        this.menuObject.MenuOpen.on(() => this.reloadPlayerList());
    }

    private reloadPlayerList() {
        if (this.menuObject.MenuItems.length != alt.Player.all.length + 1) {
            this.menuObject.MenuItems.splice(1);
            alt.Player.all.forEach((player) => new OnlinePlayerMenu(this, `ID ${player.id} - ${player.name}`, player));
        }
    }
}

class OnlinePlayerMenu extends AbstractSubMenu {
    private hwIdHashItem: TypeUIMenuItem;
    private hwIdExHashItem: TypeUIMenuItem;
    private socialIdItem: TypeUIMenuItem;
    teleportToItem: TypeUIMenuItem;
    teleportHereItem: TypeUIMenuItem;

    constructor(parentMenu: AbstractMenu, title: string, player: alt.Player) {
        super(parentMenu, title);
        this.addItem((this.hwIdHashItem = new UIMenuItem('HWID')));
        this.addItem((this.hwIdExHashItem = new UIMenuItem('HWIDEX')));
        this.addItem((this.socialIdItem = new UIMenuItem('SOCIALID')));
        this.addItem((this.teleportToItem = new UIMenuItem('Teleport To Player')), () =>
            Game.teleportPlayertoEntity(alt.Player.local, player)
        );
        this.addItem((this.teleportHereItem = new UIMenuItem('Teleport Here')), () =>
            Game.teleportPlayertoEntity(player, alt.Player.local)
        );
        this.getIdentifiers(player);
    }

    private async getIdentifiers(player: alt.Player) {
        let identifiers = await Game.getPlayerIdentifiers(player);
        this.hwIdHashItem.RightLabel = identifiers[0];
        this.hwIdExHashItem.RightLabel = identifiers[1];
        this.socialIdItem.RightLabel = identifiers[2];
    }
}
