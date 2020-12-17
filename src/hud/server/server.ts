import * as alt from 'alt-server';

alt.log(`Hello from HUD Server`);

alt.on('playerConnect', (player) => {
    alt.emitClient(player, 'Player:connected');
});
