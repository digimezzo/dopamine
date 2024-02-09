class AlbumArtworkRepositoryMock {
    getNumberOfAlbumArtworkReturnValue = 0;
    addAlbumArtworkCalls = [];
    getNumberOfAlbumArtworkThatHasNoTrackCalls = 0;
    getNumberOfAlbumArtworkThatHasNoTrackReturnValue = 0;
    deleteAlbumArtworkThatHasNoTrackCalls = 0;
    getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingCalls = 0;
    getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingReturnValue = 0;
    deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexingCalls = 0;
    deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexingReturnValue = 0;
    getAllAlbumArtworkCalls = 0;
    getAllAlbumArtworkReturnValue = [];

    addAlbumArtwork(albumArtwork) {
        this.addAlbumArtworkCalls.push(albumArtwork.artworkId);
    }

    getAllAlbumArtwork() {
        this.getAllAlbumArtworkCalls++;
        return this.getAllAlbumArtworkReturnValue;
    }

    getNumberOfAlbumArtwork() {
        return this.getNumberOfAlbumArtworkReturnValue;
    }

    getNumberOfAlbumArtworkThatHasNoTrack() {
        this.getNumberOfAlbumArtworkThatHasNoTrackCalls++;

        return this.getNumberOfAlbumArtworkThatHasNoTrackReturnValue;
    }

    deleteAlbumArtworkThatHasNoTrack() {
        this.deleteAlbumArtworkThatHasNoTrackCalls++;
        return 0;
    }

    getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
        this.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingCalls++;

        return this.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingReturnValue;
    }

    deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
        this.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexingCalls++;
        return this.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexingReturnValue;
    }
}

exports.AlbumArtworkRepositoryMock = AlbumArtworkRepositoryMock;
