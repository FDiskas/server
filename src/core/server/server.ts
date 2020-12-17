import * as alt from 'alt-server';

// import * as native from 'natives';

alt.log(`Server with example resource started.`);

const spawn = {
    x: -1291.7142333984375,
    y: 83.43296813964844,
    z: 54.8916015625,
};

export interface RPPlayer extends alt.Player {
    lastVehicle: alt.Vehicle;
}

alt.on('playerConnect', (player: RPPlayer) => {
    player.model = `mp_m_freemode_01`;
    player.spawn(spawn.x, spawn.y, spawn.z, 0);

    alt.setTimeout(() => {
        player.setWeather(alt.WeatherType.Xmas);
        player.setDateTime(12, 10, 2020, 12, 12, 12);
        player.lastVehicle = new alt.Vehicle('bus', player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);

        alt.emitClient(player, 'Player:ready', player.lastVehicle);
    }, 3000);
});

alt.on('playerDisconnect', (player) => {
    // player.destroy();
    // player.vehicle.destroy();
});
