class TrackRepositoryMock {
    getNumberOfTracksThatDoNotBelongFoldersCalls = 0;
    getNumberOfTracksThatDoNotBelongFoldersReturnValue = 0;
    deleteTracksThatDoNotBelongFoldersCalls = 0;
    deleteTracksThatDoNotBelongFoldersReturnValue = 0;
    getAllTracksCalls = 0;
    getAllTracksReturnValue = [];
    deleteTrackCalls = [];
    addTrackCalls = [];
    getTrackByPathReturnCalls = [];
    getTrackByPathReturnValues = {};
    updateTrackCalls = [];
    getNumberOfTracksThatNeedIndexingReturnValue = 0;
    getNumberOfTracksReturnValue = 0;
    getMaximumDateFileModifiedReturnValue = 0;

    getNumberOfTracksThatNeedIndexing() {
        return this.getNumberOfTracksThatNeedIndexingReturnValue;
    }

    getNumberOfTracks() {
        return this.getNumberOfTracksReturnValue;
    }

    getMaximumDateFileModified() {
        return this.getMaximumDateFileModifiedReturnValue;
    }

    getNumberOfTracksThatDoNotBelongFolders() {
        this.getNumberOfTracksThatDoNotBelongFoldersCalls++;
        return this.getNumberOfTracksThatDoNotBelongFoldersReturnValue;
    }

    deleteTracksThatDoNotBelongFolders() {
        this.deleteTracksThatDoNotBelongFoldersCalls++;
        return this.deleteTracksThatDoNotBelongFoldersReturnValue;
    }

    getAllTracks() {
        this.getAllTracksCalls++;
        return this.getAllTracksReturnValue;
    }

    deleteTrack(trackId) {
        this.deleteTrackCalls.push(trackId);
    }

    updateTrack(track) {
        this.updateTrackCalls.push(track.path);
    }

    addTrack(track) {
        this.addTrackCalls.push(track);
    }

    getTrackByPath(path) {
        this.getTrackByPathReturnCalls.push(path);
        return this.getTrackByPathReturnValues[path];
    }
}

exports.TrackRepositoryMock = TrackRepositoryMock;
