import { Injectable } from '@angular/core';
import * as path from 'path';
import { BaseAlbumArtworkRepository } from '../../common/data/repositories/base-album-artwork-repository';
import { ImageProcessor } from '../../common/image-processor';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { Strings } from '../../common/strings';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory';
import { BaseAlbumArtworkCacheService } from './base-album-artwork-cache.service';

@Injectable()
export class AlbumArtworkCacheService implements BaseAlbumArtworkCacheService {
    constructor(
        private albumArtworkRepository: BaseAlbumArtworkRepository,
        private albumArtworkCacheIdFactory: AlbumArtworkCacheIdFactory,
        private imageProcessor: ImageProcessor,
        private fileSystem: FileSystem,
        private logger: Logger
    ) {
        this.createCoverArtCacheOnDisk();
    }

    public async removeArtworkDataFromCacheAsync(artworkId: string): Promise<void> {
        try {
            const cachedArtworkFilePath: string = this.createCachedArtworkFilePath(artworkId);
            await this.fileSystem.deleteFileIfExistsAsync(cachedArtworkFilePath);
        } catch (e) {
            this.logger.error(
                `Could not remove artwork data from cache. Error: ${e.message}`,
                'AlbumArtworkCacheService',
                'removeArtworkDataFromCacheAsync'
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

    public getCachedArtworkFilePathAsync(albumKey: string): string {
        const artworkId: string = this.albumArtworkRepository.getArtworkId(albumKey);

        if (Strings.isNullOrWhiteSpace(artworkId)) {
            return '';
        }

        return this.createCachedArtworkFilePath(artworkId);
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

    private createCachedArtworkFilePath(artworkId: string): string {
        return path.join(this.fileSystem.coverArtCacheFullPath(), `${artworkId}.jpg`);
    }
}
