const { workerData, parentPort } = require('worker_threads');

class WorkerProxy {
    task() {
        return workerData.arg.task;
    }

    postMessage(message) {
        parentPort?.postMessage(message);
    }

    applicationDataDirectory() {
        return workerData.arg.applicationDataDirectory;
    }

    downloadMissingAlbumCovers() {
        return workerData.arg.downloadMissingAlbumCovers;
    }

    skipRemovedFilesDuringRefresh() {
        return workerData.arg.skipRemovedFilesDuringRefresh;
    }

    albumKeyIndex() {
        return workerData.arg.albumKeyIndex;
    }
}

exports.WorkerProxy = WorkerProxy;
