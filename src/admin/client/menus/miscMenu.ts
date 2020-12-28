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
import { VehicleBones } from '../enums/vehicleBones';

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
                                  vehicle.pos
                              )
                          );
                          alt.Player.all.forEach((player) =>
                              this.draw3DText(
                                  `SCRIPTID ${player.scriptID}` +
                                      ` - ID ${player.id} - TYPE ${player.type}` +
                                      ` - MODEL ${player.model}` +
                                      ` - HEALTH ${native.getEntityHealth(player.scriptID)}` +
                                      ` - ARMOR ${native.getPedArmour(player.scriptID)}`,
                                  player.pos
                              )
                          );
                      },
                      0
                  )
                : tick.clear('misc:drawEntityInfo')
        );
        this.addItem((this.entitiesInfoItem = new UIMenuCheckboxItem('Show Vehicle Bones')), (state?: boolean) =>
            state ? tick.register('misc:draVehicleBones', this.renderNameTags, 0) : tick.clear('misc:draVehicleBones')
        );
        this.addItem((this.raycastInfoItem = new UIMenuCheckboxItem('Show Raycast Info')), (state?: boolean) =>
            state
                ? tick.register(
                      'misc:drawRaycastInfo',
                      () => {
                          let entityText;
                          let entity = alt.Entity.getByScriptID(
                              native.getEntityPlayerIsFreeAimingAt(alt.Player.local.scriptID, 0)[1]
                          );
                          if (!entity) {
                              const entity = native.getEntityPlayerIsFreeAimingAt(alt.Player.local.scriptID, 0)[1];
                              const model = native.getEntityModel(entity);
                              const objectCoords = native.getEntityCoords(entity, false);
                              entityText =
                                  ` ~y~ENTITY ${entity}` +
                                  ` MODEL: ${model}` +
                                  ` - POS (${objectCoords.x.toFixed(3)}, ${objectCoords.y.toFixed(
                                      3
                                  )}, ${objectCoords.z.toFixed(3)})` +
                                  ` - DISTANCE ${Game.getDistanceBetweenCoords(
                                      alt.Player.local.pos,
                                      objectCoords
                                  ).toFixed(3)}`;
                              this.draw3DText(entityText, objectCoords);
                              return;
                          }
                          entityText =
                              `~y~SCRIPTID ${entity.scriptID}` +
                              ` - ID ${entity.id}` +
                              ` - TYPE ${entity.type}` +
                              ` - POS (${entity.pos.x.toFixed(3)}, ${entity.pos.y.toFixed(3)}, ${entity.pos.z.toFixed(
                                  3
                              )})` +
                              ` - ${native.isEntityDead(entity.scriptID, false) ? 'DEAD' : 'ALIVE'}` +
                              ` - DISTANCE ${Game.getDistanceBetweenCoords(alt.Player.local.pos, entity.pos).toFixed(
                                  3
                              )}`;
                          if (entity instanceof alt.Vehicle) {
                              entityText = entityText.concat(
                                  ` - ${
                                      native.getVehicleDoorsLockedForPlayer(entity.scriptID, alt.Player.local.scriptID)
                                          ? 'LOCKED'
                                          : 'UNLOCKED'
                                  }`
                              );
                          }
                          this.draw3DText(entityText, entity.pos);
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

    private draw3DText(text: string, entity: alt.IVector3) {
        new Text3D(
            text,
            undefined,
            0.06,
            Font.ChaletComprimeCologne,
            new alt.RGBA(255, 255, 255, 220),
            entity
        ).drawThisFrame();
    }

    private renderNameTags() {
        const vehicle = native.getClosestVehicle(
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z,
            10,
            0,
            70
        );
        if (vehicle) {
            for (const bone in VehicleBones) {
                const objectBone = native.getEntityBoneIndexByName(vehicle, bone);
                if (objectBone !== -1) {
                    const seatPos = native.getWorldPositionOfEntityBone(vehicle, objectBone);
                    // alt.log(JSON.stringify({ seatBone, seatPos }));

                    const camCoords = native.getGameplayCamCoord();
                    let scale =
                        (1 /
                            native.getDistanceBetweenCoords(
                                camCoords.x,
                                camCoords.y,
                                camCoords.z,
                                seatPos.x,
                                seatPos.y,
                                seatPos.z,
                                true
                            )) *
                        20 *
                        ((1 / native.getGameplayCamFov()) * 100);
                    native.setTextScale(0, 0.04 * scale);
                    native.setDrawOrigin(seatPos.x, seatPos.y, seatPos.z, false);
                    native.beginTextCommandDisplayText('STRING');
                    native.setTextFont(4);
                    native.setTextOutline();
                    native.setTextCentre(true);
                    native.setTextProportional(true);
                    native.setTextColour(255, 255, 255, 255);
                    native.addTextComponentSubstringPlayerName(`${bone}`);
                    native.endTextCommandDisplayText(0, 0, 0);
                    native.clearDrawOrigin();
                }
            }
        }
    }
}
