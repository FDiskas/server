import * as alt from 'alt-client';
import { VehicleColor } from '../enums/vehicleColor';
import { Enum } from '../utils/enum';
import { Menu } from '../utils/menu';
import { Vehicle } from '../utils/vehicle';
import { AbstractMenu } from './abstractMenu';
import { AbstractSubMenu } from './abstractSubMenu';
import { VehicleObject } from './vehicleMenu';

import { BadgeStyle, UIMenuItem } from '@durtyfree/altv-nativeui';

export class VehicleColorMenu extends AbstractSubMenu implements VehicleObject {
    vehicle: alt.Vehicle;
    primaryColorMenu: ColorMenu;
    secondaryColorMenu: ColorMenu;
    pearlescentColorMenu: ColorMenu;
    rimColorMenu: ColorMenu;

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title);
        this.primaryColorMenu = new ColorMenu(this, 'Primary Color', 0);
        this.secondaryColorMenu = new ColorMenu(this, 'Secondary Color', 1);
        this.pearlescentColorMenu = new ColorMenu(this, 'Pearlescent Color', 2);
        this.rimColorMenu = new ColorMenu(this, 'Rim Color', 3);
    }
}

class ColorMenu extends AbstractSubMenu {
    private type: number;

    constructor(parentMenu: AbstractMenu, title: string, type: number) {
        super(parentMenu, title);
        this.type = type;
        this.menuObject.MenuOpen.on(() =>
            Menu.selectItem(
                this.menuObject.MenuItems.find(
                    (item) =>
                        item.Text.replace(/\s+/g, '') ==
                        VehicleColor[Vehicle.getColors((this.parentMenu as VehicleColorMenu).vehicle)[this.type]]
                ),
                BadgeStyle.Car
            )
        );
        Enum.getValues(VehicleColor).forEach((color) => {
            let item = new UIMenuItem(VehicleColor[+color].replace(/([A-Z])/g, ' $1').trim());
            this.addItem(item, () => {
                Vehicle.setColor((this.parentMenu as VehicleColorMenu).vehicle, this.type, +color);
                Menu.selectItem(item, BadgeStyle.Car);
            });
        });
    }
}
