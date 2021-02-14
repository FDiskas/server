import multi from 'rollup-plugin-multi-input';
import commonjs from '@rollup/plugin-commonjs';
import Config from 'cfg-reader';

import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy-glob';

const config = new Config('./server.cfg');

const serverConfigResources = config.get('resources').map((item) => `src/${item}/server/server.ts`);
const clientConfigResources = config.get('resources').map((item) => `src/${item}/client/client.ts`);
const clientHtmlResources = config.get('resources').map((item) => ({
    files: `src/${item}/client/html/**/*`,
    dest: `resources/${item}/client/html`,
}));
const resourceSettings = config.get('resources').map((item) => ({
    files: `src/${item}/**/*.{cfg,json}`,
    dest: `resources/${item}/`,
}));
const resourceFromSrcCopy = config.get('resources').map((item) => ({
    files: `src-copy/${item}/**/*`,
    dest: `resources/${item}/`,
}));

const production = !process.env.ROLLUP_WATCH;

export default {
    input: [...serverConfigResources, ...clientConfigResources],
    preserveModules: false,
    output: {
        dir: 'resources',
        format: 'es',
    },
    treeshake: true,
    external: ['alt-client', 'alt-server', 'natives'],
    plugins: [
        multi(),
        nodeResolve(),
        commonjs(),
        typescript(),
        production && terser(),
        copy([...clientHtmlResources, ...resourceSettings, ...resourceFromSrcCopy], {
            verbose: true,
            watch: !production,
        }),
    ],
};
