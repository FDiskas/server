import { UIMenuItem } from '@durtyfree/altv-nativeui';
import { AbstractMenu } from './abstractMenu';

export abstract class AbstractSubMenu extends AbstractMenu {
    parentMenu: AbstractMenu;
    menuItem: UIMenuItem;

    protected constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu.pool, title);
        this.parentMenu = parentMenu;
        this.menuItem = new UIMenuItem(title);
        this.menuItem.RightLabel = '→→→';
        this.parentMenu.addItem(this.menuItem);
        this.parentMenu.menuObject.AddSubMenu(this.menuObject, this.menuItem);
    }

    protected remove() {
        this.parentMenu.menuObject.RemoveItem(this.menuItem);
        this.pool.remove(this.menuObject);
    }
}
