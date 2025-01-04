class ApplicationPaths {
    constructor(fileAccess, workerProxy) {
        this.fileAccess = fileAccess;
        this.workerProxy = workerProxy;
    }
    getCoverArtCacheFullPath() {
        return this.fileAccess.combinePath([this.workerProxy.applicationDataDirectory(), 'Cache', 'CoverArt']);
    }
}

exports.ApplicationPaths = ApplicationPaths;
