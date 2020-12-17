import * as alt from 'alt-client';
import * as native from 'natives';

const playFieldCoord = { x: -1212.79, y: -1673.52, z: 7 };
const airportCoord = { x: -1466.79, y: -2507.52, z: 0 };

alt.on('keyup', (key) => {
    if (key == 'I'.charCodeAt(0)) {
        if (native.isCutsceneActive()) {
            stopIntro();
        }
    }
});

alt.on('consoleCommand', async (cmd, ...args) => {
    if (cmd != 'test') return;
    alt.log('command: ' + cmd);

    alt.everyTick(Test);
});

function Test(): void {
    alt.log('EveryTick: Test');
}

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
