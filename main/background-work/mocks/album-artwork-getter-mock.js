class AlbumArtworkGetterMock {
    getAlbumArtworkAsyncCalls = [];
    getAlbumArtworkAsyncReturnValues = {};

    async getAlbumArtworkAsync(fileMetadata, getOnlineArtwork) {
        this.getAlbumArtworkAsyncCalls.push({});

        return this.getAlbumArtworkAsyncReturnValues[`${fileMetadata.path};${getOnlineArtwork}`];
    }
}

exports.AlbumArtworkGetterMock = AlbumArtworkGetterMock;
