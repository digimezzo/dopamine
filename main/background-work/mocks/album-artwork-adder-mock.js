class AlbumArtworkAdderMock {
    addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsyncCalls = [];
    async addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync() {
        this.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsyncCalls.push({});
    }
}

exports.AlbumArtworkAdderMock = AlbumArtworkAdderMock;
