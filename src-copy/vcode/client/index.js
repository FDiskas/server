import alt from 'alt-client';

let loaded = false;
let opened = false;
let currentMouseState = null;

let view = new alt.WebView('http://resource/client/html/index.html', false);

view.on('vCode::execute', (type, code) => {
    if (type === 'server') alt.emitServer('vCode::execute', code);
    else if (type === 'client') eval(code);
});

view.on('vCode::ready', () => {
    view.isVisible = false;
    loaded = true;
});

view.on('vCode::open', (active) => openEditor(active));

function showCursor(state) {
    try {
        alt.showCursor(state);
    } catch (err) {
        return;
    }
}

function openEditor(active) {
    opened = active;
    alt.toggleGameControls(!active);
    view.isVisible = active;

    if (currentMouseState !== active) {
        showCursor(active);
        currentMouseState = active;
    }

    if (active) view.focus();
}

alt.on('keyup', (key) => {
    if (!loaded) return;

    if (key === 115 /* F4 */) view.emit('vCode::open');
    else if (opened && key === 27 /* ESQ */) view.emit('vCode::open');
    else if (key === 116 /* F5 */) view.emit('vCode::createFile', 'server');
    else if (key === 117 /* F6 */) view.emit('vCode::createFile', 'client');
    else if (key === 118 /* F7 */) view.emit('vCode::executeFile');
    else if (key === 113 /* F2 */) view.emit('vCode::renameFile', 'server');
    else if (key === 46 /* DEL */) view.emit('vCode::deleteFile', 'client'); // Del
});
