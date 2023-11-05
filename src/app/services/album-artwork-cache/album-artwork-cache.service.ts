import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { ImageProcessor } from '../../common/image-processor';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory';
import {AlbumArtworkCacheServiceBase} from "./album-artwork-cache.service.base";

@Injectable()
export class AlbumArtworkCacheService implements AlbumArtworkCacheServiceBase {
    public constructor(
        private albumArtworkCacheIdFactory: AlbumArtworkCacheIdFactory,
        private imageProcessor: ImageProcessor,
        private fileAccess: BaseFileAccess,
        private logger: Logger
    ) {
        this.createCoverArtCacheOnDisk();
    }

    public async removeArtworkDataFromCacheAsync(artworkId: string): Promise<void> {
        try {
            const cachedArtworkFilePath: string = this.fileAccess.coverArtFullPath(artworkId);
            await this.fileAccess.deleteFileIfExistsAsync(cachedArtworkFilePath);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not remove artwork data from cache', 'AlbumArtworkCacheService', 'removeArtworkDataFromCacheAsync');
        }
    }

    public async addArtworkDataToCacheAsync(imageBuffer: Buffer | undefined): Promise<AlbumArtworkCacheId | undefined> {
        if (imageBuffer == undefined) {
            return undefined;
        }

        if (imageBuffer.length === 0) {
            return undefined;
        }

        try {
            const albumArtworkCacheId: AlbumArtworkCacheId = this.albumArtworkCacheIdFactory.create();
            const cachedArtworkFilePath: string = this.fileAccess.coverArtFullPath(albumArtworkCacheId.id);
            const resizedImageBuffer: Buffer = this.imageProcessor.resizeImage(
                imageBuffer,
                Constants.cachedCoverArtMaximumSize,
                Constants.cachedCoverArtMaximumSize,
                Constants.cachedCoverArtJpegQuality
            );
            await this.imageProcessor.convertImageBufferToFileAsync(resizedImageBuffer, cachedArtworkFilePath);

            return albumArtworkCacheId;
        } catch (e: unknown) {
            this.logger.error(e, 'Could not add artwork data to cache', 'AlbumArtworkCacheService', 'addArtworkDataToCacheAsync');
        }

        return undefined;
    }

    private createCoverArtCacheOnDisk(): void {
        try {
            this.fileAccess.createFullDirectoryPathIfDoesNotExist(this.fileAccess.coverArtCacheFullPath());
        } catch (e: unknown) {
            this.logger.error(e, 'Could not create artwork cache directory', 'AlbumArtworkCacheService', 'createDirectories');

            // We cannot proceed if the above fails
            throw e;
        }
    }
}
