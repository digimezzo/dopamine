class TrackRepositoryMock {
    getAlbumDataThatNeedsIndexingCalls = [];
    getAlbumDataThatNeedsIndexingReturnValue = [];
    getLastModifiedTrackForAlbumKeyAsyncCalls = [];
    getLastModifiedTrackForAlbumKeyAsyncReturnValues = {};
    disableNeedsAlbumArtworkIndexingCalls = [];

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
        return 0;
    }

    deleteTracksThatDoNotBelongFolders() {
        return 0;
    }

    getAllTracks() {
        return [];
    }

    deleteTrack(trackId) {}

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
