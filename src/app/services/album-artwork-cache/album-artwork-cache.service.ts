import { Injectable } from '@angular/core';
import * as path from 'path';
import { ImageProcessor } from '../../core/image-processor';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory';
import { BaseAlbumArtworkCacheService } from './base-album-artwork-cache.service';

@Injectable({
    providedIn: 'root',
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

    public async addArtworkDataToCacheAsync(data: Buffer): Promise<AlbumArtworkCacheId> {
        if (!data) {
            return null;
        }

        if (data.length === 0) {
            return null;
        }

        try {
            const albumArtworkCacheId: AlbumArtworkCacheId = this.albumArtworkCacheIdFactory.create();
            const cachedArtworkFilePath: string = path.join(this.fileSystem.coverArtCacheFullPath(), `${albumArtworkCacheId.id}.jpg`);
            await this.imageProcessor.convertDataToFileAsync(data, cachedArtworkFilePath);

            return albumArtworkCacheId;
        } catch (e) {
            this.logger.error(
                `Could not add artwork dat to cache. Error: ${e.message}`,
                'AlbumArtworkCacheService',
                'addArtworkDataToCacheAsync'
            );
        }

        return null;
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
            throw(e);
        }
    }
}
