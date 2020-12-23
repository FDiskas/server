import * as alt from 'alt-client';
import native from 'natives';
import { VehicleBones } from '../enums/vehicleBones';
import { distance, getClosestVehicle } from '../lib/distance';

const vehicleTick = alt.everyTick(renderNameTags);
alt.on('resourceStop', () => {
    alt.clearEveryTick(vehicleTick);
});

function renderNameTags() {
    const vehicle = getClosestVehicle(alt.Player.local).vehicle;
    for (const bone in VehicleBones) {
        const objectBone = native.getEntityBoneIndexByName(vehicle.scriptID, bone);
        if (objectBone !== -1) {
            const seatPos = native.getWorldPositionOfEntityBone(vehicle.scriptID, objectBone);
            // alt.log(JSON.stringify({ seatBone, seatPos }));

            let scale =
                (1 / distance(native.getGameplayCamCoord(), { ...seatPos })) *
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
