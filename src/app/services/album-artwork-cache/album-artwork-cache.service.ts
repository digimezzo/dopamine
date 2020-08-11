import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { BaseAlbumArtworkCacheService } from './base-album-artwork-cache.service';

@Injectable({
    providedIn: 'root',
})
export class AlbumArtworkCacheService implements BaseAlbumArtworkCacheService {
    constructor(private fileSystem: FileSystem) {
        this.fileSystem.createFullDirectoryPathIfDoesNotExist(this.fileSystem.coverArtCacheFullPath());
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
}
