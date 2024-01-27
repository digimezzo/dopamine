class WorkerProxyMock {
    applicationDataDirectoryReturnValue = '';

    task() {
        return '';
    }

    postMessage(message) {}

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
