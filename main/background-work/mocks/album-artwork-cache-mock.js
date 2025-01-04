class AlbumArtworkCacheMock {
    addArtworkDataToCacheAsyncCalls = [];
    addArtworkDataToCacheAsyncReturnValues = {};

    async addArtworkDataToCacheAsync(imageBuffer) {
        this.addArtworkDataToCacheAsyncCalls.push(imageBuffer);

        return this.addArtworkDataToCacheAsyncReturnValues[imageBuffer.join(',')];
    }

    coverArtFullPath(artworkId) {
        return '';
    }
}

exports.AlbumArtworkCacheMock = AlbumArtworkCacheMock;
