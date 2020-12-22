import * as alt from 'alt-server';

alt.on('playerConnect', (player: alt.Player) => {
    const allCars = alt.Vehicle.all;

    allCars.forEach((car) => {
        car.destroy();
    });
    const spawn = {
        x: 456.035,
        y: -644.921,
        z: 28.359,
    };

    player.spawn(spawn.x, spawn.y, spawn.z, 0);
    player.model = `mp_m_freemode_01`;

    alt.setTimeout(() => {
        new alt.Vehicle(
            'bus',
            player.pos.x + 5,
            player.pos.y + 5,
            player.pos.z,
            player.pos.x,
            player.pos.y,
            player.pos.z
        );
    }, 3000);
});
