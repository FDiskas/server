// @ts-check
import multi from 'rollup-plugin-multi-input';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { readFileSync } from 'fs';
import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy-glob';

function looseJsonParse(obj) {
    return Function('"use strict";return (' + obj + ')')();
}

const serverConfigFile = 'server.cfg';
const serverConfigContent = readFileSync(serverConfigFile, 'utf8').replace(/\#/gi, '//');
const serverConfig = looseJsonParse(`{ ${serverConfigContent} }`);

const serverConfigResources = serverConfig.resources.map((item) => `src/${item}/server/server.ts`);
const clientConfigResources = serverConfig.resources.map((item) => `src/${item}/client/client.ts`);
const clientHtmlResources = serverConfig.resources.map((item) => ({
    files: `src/${item}/client/html/**/*`,
    dest: `resources/${item}/client/html`,
}));
const resourceSettings = serverConfig.resources.map((item) => ({
    files: `src/${item}/resource.cfg`,
    dest: `resources/${item}/`,
}));
const resourceFromSrcCopy = serverConfig.resources.map((item) => ({
    files: `src-copy/${item}/**/*`,
    dest: `resources/${item}/`,
}));

export default {
    input: [...serverConfigResources, ...clientConfigResources],
    output: {
        dir: 'resources',
    },
    treeshake: true,
    external: ['alt-client', 'alt-server', 'natives'],
    plugins: [
        multi(),
        resolve(),
        typescript({ abortOnError: true }),
        terser(),
        copy([...clientHtmlResources, ...resourceSettings, ...resourceFromSrcCopy], {
            verbose: true,
            watch: false,
        }),
    ],
};
