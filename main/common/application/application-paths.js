const { FileAccess } = require('../file-access');
const { workerData } = require('worker_threads');
const { arg } = workerData;

class ApplicationPaths {
    static getCoverArtCacheFullPath() {
        return FileAccess.combinePath([arg.applicationDataDirectory, 'Cache', 'CoverArt']);
    }
}

exports.ApplicationPaths = ApplicationPaths;
