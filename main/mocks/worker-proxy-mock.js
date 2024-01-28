class WorkerProxyMock {
    applicationDataDirectoryReturnValue = '';

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
        return false;
    }

    skipRemovedFilesDuringRefresh() {
        return false;
    }
}

exports.WorkerProxyMock = WorkerProxyMock;
