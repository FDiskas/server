import * as alt from 'alt-client';
import * as native from 'natives';

alt.onServer('Player:ready', (veh) => {
  alt.log(`Hello from alt:V Client`);

  native.requestScriptAudioBank('ICE_FOOTSTEPS', false, 0);
  native.requestScriptAudioBank('SNOW_FOOTSTEPS', false, 0);
  native.setPedScream(alt.Player.local.scriptID);

  native.setForceVehicleTrails(true);
  native.setForcePedFootstepsTracks(true);

  native.setVehicleAlarm(veh, true);
  native.startVehicleAlarm(veh);
  // native.sp
  // native.setEntityCoords
});
