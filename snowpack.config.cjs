// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/#configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    buildOptions: {
        out: 'resources',
        clean: true,
    },
    mount: {
        src: { url: '/', resolve: true },
        public: '/',
    },
    // plugins: ['@snowpack/plugin-typescript'],
    plugins: [['@snowpack/plugin-typescript', { args: '--project tsconfig.json' }]],
    installOptions: {
        treeshake: false,
        polyfillNode: true,
        externalPackage: [
            'fs',
            'fsevents',
            'worker_threads',
            'alt',
            'alt-client',
            'alt-server',
            'natives',
            ...Object.keys(require('./package.json').devDependencies),
        ],
        // rollup: {
        //   plugins: [require('@rollup/plugin-typescript')()],
        // },
    },
};
