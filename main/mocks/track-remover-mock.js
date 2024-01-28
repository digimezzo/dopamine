class TrackRemoverMock {
    removeTracksThatDoNoNotBelongToFoldersAsyncCalls = [];
    removeTracksThatAreNotFoundOnDiskAsyncCalls = [];
    removeFolderTracksForInexistingTracksAsyncCalls = [];

    async removeTracksThatDoNoNotBelongToFoldersAsync() {
        this.removeTracksThatDoNoNotBelongToFoldersAsyncCalls.push({});
    }

    async removeTracksThatAreNotFoundOnDiskAsync() {
        this.removeTracksThatAreNotFoundOnDiskAsyncCalls.push({});
    }

    async removeFolderTracksForInexistingTracksAsync() {
        this.removeFolderTracksForInexistingTracksAsyncCalls.push({});
    }
}

exports.TrackRemoverMock = TrackRemoverMock;
