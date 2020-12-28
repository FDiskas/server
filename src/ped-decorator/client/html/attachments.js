// @ts-check
var objectList = [
    {
        id: objectAmount,
        hash: 'prop_skid_trolley_2',
        bone: 24818,
        posX: '0',
        posY: '0',
        posZ: '0',
        rotX: '0',
        rotY: '0',
        rotZ: '0',
    },
];

var editObjectId = 0;
var objectAmount = 0;

function closeWindow(Window) {
    document.getElementById(Window).style.display = 'none';

    if (Window == 'ChooseObject') {
        document.getElementById('EditObject').style.left = '1vw';
        document.getElementById('EditObject').style.borderBottomLeftRadius = '1vw';
        document.getElementById('MainWindow').style.borderBottomRightRadius = '1vw';
    } else if (Window == 'EditObject') {
        document.getElementById('ChooseObject').style.borderBottomRightRadius = '1vw';
        document.getElementById('MainWindow').style.borderBottomRightRadius = '1vw';
    }
}

function openWindow(Window) {
    if (objectList.length > 0) {
        document.getElementById(Window).style.display = 'block';
        if (Window == 'EditObject') {
            document.getElementById('ChooseObject').style.borderBottomRightRadius = '0vw';
            document.getElementById('MainWindow').style.borderBottomRightRadius = '0vw';
        } else if (Window == 'ChooseObject') {
            document.getElementById('EditObject').style.left = '21vw';
            document.getElementById('EditObject').style.borderBottomLeftRadius = '0vw';
            var EditWindow = document.getElementById('EditObject').style.display;
            if (EditWindow == 'block') {
                document.getElementById('MainWindow').style.borderBottomRightRadius = '0vw';
            }
        } else if (Window == 'BoneList') {
            updateBoneList();
        }
    }
}

function deleteObject() {
    closeWindow('EditObject');
    objectList.map((item, index) => {
        if (item.id == editObjectId) {
            objectList.splice(index, 1);
        }
    });
    alt.emit('AttachmentEditor:deleteObject', editObjectId);
    editObjectId = 0;
    updateObjectList();
}

function updatePosAndRot() {
    var PosX = document.getElementById('editItemSliderPosX').value;
    var PosY = document.getElementById('editItemSliderPosY').value;
    var PosZ = document.getElementById('editItemSliderPosZ').value;
    var RotX = document.getElementById('editItemSliderRotX').value;
    var RotY = document.getElementById('editItemSliderRotY').value;
    var RotZ = document.getElementById('editItemSliderRotZ').value;

    document.getElementById('editItemPosXValue').innerText = PosX;
    document.getElementById('editItemPosYValue').innerText = PosY;
    document.getElementById('editItemPosZValue').innerText = PosZ;
    document.getElementById('editItemRotXValue').innerText = RotX;
    document.getElementById('editItemRotYValue').innerText = RotY;
    document.getElementById('editItemRotZValue').innerText = RotZ;

    var editObjectData = {};

    objectList.map((item) => {
        if (item.id == editObjectId) {
            item.posX = PosX;
            item.posY = PosY;
            item.posZ = PosZ;
            item.rotX = RotX;
            item.rotY = RotY;
            item.rotZ = RotZ;
            editObjectData = item;
        }
    });

    alt.emit('AttachmentEditor:updateObject', editObjectData);
}

function closeDecorator() {
    alt.emit('AttachmentEditor:close');
}

function cloneObject() {
    objectList.map((item) => {
        if (item.id == editObjectId) {
            objectList.push({
                id: objectAmount,
                hash: item.hash,
                bone: item.bone,
                posX: item.posX,
                posY: item.posY,
                posZ: item.posZ,
                rotX: item.rotX,
                rotY: item.rotY,
                rotZ: item.rotZ,
            });
            objectAmount++;
            updateObjectList();

            alt.emit(
                'AttachmentEditor:addNewObject',
                objectAmount - 1,
                item.hash,
                item.bone,
                item.posX,
                item.posY,
                item.posZ,
                item.rotX,
                item.rotY,
                item.rotZ
            );
        }
    });
}

function updateObject(Type) {
    var editObjectData = {};
    switch (Type) {
        case 'objectHash': {
            var newObjectHash = document.getElementById('editItemHash').value;
            objectList.map((item) => {
                if (item.id == editObjectId) {
                    item.hash = newObjectHash;
                    editObjectData = item;
                }
            });
            updateObjectList();
            break;
        }
        case 'objectBone': {
            var newObjectBone = document.getElementById('editItemBone').value;
            objectList.map((item) => {
                if (item.id == editObjectId) {
                    item.bone = parseInt(newObjectBone);
                    editObjectData = item;
                }
            });
            updateObjectList();

            updateBoneList();
            break;
        }
    }

    alt.emit('AttachmentEditor:updateObject', editObjectData);
}

function printObjects() {
    if (objectList.length > 0) {
        alt.emit('AttachmentEditor:logAttachment');
    }
}

