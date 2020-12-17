import { AbstractMenuPool } from '../mod/menu';
import { AbstractMenu } from './abstractMenu';
import { MiscMenu } from './miscMenu';
import { OnlineMenu } from './onlineMenu';
import { PlayerMenu } from './playerMenu';
import { VehicleMenu } from './vehicleMenu';
import { VehicleSpawnerMenu } from './vehicleSpawnerMenu';
import { WeaponMenu } from './weaponMenu';
import { WorldMenu } from './worldMenu';

export class MainMenu extends AbstractMenu {
    onlineMenu: OnlineMenu;
    playerMenu: PlayerMenu;
    vehicleMenu: VehicleMenu;
    vehicleSpawnerMenu: VehicleSpawnerMenu;
    weaponMenu: WeaponMenu;
    WorldMenu: WorldMenu;
    miscMenu: MiscMenu;

    constructor(pool: AbstractMenuPool, title: string) {
        super(pool, title);
        this.onlineMenu = new OnlineMenu(this, 'Online Options');
        this.playerMenu = new PlayerMenu(this, 'Player Options');
        this.vehicleMenu = new VehicleMenu(this, 'Vehicle Options');
        this.vehicleSpawnerMenu = new VehicleSpawnerMenu(
            this,
            'Vehicle Spawner'
        );
        this.weaponMenu = new WeaponMenu(this, 'Weapon Options');
        this.WorldMenu = new WorldMenu(this, 'World Options');
        this.miscMenu = new MiscMenu(this, 'Misc Options');
    }
}
