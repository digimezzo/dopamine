class EmbeddedAlbumArtworkGetterMock {
    getEmbeddedArtworkReturnValues = {};

    getEmbeddedArtwork(fileMetadata) {
        return this.getEmbeddedArtworkReturnValues[fileMetadata.path];
    }
}

exports.EmbeddedAlbumArtworkGetterMock = EmbeddedAlbumArtworkGetterMock;
