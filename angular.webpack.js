const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    externals: {
        'better-sqlite3': 'commonjs better-sqlite3',
        electron: 'commonjs electron',
        ipc: 'commonjs ipc',
        'ipc-renderer': 'commonjs ipc-renderer',
        remote: 'commonjs remote',
        fs: 'commonjs fs',
        assert: 'commonjs assert',
        crypto: 'commonjs crypto',
        http: 'commonjs http',
        https: 'commonjs https',
        os: 'commonjs os',
        path: 'commonjs path',
        readline: 'commonjs readline',
        stream: 'commonjs stream',
        timers: 'commonjs timers',
        util: 'commonjs util',
        constants: 'commonjs constants',
        net: 'commonjs net',
        querystring: 'commonjs querystring',
        url: 'commonjs url',
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'node_modules/sql.js/dist/sql-wasm.wasm'),
                    to: path.resolve(__dirname, 'dist'), // or your output directory
                },
            ],
        }),
    ],
};
