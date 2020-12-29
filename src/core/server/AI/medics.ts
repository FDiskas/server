import * as alt from 'alt-server';
import { Action } from '../../client/enums/actions';
import { VehicleHash } from '../../client/enums/vehicleHash';

alt.onClient('prepareMedic', (player, ambulanceCoords: alt.IVector3, paramedicCoords: alt.IVector3) => {
    // Check if Z index is high then take a helicopter

    const vehicle = new alt.Vehicle(
        // player.pos.z - ambulanceCoords.z >= 10 ? VehicleHash.Swift : VehicleHash.Ambulance,
        VehicleHash.Swift,
        ambulanceCoords.x,
        ambulanceCoords.y,
        player.pos.z + 100,
        0,
        0,
        paramedicCoords.z
    );
    vehicle.dirtLevel = 0;
    vehicle.engineOn = true;
    vehicle.numberPlateText = 'help';

    alt.setTimeout(() => {
        alt.emitClient(player, Action.PedParamedicGetToCar, vehicle, paramedicCoords);
    }, 1000);
});
alt.on('playerDeath', (victim: alt.Player, killer: alt.Entity, weaponHash: number) => {
    // get closest road
    alt.emitClient(victim, 'closestRoad');
});
