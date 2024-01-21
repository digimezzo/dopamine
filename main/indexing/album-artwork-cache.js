const { Constants } = require('../common/application/constants');

class AlbumArtworkCache {
    constructor(albumArtworkCacheIdFactory, imageProcessor, applicationPaths, fileAccess, logger) {
        this.albumArtworkCacheIdFactory = albumArtworkCacheIdFactory;
        this.imageProcessor = imageProcessor;
        this.applicationPaths = applicationPaths;
        this.fileAccess = fileAccess;
        this.logger = logger;
    }

    async addArtworkDataToCacheAsync(imageBuffer) {
        if (imageBuffer === undefined || imageBuffer === null) {
            return undefined;
        }

        if (imageBuffer.length === 0) {
            return undefined;
        }

        try {
            const albumArtworkCacheId = this.albumArtworkCacheIdFactory.create();
            const cachedArtworkFilePath = this.coverArtFullPath(albumArtworkCacheId.id);
            const resizedImageBuffer = await this.imageProcessor.resizeImageAsync(
                imageBuffer,
                Constants.cachedCoverArtMaximumSize,
                Constants.cachedCoverArtMaximumSize,
                Constants.cachedCoverArtJpegQuality,
            );
            await this.imageProcessor.convertImageBufferToFileAsync(resizedImageBuffer, cachedArtworkFilePath);

            return albumArtworkCacheId;
        } catch (e) {
            this.logger.error(e, 'Could not add artwork data to cache', 'AlbumArtworkCache', 'addArtworkDataToCacheAsync');
        }

        return undefined;
    }

    coverArtFullPath(artworkId) {
        return this.fileAccess.combinePath([this.applicationPaths.getCoverArtCacheFullPath(), `${artworkId}.jpg`]);
    }
}

exports.AlbumArtworkCache = AlbumArtworkCache;
