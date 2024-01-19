const { Logger } = require('../common/logger');
const { StringUtils } = require('../common/utils/string-utils');
const { ImageProcessor } = require('../common/image-processor');
const { ExternalArtworkPathGetter } = require('./external-artwork-path-getter');

class ExternalAlbumArtworkGetter {
    static async getExternalArtworkAsync(fileMetadata) {
        if (fileMetadata === undefined || fileMetadata === null) {
            return undefined;
        }

        let artworkData;

        try {
            const externalArtworkPath = await ExternalArtworkPathGetter.getExternalArtworkPathAsync(fileMetadata.path);

            if (!StringUtils.isNullOrWhiteSpace(externalArtworkPath)) {
                artworkData = await ImageProcessor.convertLocalImageToBufferAsync(externalArtworkPath);
            }
        } catch (e) {
            Logger.error(
                e,
                `Could not get external artwork for track with path='${fileMetadata.path}'`,
                'ExternalAlbumArtworkGetter',
                'getExternalArtwork',
            );
        }

        return artworkData;
    }
}

exports.ExternalAlbumArtworkGetter = ExternalAlbumArtworkGetter;
