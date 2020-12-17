import * as alt from 'alt-client';
import * as game from 'natives';

var AttachmentEditor = null;

var objectList = [];

var LockButtons = false;

var isAnimationRunning = false;

alt.everyTick(() => {
  game.invalidateIdleCam();
  if (AttachmentEditor != null) {
    if (LockButtons == true) {
      game.disableAllControlActions(2);
      game.disableAllControlActions(32);
      game.disableAllControlActions(0);
    } else {
      game.enableAllControlActions(2);
      game.enableAllControlActions(32);
      game.enableAllControlActions(0);
    }

    if (isAnimationRunning) {
      game.freezeEntityPosition(alt.Player.local.scriptID, true);
    } else {
      game.freezeEntityPosition(alt.Player.local.scriptID, false);
    }
  } else {
    game.enableAllControlActions(2);
    game.enableAllControlActions(32);
    game.enableAllControlActions(0);
  }
});

alt.on('keydown', (key) => {
  if (key == 0x58) {
    LockButtons = !LockButtons;
  }
  if (key == 0x7b) {
    if (AttachmentEditor == null) {
      AttachmentEditor = new alt.WebView(
        'http://resource/html/attachments.html'
      );
      alt.showCursor(true);
      AttachmentEditor.focus();

      AttachmentEditor.on('AttachmentEditor:close', () => {
        game.clearPedTasks(alt.Player.local.scriptID);
        isAnimationRunning = false;

        AttachmentEditor.destroy();
        AttachmentEditor = null;
        alt.showCursor(false);

        objectList.map((item) => {
          game.deleteObject(item.object);
        });

        objectList = [];
      });

      AttachmentEditor.on('AttachmentEditor:deleteObject', (id) => {
        objectList.map((item, index) => {
          if (item.id == id) {
            game.deleteObject(item.object);
            objectList.splice(index, 1);
          }
        });
        UpdateAttachments();
      });

      AttachmentEditor.on(
        'AttachmentEditor:addNewObject',
        (id, hash, bone, posX, posY, posZ, rotX, rotY, rotZ) => {
          var attachObject = game.createObject(
            game.getHashKey(hash),
            0,
            0,
            0,
            false,
            false,
            false
          );
          game.setEntityCollision(attachObject, false, false);

          objectList.push({
            id: id,
            object: attachObject,
            hash: hash,
            bone: bone,
            posX: posX,
            posY: posY,
            posZ: posZ,
            rotX: rotX,
            rotY: rotY,
            rotZ: rotZ,
          });

          UpdateAttachments();
        }
      );

      AttachmentEditor.on('AttachmentEditor:updateObject', (objectData) => {
        objectList.map((item) => {
          if (item.id == objectData.id) {
            if (item.hash != objectData.hash) {
              game.deleteObject(item.object);
              item.hash = objectData.hash;
              var newObject = game.createObject(
                game.getHashKey(item.hash),
                0,
                0,
                0,
                false,
                false,
                false
              );
              game.setEntityCollision(newObject, false, false);

              item.object = newObject;
            }

            item.bone = objectData.bone;
            item.posX = objectData.posX;
            item.posY = objectData.posY;
            item.posZ = objectData.posZ;
            item.rotX = objectData.rotX;
            item.rotY = objectData.rotY;
            item.rotZ = objectData.rotZ;

            UpdateAttachments();
          }
        });
      });

      AttachmentEditor.on('AttachmentEditor:logAttachment', () => {
        alt.log(`//----------------------------------------`);
        alt.log('Attachment Editor Objects');
        alt.log(`//----------------------------------------`);
        objectList.map((item, index) => {
          alt.log(`//////////////////////////////////////////`);
          alt.log(`var Object[${index}] = null;`);
          alt.log(`//========================================`);
          alt.log(
            `Object[${index}] = game.createObject(game.getHashKey(${item.hash}), 0, 0, 0, false, false, false);`
          );
          alt.log(`game.setEntityCollision(Object[${index}], false, false);`);
          alt.log(`//========================================`);
          alt.log(
            `let boneIndex = game.getPedBoneIndex(alt.Player.local.scriptID, ${item.bone});`
          );
          alt.log(
            `game.attachEntityToEntity(Object[${index}], alt.Player.local.scriptID, boneIndex, ${item.posX}, ${item.posY}, ${item.posZ}, ${item.rotX}, ${item.rotY}, ${item.rotZ}, 0, 0, 0, 0, 2, 1);`
          );
          alt.log(`//////////////////////////////////////////`);
        });
        alt.log(`//----------------------------------------`);
      });

      AttachmentEditor.on(
        'AttachmentEditor:playAnimation',
        (animDict, animName) => {
          alt.log('Try play Animation: ' + animDict + ' | ' + animName);
          applyAnimation(animDict, animName);
        }
      );

      AttachmentEditor.on('AttachmentEditor:stopAnimation', () => {
        game.clearPedTasks(alt.Player.local.scriptID);
        isAnimationRunning = false;
      });
    }
  }
});

function UpdateAttachments() {
  objectList.map((item) => {
    let boneIndex = game.getPedBoneIndex(alt.Player.local.scriptID, item.bone);

    game.attachEntityToEntity(
      item.object,
      alt.Player.local.scriptID,
      boneIndex,
      item.posX,
      item.posY,
      item.posZ,
      item.rotX,
      item.rotY,
      item.rotZ,
      false,
      false,
      false,
      false,
      2,
      true
    );
  });
}

function requestAnimDictPromise(animDict) {
  return new Promise((resolve, reject) => {
    if (!game.doesAnimDictExist(animDict)) return resolve(false);
    game.requestAnimDict(animDict);
    let inter = alt.setInterval(() => {
      if (game.hasAnimDictLoaded(animDict)) {
        alt.clearInterval(inter);
        return resolve(true);
      }
    }, 10);
  });
}

function applyAnimation(animDict, animName) {
  requestAnimDictPromise(animDict).then((succ) => {
    if (succ) {
      game.taskPlayAnim(
        alt.Player.local.scriptID,
        animDict,
        animName,
        1.0,
        1,
        -1,
        1,
        0,
        false,
        false,
        false
      );
      isAnimationRunning = true;
    }
  });
}
