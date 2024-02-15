const { StringUtils } = require('../common/utils/string-utils');

class ExternalAlbumArtworkGetter {
    constructor(externalArtworkPathGetter, imageProcessor, logger) {
        this.externalArtworkPathGetter = externalArtworkPathGetter;
        this.imageProcessor = imageProcessor;
        this.logger = logger;
    }

    async getExternalArtworkAsync(fileMetadata) {
        if (fileMetadata === undefined || fileMetadata === null) {
            return undefined;
        }

        let artworkData;

        try {
            const externalArtworkPath = await this.externalArtworkPathGetter.getExternalArtworkPathAsync(fileMetadata.path);

            if (!StringUtils.isNullOrWhiteSpace(externalArtworkPath)) {
                artworkData = await this.imageProcessor.convertLocalImageToBufferAsync(externalArtworkPath);
            }
        } catch (e) {
            this.logger.error(
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
