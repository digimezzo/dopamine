const { Logger } = require('../common/logger');
const { Constants } = require('../common/application/constants');
const { ImageProcessor } = require('../common/image-processor');
const { FileAccess } = require('../common/io/file-access');
const { ApplicationPaths } = require('../common/application/application-paths');
const { AlbumArtworkCacheIdFactory } = require('./album-artwork-cache-id-factory');

class AlbumArtworkCache {
    static async addArtworkDataToCacheAsync(imageBuffer) {
        if (imageBuffer === undefined || imageBuffer === null) {
            return undefined;
        }

        if (imageBuffer.length === 0) {
            return undefined;
        }

        try {
            const albumArtworkCacheId = AlbumArtworkCacheIdFactory.create();
            const cachedArtworkFilePath = this.coverArtFullPath(albumArtworkCacheId.id);
            const resizedImageBuffer = await ImageProcessor.resizeImageAsync(
                imageBuffer,
                Constants.cachedCoverArtMaximumSize,
                Constants.cachedCoverArtMaximumSize,
                Constants.cachedCoverArtJpegQuality,
            );
            await ImageProcessor.convertImageBufferToFileAsync(resizedImageBuffer, cachedArtworkFilePath);

            return albumArtworkCacheId;
        } catch (e) {
            Logger.error(e, 'Could not add artwork data to cache', 'AlbumArtworkCache', 'addArtworkDataToCacheAsync');
        }

        return undefined;
    }

    static coverArtFullPath(artworkId) {
        return FileAccess.combinePath([ApplicationPaths.getCoverArtCacheFullPath(), `${artworkId}.jpg`]);
    }
}

exports.AlbumArtworkCache = AlbumArtworkCache;
