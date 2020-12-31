import * as alt from 'alt-client';
import native from 'natives';
import { Action } from '../enums/actions';
import { Weather } from '../enums/weather';

alt.onServer(Action.PlayerReady, async (veh) => {
    // SNOW
    native.setWeatherTypeNowPersist(Weather.Xmas);
    native.requestScriptAudioBank('ICE_FOOTSTEPS', false, 0);
    native.requestScriptAudioBank('SNOW_FOOTSTEPS', false, 0);
    native.setWindSpeed(12.0);

    native.setForceVehicleTrails(true);
    native.setForcePedFootstepsTracks(true);
});
