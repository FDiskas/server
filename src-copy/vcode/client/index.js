/// <reference path="../../../node_modules/@altv/types-client/index.d.ts" />
/// <reference path="../../../node_modules/@altv/types-natives/index.d.ts" />

import alt from 'alt-client';
import native from 'natives';

let loaded = false;
let opened = false;
let currentMouseState = null;
let view = null;
let config = null;

alt.on('connectionComplete', () => {
    alt.emitServer('vCode::config');
});

alt.onServer('vCode::config', (_config, serverTypes, clientTypes, nativeTypes) => {
    config = _config;
    view = new alt.WebView(config.DEBUG ? 'http://localhost:8080/index.html' : 'http://resource/client/html/index.html', false);
    
    view.on('vCode::toggle', (active) => toggleEditor(active));

    view.on('vCode::execute', (type, code) => {
        if (type === 'server') alt.emitServer('vCode::execute', code);
        else if (type === 'client') eval(code);
    });

    view.on('vCode::ready', () => {
        view.isVisible = false;
        loaded = true;
        view.emit('vCode::config', config, serverTypes, clientTypes, nativeTypes);
    });
});

function showCursor(state) {
    try {
        alt.showCursor(state);
    } catch (err) {
        return;
    }
}

function toggleEditor(active) {
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
    if (!config || !loaded) return;

    if (key === config.TOGGLE_EDITOR) view.emit('vCode::toggle');
    else if (opened && key === config.CLOSE_EDITOR) view.emit('vCode::toggle');
    else if (!opened && key === config.RENAME_CURRENT_FILE) view.emit('vCode::renameFile'); 
    else if (!opened && key === config.CREATE_NEW_SERVER_FILE) view.emit('vCode::createFile', 'server'); 
    else if (!opened && key === config.CREATE_NEW_CLIENT_FILE) view.emit('vCode::createFile', 'client'); 
    else if (key === config.EXECUTE_CURRENT_FILE) view.emit('vCode::executeFile');
    else if (!opened && key === config.DELETE_CURRENT_FILE) view.emit('vCode::deleteFile'); 
});