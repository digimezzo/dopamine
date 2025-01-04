class TrackAdderMock {
    addTracksThatAreNotInTheDatabaseAsyncCalls = [];
    async addTracksThatAreNotInTheDatabaseAsync() {
        this.addTracksThatAreNotInTheDatabaseAsyncCalls.push({});
    }
}

exports.TrackAdderMock = TrackAdderMock;
