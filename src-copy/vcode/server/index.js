/// <reference path="../../../node_modules/@altv/types-server/index.d.ts" />

import alt from 'alt-server';
import config from '../config';
import fs from 'fs';
import path from 'path';

const serverTypes = fs.readFileSync(path.join(alt.getResourcePath(alt.resourceName), 'server.d.ts'));
const clientTypes = fs.readFileSync(path.join(alt.getResourcePath(alt.resourceName), 'client.d.ts'));
const nativeTypes = fs.readFileSync(path.join(alt.getResourcePath(alt.resourceName), 'natives.d.ts'));

alt.onClient('vCode::config', (player) => {
    alt.emitClient(player, 'vCode::config', config, serverTypes.toString(), clientTypes.toString(), nativeTypes.toString());
});

alt.onClient('vCode::execute', (player, code) => {
    eval(code);
});