class RemovedTrackRepositoryMock {
    addRemovedTrackCalls = [];
    addRemovedTrackReturnValues = {};

    deleteRemovedTrackByTrackIdCalls = [];

    getRemovedTracksCalls = 0;
    getRemovedTracksReturnValue = undefined;

    addRemovedTrack(removedTrack) {
        this.addRemovedTrackCalls.push(removedTrack);
        return this.addRemovedTrackReturnValues[removedTrack.path];
    }

    deleteRemovedTrackByTrackId(trackId) {
        this.deleteRemovedTrackByTrackIdCalls.push(trackId);
    }

    getRemovedTracks() {
        this.getRemovedTracksCalls++;
        return this.getRemovedTracksReturnValue;
    }
}

exports.RemovedTrackRepositoryMock = RemovedTrackRepositoryMock;
