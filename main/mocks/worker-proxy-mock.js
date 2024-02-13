class WorkerProxyMock {
    applicationDataDirectoryReturnValue = '';
    downloadMissingAlbumCoversReturnValue = false;
    postMessageCalls = [];
    skipRemovedFilesDuringRefreshReturnValue = false;

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
}

exports.WorkerProxyMock = WorkerProxyMock;
