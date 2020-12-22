import * as alt from 'alt-client';

export function distance(vector1: alt.IVector3, vector2: alt.IVector3) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
    );
}

/**
 * Get the closest vehicle to a player.
 */
export function getClosestVehicle(player: { pos: alt.IVector3 }): { vehicle: alt.Vehicle; distance: number } {
    let data = { vehicle: null, distance: 0 };
    alt.Vehicle.all.forEach((vehicle) => {
        let dis = distance(player.pos, vehicle.pos);

        if (dis < data.distance || data.distance == 0) {
            data = { vehicle, distance: dis };
        }
    });

    return data;
}