function chooseObject(objectId) {
    editObjectId = objectId;
    objectList.map((item) => {
        if (item.id == objectId) {
            document.getElementById('editItemHash').value = item.hash;
            document.getElementById('editItemBone').value = `${item.bone}`;
            document.getElementById('editItemSliderPosX').value = item.posX;
            document.getElementById('editItemSliderPosY').value = item.posY;
            document.getElementById('editItemSliderPosZ').value = item.posZ;
            document.getElementById('editItemSliderRotX').value = item.rotX;
            document.getElementById('editItemSliderRotY').value = item.rotY;
            document.getElementById('editItemSliderRotZ').value = item.rotZ;
            document.getElementById('editItemPosXValue').innerText = item.posX;
            document.getElementById('editItemPosYValue').innerText = item.posY;
            document.getElementById('editItemPosZValue').innerText = item.posZ;
            document.getElementById('editItemRotXValue').innerText = item.rotX;
            document.getElementById('editItemRotYValue').innerText = item.rotY;
            document.getElementById('editItemRotZValue').innerText = item.rotZ;
        }
    });
    openWindow('EditObject');
    updateBoneList();
}

function chooseBone(boneId) {
    var editObjectData = {};
    objectList.map((item) => {
        if (item.id == editObjectId) {
            item.bone = boneId;
            document.getElementById('editItemBone').value = boneId;
            editObjectData = item;
        }
    });
    updateBoneList();
    alt.emit('AttachmentEditor:updateObject', editObjectData);
}

function addNewObject() {
    objectList.push({
        id: objectAmount,
        hash: 'ng_proc_crate_03a',
        bone: 24818,
        posX: '0',
        posY: '0',
        posZ: '0',
        rotX: '0',
        rotY: '0',
        rotZ: '0',
    });

    var chooseObjectButton = document.getElementById('chooseObjectButton');
    chooseObjectButton.classList.remove('DisableButton');
    var printObjectsButton = document.getElementById('printObjectsButton');
    printObjectsButton.classList.remove('DisableButton');
    var animationViewerButton = document.getElementById('editItemButton');
    animationViewerButton.classList.remove('DisableButton');

    updateObjectList();
    objectAmount++;
    alt.emit('AttachmentEditor:addNewObject', objectAmount - 1, 'ng_proc_crate_03a', 24816, 0, 0, 0, 0, 0, 0);
}

function updateObjectList() {
    var currentObjectList = '';

    objectList.map((item, index) => {
        currentObjectList +=
            "<div class='ChooseObjectItem' onclick='chooseObject(" +
            item.id +
            ")'>" +
            `<div class='ChooseObjectItemTitle'>Object #${item.id}</div>` +
            `<div class='ChooseObjectItemName'>${item.hash}</div>` +
            '</div>';
    });

    document.getElementById('AttachmentObjectList').innerHTML = currentObjectList;
}

function updateBoneList() {
    var currentBoneList = '';
    boneList.map((item, index) => {
        objectList.map((obj) => {
            if (obj.id == editObjectId) {
                if (obj.bone === item.id) {
                    currentBoneList +=
                        "<div class='ChooseObjectItem SelectedItem' onclick='chooseBone(" + item.id + ")'>";
                } else {
                    currentBoneList += "<div class='ChooseObjectItem' onclick='chooseBone(" + item.id + ")'>";
                }
            }
        });
        currentBoneList +=
            `<div class='ChooseObjectItemTitle'>Name: ${item.name}</div>` +
            `<div class='ChooseObjectItemName'>Id: ${item.id}</div>` +
            '</div>';
    });

    document.getElementById('AttachmentBoneList').innerHTML = currentBoneList;
}

function playAnimation() {
    var animDict = document.getElementById('animationDict').value;
    var animName = document.getElementById('animationName').value;
    if (animDict.length != 0) {
        if (animName.length != 0) {
            alt.emit('AttachmentEditor:playAnimation', animDict, animName);
        }
    }
}
function stopAnimation() {
    alt.emit('AttachmentEditor:stopAnimation');
}

var boneList = [
    {
        name: 'Spine 1',
        id: 24816,
    },
    {
        name: 'Spine 2',
        id: 24817,
    },
    {
        name: 'Spine 3 (default)',
        id: 24818,
    },
    {
        name: 'Head',
        id: 31086,
    },
    {
        name: 'Right Hand',
        id: 57005,
    },
    {
        name: 'Right Thumb Finger',
        id: 58866,
    },
    {
        name: 'Right Index Finger',
        id: 58867,
    },
    {
        name: 'Right Middle Finger',
        id: 58868,
    },
    {
        name: 'Right Ring Finger',
        id: 58869,
    },
    {
        name: 'Right Small Finger',
        id: 58870,
    },
    {
        name: 'Right Foot',
        id: 52301,
    },
    {
        name: 'Left Hand',
        id: 18905,
    },
    {
        name: 'Left Thumb Finger',
        id: 26610,
    },
    {
        name: 'Left Index Finger',
        id: 26611,
    },
    {
        name: 'Left Middle Finger',
        id: 26612,
    },
    {
        name: 'Left Ring Finger',
        id: 26613,
    },
    {
        name: 'Left Small Finger',
        id: 26614,
    },
    {
        name: 'Left Foot',
        id: 14201,
    },
];
