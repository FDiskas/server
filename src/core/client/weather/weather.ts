import * as alt from 'alt-client';
import native from 'natives';

alt.onServer('Player:ready', async (veh) => {
    alt.log(`Hello from alt:V Client`);

    // SNOW
    native.requestScriptAudioBank('ICE_FOOTSTEPS', false, 0);
    native.requestScriptAudioBank('SNOW_FOOTSTEPS', false, 0);
    native.setWindSpeed(12.0);

    native.setForceVehicleTrails(true);
    native.setForcePedFootstepsTracks(true);
});
