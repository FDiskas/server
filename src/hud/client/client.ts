import * as alt from 'alt-client';

alt.log(`Hello from example Client`);

alt.onServer('Player:connected', (player) => {
    const mainHud = new alt.WebView('http://resource/client/html/index.html');
    mainHud.unfocus();
    // mainHud.focus();
    alt.log('HUD Loaded.');
    // alt.showCursor(true);
});
