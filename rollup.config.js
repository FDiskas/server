import multi from '@rollup/plugin-multi-entry';
// import { resolve } from 'path';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import readConfig from 'properties-reader';

const serverConfigFile = './server.cfg';
const serverConfig = readConfig(serverConfig);
const serverConfigResources = serverConfig.get('resources').map((item) => `src/${item}/server/server.ts`);
const clientConfigResources = serverConfig.get('resources').map((item) => `src/${item}/client/client.ts`);

export default {
    input: [...serverConfigResources, ...clientConfigResources],
    output: {
        dir: 'resources',
    },
    external: ['alt-client', 'alt-server', 'natives'],
    plugins: [multi(), typescript({ abortOnError: true }), terser()],
};
