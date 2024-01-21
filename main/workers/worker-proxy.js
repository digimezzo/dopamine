const { workerData, parentPort } = require('worker_threads');
const { arg } = workerData;

class WorkerProxy {
    task() {
        return arg.task;
    }

    postMessage(message) {
        parentPort?.postMessage(message);
    }

    applicationDataDirectory() {
        return arg.applicationDataDirectory;
    }

    downloadMissingAlbumCovers() {
        return arg.downloadMissingAlbumCovers;
    }

    skipRemovedFilesDuringRefresh() {
        return arg.skipRemovedFilesDuringRefresh;
    }
}

exports.WorkerProxy = WorkerProxy;
