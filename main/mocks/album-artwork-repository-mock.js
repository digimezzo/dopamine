class AlbumArtworkRepositoryMock {
    getNumberOfAlbumArtworkReturnValue = 0;
    addAlbumArtworkCalls = [];

    addAlbumArtwork(albumArtwork) {
        this.addAlbumArtworkCalls.push(albumArtwork.artworkId);
    }

    getAllAlbumArtwork() {
        return [];
    }

    getNumberOfAlbumArtwork() {
        return this.getNumberOfAlbumArtworkReturnValue;
    }

    getNumberOfAlbumArtworkThatHasNoTrack() {
        return 0;
    }

    deleteAlbumArtworkThatHasNoTrack() {
        return 0;
    }

    getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
        return 0;
    }

    deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
        return 0;
    }
}

exports.AlbumArtworkRepositoryMock = AlbumArtworkRepositoryMock;
