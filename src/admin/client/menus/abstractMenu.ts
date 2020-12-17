import { Menu, Point } from '@durtyfree/altv-nativeui';
import {
    UIMenuCheckboxItem,
    UIMenuDynamicListItem,
    UIMenuItem,
    UIMenuListItem,
    ChangeDirection,
    Menu as TypeMenu,
} from '@durtyfree/altv-nativeui';
import { AbstractMenuPool } from '../mod/menu';

export abstract class AbstractMenu {
    pool: AbstractMenuPool;
    menuObject: TypeMenu;

    protected constructor(pool: AbstractMenuPool, title: string) {
        this.pool = pool;
        this.menuObject = new Menu('', title.toUpperCase(), new Point(50, -57));
        this.menuObject.SetNoBannerType();
        this.menuObject.DisableInstructionalButtons(true);
        this.menuObject.ItemSelect.on((item: UIMenuItem) => item.Data());
        this.menuObject.CheckboxChange.on((item: UIMenuCheckboxItem, state: boolean) => item.Data(state));
        this.menuObject.DynamicListChange.on((item: UIMenuDynamicListItem, index: number, direction: ChangeDirection) =>
            item.Data(index, direction)
        );
        this.menuObject.ListChange.on((item: UIMenuListItem, index: number) => item.Data(index));
        this.pool.add(this.menuObject);
    }

    addItem<T extends UIMenuItem>(item: T, handler = () => {}) {
        item.Data = handler;
        this.menuObject.AddItem(item);
    }

    addUserInputItem<T extends UIMenuItem>(item: T, handler: () => void) {
        item.RightLabel = '[ ... ]';
        this.addItem(item, handler);
    }
}
