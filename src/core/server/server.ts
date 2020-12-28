import * as alt from 'alt-server';

import './vehicle/doors';
import './animations/taxi';

import { Action } from '../client/enums/actions';
import { PedHash } from '../client/enums/pedHash';
import { VehicleColor } from '../client/enums/vehicleColor';
import { VehicleHash } from '../client/enums/vehicleHash';

const spawn = {
    x: -1045.25,
    y: -2750.778,
    z: 21.363,
};

const busPos = { x: -1033.796142578125, y: -2730.409423828125, z: 20.085569381713867 };

export interface RPPlayer extends alt.Player {
    lastVehicle: alt.Vehicle;
}

alt.on('playerConnect', (player: RPPlayer) => {
    // TODO: character creation
    player.model = PedHash.mp_m_freemode_01;
    player.setWeather(alt.WeatherType.ExtraSunny);
    player.setDateTime(12, 10, 2020, 12, 12, 12);

    // Spawn Bus position
    const vehicle = new alt.Vehicle(VehicleHash.Coach, busPos.x, busPos.y, busPos.z, 0, 0, -2);

    // vehicle.modKit = 1;
    vehicle.dirtLevel = 0;
    vehicle.engineOn = false;
    vehicle.numberPlateText = 'welcome';
    vehicle.activeRadioStation = alt.RadioStation.LosSantosRockRadio;
    vehicle.primaryColor = VehicleColor.MetallicRed;

    player.spawn(spawn.x, spawn.y, spawn.z, 0);

    alt.emitClient(player, Action.PlayerReady);

    alt.setTimeout(() => {
        alt.emitClient(player, Action.TakeBusFromAirport, vehicle);
    }, 5000);

    alt.on('resourceStop', () => {
        alt.log('Resource server stopped');
        try {
            vehicle.destroy();
        } catch (error) {
            alt.log('Cant destroy bus');
            alt.logError(error);
        }
    });
});

alt.on('playerDisconnect', (player) => {
    if (player.vehicle) {
        player.vehicle.destroy();
    }
});

alt.onClient(Action.TakeBusToGarage, (player: alt.Player, bus: alt.Vehicle) => {
    bus.destroy();
});
