class TrackUpdaterMock {
    updateTracksThatAreOutOfDateAsyncCalls = [];

    async updateTracksThatAreOutOfDateAsync() {
        this.updateTracksThatAreOutOfDateAsyncCalls.push({});
    }
}

exports.TrackUpdaterMock = TrackUpdaterMock;
