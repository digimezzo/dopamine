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

    skipRemovedFilesDuringRefresh() {
        return workerData.arg.skipRemovedFilesDuringRefresh;
    }
}

exports.WorkerProxy = WorkerProxy;
