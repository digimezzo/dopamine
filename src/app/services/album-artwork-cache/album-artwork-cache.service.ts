import { Injectable } from '@angular/core';
import * as path from 'path';
import { ImageProcessor } from '../../core/image-processor';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory';
import { BaseAlbumArtworkCacheService } from './base-album-artwork-cache.service';

@Injectable({
    providedIn: 'root'
})
export class AlbumArtworkCacheService implements BaseAlbumArtworkCacheService {
    constructor(
        private albumArtworkCacheIdFactory: AlbumArtworkCacheIdFactory,
        private imageProcessor: ImageProcessor,
        private fileSystem: FileSystem,
        private logger: Logger
    ) {
        this.createCoverArtCacheOnDisk();
    }

    public removeArtworkDataFromCache(artworkId: string): void {
        try {
            const cachedArtworkFilePath: string = this.createCachedArtworkFilePath(artworkId);
            this.fileSystem.deleteFileIfExists(cachedArtworkFilePath);
        } catch (e) {
            this.logger.error(
                `Could not remove artwork data from cache. Error: ${e.message}`,
                'AlbumArtworkCacheService',
                'removeArtworkDataFromCache'
            );
        }
    }

    public async addArtworkDataToCacheAsync(data: Buffer): Promise<AlbumArtworkCacheId> {
        if (data == undefined) {
            return undefined;
        }

        if (data.length === 0) {
            return undefined;
        }

        try {
            const albumArtworkCacheId: AlbumArtworkCacheId = this.albumArtworkCacheIdFactory.create();
            const cachedArtworkFilePath: string = this.createCachedArtworkFilePath(albumArtworkCacheId.id);
            await this.imageProcessor.convertImageBufferToFileAsync(data, cachedArtworkFilePath);

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
            throw (e);
        }
    }

    private createCachedArtworkFilePath(artworkId: string): string {
        return path.join(this.fileSystem.coverArtCacheFullPath(), `${artworkId}.jpg`);
    }

}
