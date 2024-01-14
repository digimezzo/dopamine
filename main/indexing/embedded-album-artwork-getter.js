const { Logger } = require('../common/logger');

class EmbeddedAlbumArtworkGetter {
    static getEmbeddedArtwork(fileMetadata) {
        if (fileMetadata === undefined || fileMetadata === null) {
            return undefined;
        }

        let artworkData;

        try {
            artworkData = fileMetadata.picture;
        } catch (e) {
            Logger.error(
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
