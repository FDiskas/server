import * as alt from 'alt-client';
import game from 'natives';
import { VehicleWheelType } from '../enums/vehicleWheelType';
import { Vehicle } from '../utils/vehicle';
import { AbstractMenu } from './abstractMenu';
import { AbstractSubMenu } from './abstractSubMenu';
import { VehicleObject } from './vehicleMenu';
import { UIMenuItem } from '@durtyfree/altv-nativeui';

export class VehicleWheelsMenu extends AbstractSubMenu implements VehicleObject {
    vehicle: alt.Vehicle;
    stockWheels: UIMenuItem;
    wheelsMenus: WheelsMenu[];

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title);
        this.addItem((this.stockWheels = new UIMenuItem('Stock Wheels')), () =>
            Vehicle.setWheels(this.vehicle, 0, 0, game.getVehicleClass(this.vehicle.scriptID) == 8 ? true : false)
        );
        this.wheelsMenus = [
            new WheelsMenu(this, 'Sport', VehicleWheelType.Sport, 50),
            new WheelsMenu(this, 'Muscle', VehicleWheelType.Muscle, 36),
            new WheelsMenu(this, 'Lowrider', VehicleWheelType.Lowrider, 30),
            new WheelsMenu(this, 'SUV', VehicleWheelType.SUV, 38),
            new WheelsMenu(this, 'Off-Road', VehicleWheelType.OffRoad, 35),
            new WheelsMenu(this, 'Tuner', VehicleWheelType.Tuner, 48),
            new WheelsMenu(this, 'Bike', VehicleWheelType.Bike, 72),
            new WheelsMenu(this, 'High End', VehicleWheelType.HighEnd, 40),
            new WheelsMenu(this, "Benny's Original", VehicleWheelType.BennysOriginal, 217),
            new WheelsMenu(this, "Benny's Bespoke", VehicleWheelType.BennysBespoke, 217),
            new WheelsMenu(this, 'Race', VehicleWheelType.Race, 140),
            new WheelsMenu(this, 'Street', VehicleWheelType.Street, 210),
        ];
    }
}

class WheelsMenu extends AbstractSubMenu {
    constructor(parentMenu: AbstractMenu, title: string, type: VehicleWheelType, num: number) {
        super(parentMenu, title);
        for (let _i = 0; _i < num; _i++) {
            let item = new UIMenuItem(_i.toString());
            this.addItem(item, () =>
                Vehicle.setWheels(
                    (this.parentMenu as VehicleWheelsMenu).vehicle,
                    type,
                    _i,
                    game.getVehicleClass((this.parentMenu as VehicleWheelsMenu).vehicle.scriptID) == 8 ? true : false
                )
            );
        }
    }
}
