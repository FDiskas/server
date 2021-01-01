import * as alt from 'alt-server';

export function distance(vector1: alt.IVector3, vector2: alt.IVector3) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
    );
}
export function emitInRange(event: string, pos: alt.Vector3, range = 5, exclude = [], ...args: any) {
    for (let player of alt.Player.all) {
        if (exclude.includes(player)) {
            continue;
        }
        if (distance(player.pos, pos) > range) {
            continue;
        }

        alt.emitClient(player, event, ...args);
    }
}
