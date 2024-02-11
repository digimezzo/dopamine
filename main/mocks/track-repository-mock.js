class TrackRepositoryMock {
    getAlbumDataThatNeedsIndexingCalls = [];
    getAlbumDataThatNeedsIndexingReturnValue = [];
    getLastModifiedTrackForAlbumKeyAsyncCalls = [];
    getLastModifiedTrackForAlbumKeyAsyncReturnValues = {};
    disableNeedsAlbumArtworkIndexingCalls = [];
    getNumberOfTracksThatDoNotBelongFoldersCalls = 0;
    getNumberOfTracksThatDoNotBelongFoldersReturnValue = 0;
    deleteTracksThatDoNotBelongFoldersCalls = 0;
    deleteTracksThatDoNotBelongFoldersReturnValue = 0;
    getAllTracksCalls = 0;
    getAllTracksReturnValue = [];
    deleteTrackCalls = [];

    getNumberOfTracksThatNeedIndexing() {
        return 0;
    }

    getNumberOfTracks() {
        return 0;
    }

    getMaximumDateFileModified() {
        return 0;
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

    updateTrack(track) {}

    addTrack(track) {}

    getTrackByPath(path) {
        return undefined;
    }

    disableNeedsAlbumArtworkIndexing(albumKey) {
        this.disableNeedsAlbumArtworkIndexingCalls.push(albumKey);
    }

    getLastModifiedTrackForAlbumKeyAsync(albumKey) {
        this.getLastModifiedTrackForAlbumKeyAsyncCalls.push({});
        return this.getLastModifiedTrackForAlbumKeyAsyncReturnValues[albumKey];
    }

    getAlbumDataThatNeedsIndexing() {
        this.getAlbumDataThatNeedsIndexingCalls.push({});
        return this.getAlbumDataThatNeedsIndexingReturnValue;
    }

    enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover) {}
}

exports.TrackRepositoryMock = TrackRepositoryMock;
