import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { ImageProcessor } from '../../common/image-processor';
import { BaseFileSystem } from '../../common/io/base-file-system';
import { Logger } from '../../common/logger';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory';
import { BaseAlbumArtworkCacheService } from './base-album-artwork-cache.service';

@Injectable()
export class AlbumArtworkCacheService implements BaseAlbumArtworkCacheService {
    constructor(
        private albumArtworkCacheIdFactory: AlbumArtworkCacheIdFactory,
        private imageProcessor: ImageProcessor,
        private fileSystem: BaseFileSystem,
        private logger: Logger
    ) {
        this.createCoverArtCacheOnDisk();
    }

    public async removeArtworkDataFromCacheAsync(artworkId: string): Promise<void> {
        try {
            const cachedArtworkFilePath: string = this.fileSystem.coverArtFullPath(artworkId);
            await this.fileSystem.deleteFileIfExistsAsync(cachedArtworkFilePath);
        } catch (e) {
            this.logger.error(
                `Could not remove artwork data from cache. Error: ${e.message}`,
                'AlbumArtworkCacheService',
                'removeArtworkDataFromCacheAsync'
            );
        }
    }

    public async addArtworkDataToCacheAsync(imageBuffer: Buffer): Promise<AlbumArtworkCacheId> {
        if (imageBuffer == undefined) {
            return undefined;
        }

        if (imageBuffer.length === 0) {
            return undefined;
        }

        try {
            const albumArtworkCacheId: AlbumArtworkCacheId = this.albumArtworkCacheIdFactory.create();
            const cachedArtworkThumbnailFilePath: string = this.fileSystem.coverArtFullPath(albumArtworkCacheId.id);
            const thumbnailBuffer: Buffer = await this.imageProcessor.resizeImageAsync(
                imageBuffer,
                Constants.cachedCoverArtMaximumSize,
                Constants.cachedCoverArtMaximumSize,
                Constants.cachedCoverArtJpegQuality
            );
            await this.imageProcessor.convertImageBufferToFileAsync(thumbnailBuffer, cachedArtworkThumbnailFilePath);

            return albumArtworkCacheId;
        } catch (e) {
            this.logger.error(
                `Could not add artwork data to cache. Error: ${e.message}`,
                'AlbumArtworkCacheService',
                'addArtworkDataToCacheAsync'
            );
        }

        return undefined;
    }

    private createCoverArtCacheOnDisk(): void {
        try {
            this.fileSystem.createFullDirectoryPathIfDoesNotExist(this.fileSystem.coverArtCacheFullPath());
        } catch (e) {
            this.logger.error(
                `Could not create artwork cache directory. Error: ${e.message}`,
                'AlbumArtworkCacheService',
                'createDirectories'
            );

            // We cannot proceed if the above fails
            throw e;
        }
    }
}
