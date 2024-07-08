const { workerData } = require('worker_threads');

class WorkerProxyMock {
    applicationDataDirectoryReturnValue = '';
    downloadMissingAlbumCoversReturnValue = false;
    postMessageCalls = [];
    skipRemovedFilesDuringRefreshReturnValue = false;
    albumKeyIndexReturnValue = '';

    task() {
        return '';
    }

    postMessage(message) {
        this.postMessageCalls.push(message);
    }

    applicationDataDirectory() {
        return this.applicationDataDirectoryReturnValue;
    }

    downloadMissingAlbumCovers() {
        return this.downloadMissingAlbumCoversReturnValue;
    }

    skipRemovedFilesDuringRefresh() {
        return this.skipRemovedFilesDuringRefreshReturnValue;
    }

    albumKeyIndex() {
        return this.albumKeyIndexReturnValue;
    }
}

exports.WorkerProxyMock = WorkerProxyMock;
