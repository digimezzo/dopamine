class AlbumArtworkRemoverMock {
    removeAlbumArtworkThatHasNoTrackAsyncCalls = [];
    removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsyncCalls = [];
    removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsyncCalls = [];

    async removeAlbumArtworkThatHasNoTrackAsync() {
        this.removeAlbumArtworkThatHasNoTrackAsyncCalls.push({});
    }

    async removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync() {
        this.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsyncCalls.push({});
    }

    async removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync() {
        this.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsyncCalls.push({});
    }
}

exports.AlbumArtworkRemoverMock = AlbumArtworkRemoverMock;
