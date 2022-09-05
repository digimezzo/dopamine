module.exports = {
    resolve: {
        alias: {
            constants: require.resolve('constants-browserify'),
            crypto: require.resolve('crypto-browserify'),
            fs: require.resolve('browserify-fs'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify'),
            path: require.resolve('path-browserify'),
            readline: require.resolve('readline-browserify'),
            stream: require.resolve('stream-browserify'),
            timers: require.resolve('timers-browserify'),
        },
    },
    externals: {
        'better-sqlite3': 'commonjs better-sqlite3',
    },
};
