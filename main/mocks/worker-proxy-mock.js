class WorkerProxyMock {
    applicationDataDirectoryReturnValue = '';
    downloadMissingAlbumCoversReturnValue = false;
    postMessageCalls = [];

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
        return false;
    }
}

exports.WorkerProxyMock = WorkerProxyMock;
