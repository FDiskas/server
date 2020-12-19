import * as alt from 'alt-client';
import native from 'natives';
import './nametags';

const playFieldCoord = { x: -1212.79, y: -1673.52, z: 7 };
const airportCoord = { x: -1466.79, y: -2507.52, z: 0 };

alt.on('keyup', (key) => {
    if (key == 'I'.charCodeAt(0)) {
        if (native.isCutsceneActive()) {
            stopIntro();
        }
    }
});

/////// Just some variables ///////////////////
var hotkey = 88; //Change key - https://keycode.info/
var handsUp = false;
var status = false;
// const localPlayer = alt.Player.local;
var dict = 'missminuteman_1ig_2';
native.requestAnimDict(dict);
///////////////////////////////////////////////

alt.setInterval(() => {
    if (handsUp == true) {
        if (status == false) {
            native.taskPlayAnim(
                alt.Player.local.scriptID,
                dict,
                'handsup_enter',
                8.0,
                8.0,
                -1,
                50,
                0,
                false,
                false,
                false
            );
            status = true;
        }
    } else {
        if (status == true) {
            native.clearPedTasks(alt.Player.local.scriptID);
            status = false;
        }
    }
}, 10);

// Hands be in air until 'x' gets released ////
var hotkey = 79; //Change key - https://keycode.info/
var handsUp = false;
var status = false;
var dict = 'missminuteman_1ig_2';
native.requestAnimDict(dict);

alt.on('keydown', (key) => {
    // X Key pressed
    if (key === hotkey) {
        handsUp = true;
        if (handsUp && native.isPedSittingInAnyVehicle(alt.Player.local.scriptID)) {
            alt.everyTick(() => {
                native.disableControlAction(2, 59, true);
            });
        }
    }
});

alt.on('keyup', (key) => {
    if (key === hotkey) {
        handsUp = false;
        if (!handsUp && native.isPedSittingInAnyVehicle(alt.Player.local.scriptID)) {
            alt.everyTick(() => {
                native.enableControlAction(2, 59, true);
            });
        }
    }
});
///////////////////////////////////////////////

alt.on('consoleCommand', async (cmd, ...args) => {
    if (cmd != 'anim') return;

    alt.log('play animation');
    const dic = 'gestures@f@standing@casual';
    const anim = 'handsup_enter';
    native.requestAnimDict(dic);
    await WaitUntil(native.hasAnimDictLoaded, dic);

    native.taskPlayAnim(alt.Player.local.scriptID, dic, anim, 8.0, 8.0, 5000, 50, 0, false, false, false);
    // native.taskPlayAnim(alt.Player.local.scriptID, dic, anim, 8.0, 8.0, -1, 50, 0, false, false, false);
});

let crouched = false;
alt.on('keydown', (key) => {
    if (key == 17) {
        //ctrl
        native.disableControlAction(0, 36, true);
        if (
            !native.isPlayerDead(alt.Player.local.scriptID) &&
            !native.isPedSittingInAnyVehicle(alt.Player.local.scriptID)
        ) {
            if (!native.isPauseMenuActive()) {
                native.requestAnimSet('move_ped_crouched');
                if (crouched) {
                    native.clearPedTasks(alt.Player.local.scriptID);
                    alt.setTimeout(() => {
                        native.resetPedMovementClipset(alt.Player.local.scriptID, 0.45);
                        crouched = false;
                    }, 200);
                } else {
                    native.setPedMovementClipset(alt.Player.local.scriptID, 'move_ped_crouched', 0.45);
                    crouched = true;
                }
            }
        }
    }
});

alt.onServer('Player:ready', async (veh) => {
    alt.log(`Hello from alt:V Client`);

    native.requestScriptAudioBank('ICE_FOOTSTEPS', false, 0);
    native.requestScriptAudioBank('SNOW_FOOTSTEPS', false, 0);

    native.setForceVehicleTrails(true);
    native.setForcePedFootstepsTracks(true);

    native.prepareMusicEvent('GLOBAL_KILL_MUSIC');
    native.prepareMusicEvent('FM_INTRO_START');

    native.triggerMusicEvent('GLOBAL_KILL_MUSIC');
    native.triggerMusicEvent('FM_INTRO_START');

    // const character = ped.GetMeta('character');

    native.requestCutsceneWithPlaybackList('mp_intro_concat', 31, 8); // 103 = female, 31 = male
    native.setCutsceneEntityStreamingFlags('MP_Male_Character', 0, 1);

    // native.registerEntityForCutscene(0, character.Gender === Gender.Male ? "MP_Female_Character" : "MP_Male_Character" , 3, native.getHashKey(character.Gender === Gender.Male ? "mp_f_freemode_01" : "mp_m_freemode_01" ), 0);
    // native.registerEntityForCutscene(0, 'MP_Female_Character', 3, native.getHashKey('mp_f_freemode_01'), 0);
    // for (let i = 0; i <= 7; i++) {
    //     native.setCutsceneEntityStreamingFlags('MP_Plane_Passenger_' + i, 0, 1);
    //     native.registerEntityForCutscene(0, 'MP_Plane_Passenger_' + i, 3, native.getHashKey('mp_f_freemode_01'), 0);
    //     native.registerEntityForCutscene(0, 'MP_Plane_Passenger_' + i, 3, native.getHashKey('mp_m_freemode_01'), 0);
    // }

    // Make sure our cutscene looks nice
    native.newLoadSceneStartSphere(playFieldCoord.x, playFieldCoord.y, playFieldCoord.z, 1000, 0);

    // native.setWeatherTypeNow('EXTRASUNNY');
    native.startCutscene(6);

    // load gender character
    // native.registerEntityForCutscene(alt.Player.local.id, 'MP_Male_Character', 0, 0, 0);

    await AsyncWait(22_000);
    // Make sure our cutscene looks nice
    native.newLoadSceneStartSphere(airportCoord.x, airportCoord.y, airportCoord.z, 1000, 0);
    await AsyncWait(8_800);
    // Cleanup and stop cutscene after it's finished
    stopIntro();
});

const stopIntro = async () => {
    native.doScreenFadeOut(1000);
    await AsyncWait(2000);
    native.stopCutsceneImmediately();
    native.triggerMusicEvent('GLOBAL_KILL_MUSIC');
    await AsyncWait(2000);
    native.doScreenFadeIn(1000);

    native.newLoadSceneStop();
    native.setWeatherTypeNowPersist('XMAS');

    native.playAmbientSpeech1(alt.Player.local.scriptID, 'GREET_ACROSS_STREET', 'SPEECH_PARAMS_STANDARD', 0);
};

export const WaitUntil = (cb: (...args) => boolean, ...args) => {
    return new Promise((resolve: any, _) => {
        const et = alt.everyTick(() => {
            if (!cb(...args)) return;
            alt.clearEveryTick(et);
            resolve();
        });
    });
};

export const AsyncWait = (timeout: number) => {
    return new Promise((resolve: any) => {
        alt.setTimeout(resolve, timeout);
    });
};
