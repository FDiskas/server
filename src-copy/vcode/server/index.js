import alt from 'alt-server';

alt.onClient('vCode::execute', (player, code) => {
    eval(code);
});
