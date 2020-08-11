import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { BaseAlbumArtworkCacheService } from './base-album-artwork-cache.service';

@Injectable({
    providedIn: 'root',
})
export class AlbumArtworkCacheService implements BaseAlbumArtworkCacheService {
    constructor(private fileSystem: FileSystem, private logger: Logger) {
        this.createDirectories();
    }

    public async addArtworkDataToCacheAsync(data: Buffer): Promise<AlbumArtworkCacheId> {
        if (!data) {
            return null;
        }

        if (data.length === 0) {
            return null;
        }

        return AlbumArtworkCacheId.createNew();
    }

    private createDirectories(): void {
        try {
            this.fileSystem.createFullDirectoryPathIfDoesNotExist(this.fileSystem.coverArtCacheFullPath());
        } catch (error) {
            this.logger.error(
                `Could not create artwork cache directory. Error: ${error.message}`,
                'AlbumArtworkCacheService',
                'createDirectories'
            );
        }
    }
}
