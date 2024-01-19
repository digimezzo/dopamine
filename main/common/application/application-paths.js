const { FileAccess } = require('../io/file-access');
const { WorkerProxy } = require('../../workers/worker-proxy');

class ApplicationPaths {
    static getCoverArtCacheFullPath() {
        return FileAccess.combinePath([WorkerProxy.applicationDataDirectory(), 'Cache', 'CoverArt']);
    }
}

exports.ApplicationPaths = ApplicationPaths;
