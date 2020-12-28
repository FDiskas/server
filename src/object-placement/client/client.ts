import * as alt from 'alt-client';
import * as native from 'natives';

const player = alt.Player.local;

let showObject = false;
let alphaMode = false;
let newObjectToPlace = null;
let placeObjectDistance = 3;
let tmpObject = null;

alt.on('PlacingModule:setObject', (object) => {
    showAlphaObject(object);
});

function showAlphaObject(object) {
    requestModelPromise(native.getHashKey(object)).then((suck) => {
        if (suck) {
            newObjectToPlace = native.createObjectNoOffset(
                native.getHashKey(object),
                player.pos.x,
                player.pos.y,
                player.pos.z,
                true,
                false,
                true
            );
            native.setEntityAlpha(newObjectToPlace, 150, true);
            native.setEntityCollision(newObjectToPlace, false, true);
            showObject = true;
        }
    });
}

function requestModelPromise(model) {
    return new Promise((resolve, reject) => {
        if (!native.hasModelLoaded(model)) {
            native.requestModel(model);
        }
        // return resolve(false);
        let inter = alt.setInterval(() => {
            if (native.hasModelLoaded(model)) {
                alt.clearInterval(inter);
                return resolve(true);
            }
        }, 10);
    });
}

alt.everyTick(() => {
    let pos = player.pos;
    let fv = native.getEntityForwardVector(player.scriptID);

    var posFront = {
        x: pos.x + fv.x * placeObjectDistance,
        y: pos.y + fv.y * placeObjectDistance,
        z: pos.z,
    };
    if (showObject) {
        //go away
        if (native.isControlPressed(2, 27)) {
            if (alphaMode) {
                alt.log(`OLD ALPHA ${native.getEntityAlpha(newObjectToPlace)}`);
                alt.log(`NEW ALPHA ${native.getEntityAlpha(newObjectToPlace) + 1}`);
                native.setEntityAlpha(newObjectToPlace, native.getEntityAlpha(newObjectToPlace) + 1, true);
            } else {
                if (placeObjectDistance < 10) {
                    placeObjectDistance += 0.1;
                }
            }
        }
        //come closer
        if (native.isControlPressed(2, 173)) {
            if (alphaMode) {
                native.setEntityAlpha(newObjectToPlace, native.getEntityAlpha(newObjectToPlace) - 1, true);
            } else {
                if (placeObjectDistance > 0) {
                    placeObjectDistance -= 0.1;
                }
            }
        }
        //turn left
        if (native.isControlPressed(2, 174)) {
            let objectRot = native.getEntityRotation(newObjectToPlace, 0);
            native.setEntityRotation(newObjectToPlace, objectRot.x, objectRot.y, objectRot.z + 3, 2, false);
        }
        //turn right
        if (native.isControlPressed(2, 175)) {
            let objectRot = native.getEntityRotation(newObjectToPlace, 0);
            native.setEntityRotation(newObjectToPlace, objectRot.x, objectRot.y, objectRot.z - 3, 2, false);
        }

        if (newObjectToPlace !== null) {
            native.setEntityCoords(newObjectToPlace, posFront.x, posFront.y, player.pos.z, false, false, false, true);
            native.placeObjectOnGroundProperly(newObjectToPlace);
        }
    }
});

alt.on('keyup', (key) => {
    if (alt.isMenuOpen() || native.isPauseMenuActive()) return;
    if (key === 'B'.charCodeAt(0)) {
        alt.emit('PlacingModule:setObject', 'bus');
    }
    //SPACE to abort it
    if (key === 0x20) {
        alt.log('PlacingModule: Object deleted');
        native.deleteObject(newObjectToPlace);
        native.deleteObject(tmpObject);
        showObject = false;
        newObjectToPlace = null;
    }
    //E to place the item
    if (key === 0x45) {
        if (showObject) {
            alt.log('~g~Coords: ' + JSON.stringify(native.getEntityCoords(newObjectToPlace, true)));
            alt.log('~g~Rotation: ' + JSON.stringify(native.getEntityRotation(newObjectToPlace, 2)));
            native.placeObjectOnGroundProperly(newObjectToPlace);
            native.freezeEntityPosition(newObjectToPlace, true);
            native.setModelAsNoLongerNeeded(newObjectToPlace);
            native.setEntityAlpha(newObjectToPlace, 255, true);
            native.setEntityCollision(newObjectToPlace, true, true);
            //Emit-Serverevent to do something serverside
            alt.emitServer('PlacingModule', newObjectToPlace);
            newObjectToPlace = null;
            showObject = false;
        }
    }
    //LEFTSHIFT to change alpha
    if (key === 0x10) {
        if (showObject) {
            alt.log(`PlacingModule: Changed alphaMode to ${alphaMode}`);
            alphaMode = !alphaMode;
        }
    }
});
