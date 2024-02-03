class OnlineAlbumArtworkGetterMock {
    getOnlineArtworkAsyncReturnValues = {};

    async getOnlineArtworkAsync(fileMetadata) {
        return this.getOnlineArtworkAsyncReturnValues[fileMetadata.path];
    }
}

exports.OnlineAlbumArtworkGetterMock = OnlineAlbumArtworkGetterMock;
