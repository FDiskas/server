import alt from 'alt-client';

alt.on('connectionComplete', (player) => {
  new alt.WebView('http://resource/client/html/index.html');
  alt.everyTick(() => {
    // alt.log(alt.Player.all.length);
    if (player) {
      alt.log(`${JSON.stringify(player)}`);
    }
  });
});
