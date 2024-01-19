const { workerData, parentPort } = require('worker_threads');
const { arg } = workerData;

class WorkerProxy {
    static task() {
        return arg.task;
    }

    static postMessage(message) {
        parentPort?.postMessage(message);
    }

    static applicationDataDirectory() {
        return arg.applicationDataDirectory;
    }

    static downloadMissingAlbumCovers() {
        return arg.downloadMissingAlbumCovers;
    }

    static skipRemovedFilesDuringRefresh() {
        return arg.skipRemovedFilesDuringRefresh;
    }
}

exports.WorkerProxy = WorkerProxy;
