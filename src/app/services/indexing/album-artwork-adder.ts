import { Injectable } from '@angular/core';
import { AlbumArtwork } from '../../data/entities/album-artwork';
import { Track } from '../../data/entities/track';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { FileMetadata } from '../../metadata/file-metadata';
import { FileMetadataFactory } from '../../metadata/file-metadata-factory';
import { AlbumArtworkCacheId } from '../album-artwork-cache/album-artwork-cache-id';
import { BaseAlbumArtworkCacheService } from '../album-artwork-cache/base-album-artwork-cache.service';

@Injectable({
    providedIn: 'root'
})
export class AlbumArtworkAdder {
    constructor(
        private albumArtworkCacheService: BaseAlbumArtworkCacheService,
        private albumArtworkRepository: BaseAlbumArtworkRepository,
        private trackRepository: BaseTrackRepository,
        private fileMetadataFactory: FileMetadataFactory
    ) {
    }

    public async addAlbumArtworkAsync(albumKey: string): Promise<void> {
        const track: Track = this.trackRepository.getLastModifiedTrackForAlbumKeyAsync(albumKey);

        if (track === null) {
            return;
        }

        const fileMetadata: FileMetadata = await this.fileMetadataFactory.createReadOnlyAsync(track.path);
        const albumArtworkCacheId: AlbumArtworkCacheId =
        await this.albumArtworkCacheService.addArtworkDataToCacheAsync(fileMetadata.picture);

        if (albumArtworkCacheId === null) {
            return;
        }

        await this.trackRepository.disableNeedsAlbumArtworkIndexingAsync(albumKey);
        const newAlbumArtwork: AlbumArtwork = new AlbumArtwork(albumKey, albumArtworkCacheId.id);
        this.albumArtworkRepository.addAlbumArtwork(newAlbumArtwork);
    }
}
