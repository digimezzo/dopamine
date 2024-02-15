class EmbeddedAlbumArtworkGetter {
    constructor(logger) {
        this.logger = logger;
    }

    getEmbeddedArtwork(fileMetadata) {
        if (fileMetadata === undefined || fileMetadata === null) {
            return undefined;
        }

        let artworkData;

        try {
            artworkData = fileMetadata.picture;
        } catch (e) {
            this.logger.error(
                e,
                `Could not get embedded artwork for track with path='${fileMetadata.path}'`,
                'EmbeddedAlbumArtworkGetter',
                'getEmbeddedArtwork',
            );
        }

        return artworkData;
    }
}

exports.EmbeddedAlbumArtworkGetter = EmbeddedAlbumArtworkGetter;
