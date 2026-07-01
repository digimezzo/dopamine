import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { FileAccessBase } from '../../common/io/file-access.base';
import { ApplicationPaths } from '../../common/application/application-paths';
import { ArtistArtworkCacheIdFactory } from './artist-artwork-cache-id-factory';
import { ArtistArtworkCacheServiceBase } from './artist-artwork-cache.service.base';
import { ArtistArtworkCacheId } from './artist-artwork-cache-id';

@Injectable()
export class ArtistArtworkCacheService implements ArtistArtworkCacheServiceBase {
    public constructor(
        private artistArtworkCacheIdFactory: ArtistArtworkCacheIdFactory,
        private imageProcessor: ImageProcessor,
        private fileAccess: FileAccessBase,
        private applicationPaths: ApplicationPaths,
        private logger: Logger,
    ) {
        this.createArtistArtworkCacheOnDisk();
    }

    public async addArtworkDataToCacheAsync(imageBuffer: Buffer | undefined): Promise<ArtistArtworkCacheId | undefined> {
        if (imageBuffer == undefined || imageBuffer.length === 0) {
            return undefined;
        }

        if (imageBuffer === Constants.emptyImageBuffer) {
            return this.artistArtworkCacheIdFactory.createDefault();
        }

        try {
            const artistArtworkCacheId: ArtistArtworkCacheId = this.artistArtworkCacheIdFactory.create();
            const cachedArtworkFilePath: string = this.applicationPaths.artistArtFullPath(artistArtworkCacheId.id);
            const resizedImageBuffer: Buffer = await this.imageProcessor.toResizedJpegBufferAsync(
                imageBuffer,
                Constants.cachedArtworkMaximumSize,
                Constants.cachedArtworkMaximumSize,
                Constants.cachedArtworkJpegQuality,
            );
            await this.imageProcessor.convertImageBufferToFileAsync(resizedImageBuffer, cachedArtworkFilePath);

            return artistArtworkCacheId;
        } catch (e: unknown) {
            this.logger.error(e, 'Could not add artwork data to cache', 'ArtistArtworkCacheService', 'addArtworkDataToCacheAsync');
        }

        return undefined;
    }

    public async removeArtworkDataFromCacheAsync(artworkId: string): Promise<void> {
        try {
            const cachedArtworkFilePath: string = this.applicationPaths.artistArtFullPath(artworkId);
            await this.fileAccess.deleteFileIfExistsAsync(cachedArtworkFilePath);
        } catch (e: unknown) {
            this.logger.error(
                e,
                'Could not remove artwork data from cache',
                'ArtistArtworkCacheService',
                'removeArtworkDataFromCacheAsync',
            );
        }
    }

    private createArtistArtworkCacheOnDisk(): void {
        try {
            this.fileAccess.createFullDirectoryPathIfDoesNotExist(this.applicationPaths.artistArtCacheFullPath());
        } catch (e: unknown) {
            this.logger.error(
                e,
                'Could not create artwork cache directory',
                'ArtistArtworkCacheService',
                'createArtistArtworkCacheOnDisk'
            );

            // We cannot proceed if the above fails
            throw e;
        }
    }
}
