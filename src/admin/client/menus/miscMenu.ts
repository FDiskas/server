import * as alt from 'alt-client';
import * as native from 'natives';
import { Font } from '../enums/font';
import { Player } from '../utils/player';
import { Text2D } from '../common/text2D';
import { Text3D } from '../common/text3D';
import { HudComponent } from '../enums/hudComponent';
import { Key } from '../enums/key';
import { tick } from '../mod/tick';
import { Enum } from '../utils/enum';
import { Game } from '../utils/game';
import { AbstractMenu } from './abstractMenu';
import { AbstractSubMenu } from './abstractSubMenu';
import { UIMenuItem, UIMenuCheckboxItem, BadgeStyle } from '@durtyfree/altv-nativeui';

export class MiscMenu extends AbstractSubMenu {
    customPropItem: UIMenuItem;
    customTeleportItem: UIMenuItem;
    private teleportToMarkerItem: UIMenuCheckboxItem;
    playerCoordsItem: UIMenuCheckboxItem;
    playerSpeedItem: UIMenuCheckboxItem;
    entitiesInfoItem: UIMenuCheckboxItem;
    raycastInfoItem: UIMenuCheckboxItem;
    hideHudItem: UIMenuCheckboxItem;
    private creditsItem: UIMenuItem;

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title);
        this.addUserInputItem((this.customPropItem = new UIMenuItem('Spawn Custom Prop')), async () =>
            Game.createProp(alt.hash(await Game.getUserInput()), alt.Player.local.pos, true)
        );
        this.addUserInputItem((this.customTeleportItem = new UIMenuItem('Teleport To Coordinates')), async () => {
            let x = +(await Game.getUserInput());
            let y = +(await Game.getUserInput());
            let z = +(await Game.getUserInput());
            native.setPedCoordsKeepVehicle(
                alt.Player.local.scriptID,
                isNaN(x) ? 0 : x,
                isNaN(y) ? 0 : y,
                isNaN(z) ? 0 : z
            );
        });
        this.addItem(
            (this.teleportToMarkerItem = new UIMenuCheckboxItem(
                'Teleport To Marker',
                true,
                'This enables the ~b~F7~s~ key to be used as a shortcut to teleport around the map.'
            ))
        );
        this.addItem((this.playerCoordsItem = new UIMenuCheckboxItem('Show Player Coordinates')), (state?: boolean) =>
            state
                ? tick.register(
                      'misc:drawPlayerCoord',
                      () =>
                          new Text2D(
                              `~y~x~s~ ${alt.Player.local.pos.x.toFixed(3)}` +
                                  ` ~y~y~s~ ${alt.Player.local.pos.y.toFixed(3)}` +
                                  ` ~y~z~s~ ${alt.Player.local.pos.z.toFixed(3)}`,
                              [0.5, 0.95],
                              0.5,
                              Font.ChaletComprimeCologne,
                              new alt.RGBA(255, 255, 255, 220),
                              true
                          ).drawThisFrame(),
                      0
                  )
                : tick.clear('misc:drawPlayerCoord')
        );
        this.addItem((this.playerSpeedItem = new UIMenuCheckboxItem('Show Player Speed')), (state?: boolean) =>
            state
                ? tick.register(
                      'misc:drawPlayerSpeed',
                      () =>
                          new Text2D(
                              `~y~m/s~s~ ${native.getEntitySpeed(alt.Player.local.scriptID).toFixed(3)}` +
                                  ` ~y~km/h~s~ ${(native.getEntitySpeed(alt.Player.local.scriptID) * 3.6).toFixed(3)}` +
                                  ` ~y~mph~s~ ${(native.getEntitySpeed(alt.Player.local.scriptID) * 2.23694).toFixed(
                                      3
                                  )}`,
                              [0.5, 0.9],
                              0.5,
                              Font.ChaletComprimeCologne,
                              new alt.RGBA(255, 255, 255, 220),
                              true
                          ).drawThisFrame(),
                      0
                  )
                : tick.clear('misc:drawPlayerSpeed')
        );
        this.addItem((this.entitiesInfoItem = new UIMenuCheckboxItem('Show Entity Info')), (state?: boolean) =>
            state
                ? tick.register(
                      'misc:drawEntityInfo',
                      () => {
                          alt.Vehicle.all.forEach((vehicle) =>
                              this.draw3DText(
                                  `SCRIPTID ${vehicle.scriptID}` +
                                      ` - ID ${vehicle.id}` +
                                      ` - TYPE ${vehicle.type}` +
                                      ` - MODEL ${vehicle.model}` +
                                      ` - SEATS ${native.getVehicleModelNumberOfSeats(vehicle.model)}` +
                                      ` - BODY ${native.getVehicleBodyHealth(vehicle.scriptID)}` +
                                      ` - ENGINE ${native.getVehicleEngineHealth(vehicle.scriptID)}` +
                                      ` - PETROL TANK ${native.getVehiclePetrolTankHealth(vehicle.scriptID)}`,
                                  vehicle
                              )
                          );
                          alt.Player.all.forEach((player) =>
                              this.draw3DText(
                                  `SCRIPTID ${player.scriptID}` +
                                      ` - ID ${player.id} - TYPE ${player.type}` +
                                      ` - MODEL ${player.model}` +
                                      ` - HEALTH ${native.getEntityHealth(player.scriptID)}` +
                                      ` - ARMOR ${native.getPedArmour(player.scriptID)}`,
                                  player
                              )
                          );
                      },
                      0
                  )
                : tick.clear('misc:drawEntityInfo')
        );
        this.addItem((this.raycastInfoItem = new UIMenuCheckboxItem('Show Raycast Info')), (state?: boolean) =>
            state
                ? tick.register(
                      'misc:drawRaycastInfo',
                      () => {
                          let entity = alt.Entity.getByScriptID(
                              native.getEntityPlayerIsFreeAimingAt(alt.Player.local.scriptID, 0)[1]
                          );
                          if (!entity) return;
                          let entityText =
                              `~y~SCRIPTID ${entity.scriptID}` +
                              ` - ID ${entity.id}` +
                              ` - TYPE ${entity.type}` +
                              ` - POS (${entity.pos.x.toFixed(3)}` +
                              ` - ${entity.pos.y.toFixed(3)}` +
                              ` - ${entity.pos.z.toFixed(3)})` +
                              ` - ${native.isEntityDead(entity.scriptID, false) ? 'DEAD' : 'ALIVE'}` +
                              ` - DISTANCE ${Game.getDistanceBetweenCoords(alt.Player.local.pos, entity.pos).toFixed(
                                  3
                              )}`;
                          if (entity instanceof alt.Vehicle)
                              entityText = entityText.concat(
                                  ` - ${
                                      native.getVehicleDoorsLockedForPlayer(entity.scriptID, alt.Player.local.scriptID)
                                          ? 'LOCKED'
                                          : 'UNLOCKED'
                                  }`
                              );
                          this.draw3DText(entityText, entity);
                      },
                      0
                  )
                : tick.clear('misc:drawRaycastInfo')
        );
        this.addItem((this.hideHudItem = new UIMenuCheckboxItem('Hide Game Hud')), (state?: boolean) => {
            state
                ? tick.register(
                      'misc:hideHud',
                      () =>
                          Enum.getValues(HudComponent).forEach((component) =>
                              native.hideHudComponentThisFrame(+component)
                          ),
                      0
                  )
                : tick.clear('misc:hideHud');
            native.displayRadar(!state);
        });
        this.addItem((this.creditsItem = new UIMenuItem('About\\Credits', `Trainer #1395 for ~b~alt:V~s~.`)));
        this.creditsItem.LeftBadge = BadgeStyle.Heart;
        this.creditsItem.RightLabel = `~h~ `;
        alt.on('keyup', (key: number) => {
            if (alt.isMenuOpen() || native.isPauseMenuActive()) return;
            if (key == Key.F7 && this.teleportToMarkerItem.Checked) {
                let handle = native.getFirstBlipInfoId(8);
                if (native.doesBlipExist(handle)) Player.teleportTo(native.getBlipInfoIdCoord(handle) as alt.Vector3);
            }
        });
    }

    private draw3DText(text: string, entity: alt.Entity) {
        new Text3D(
            text,
            undefined,
            0.06,
            Font.ChaletComprimeCologne,
            new alt.RGBA(255, 255, 255, 220),
            entity
        ).drawThisFrame();
    }
}
