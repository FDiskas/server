import * as alt from 'alt-client';
import { Key } from '../enums/key';
import { MainMenu } from '../menus/mainMenu';
import { Menu as TypeMenu } from '@durtyfree/altv-nativeui';

export class AbstractMenuPool {
    protected menus: TypeMenu[] = [];

    add(menu: TypeMenu) {
        this.menus.push(menu);
    }

    remove(menu: TypeMenu) {
        this.menus = this.menus.filter((x) => x !== menu);
    }

    protected isAnyMenuOpen() {
        let result = false;
        this.menus.forEach((menu) => {
            if (menu.Visible) result = true;
        });
        return result;
    }
}

class MenuPool extends AbstractMenuPool {
    init() {
        let mainMenu = new MainMenu(this, 'Main Menu');
        alt.on('keyup', (key: number) => {
            if (key == Key.M) {
                if (!this.isAnyMenuOpen()) mainMenu.menuObject.Open();
            }
        });
    }
}

export const menuPool = new MenuPool();
