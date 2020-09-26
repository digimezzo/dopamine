import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { AlbumArtwork } from '../../data/entities/album-artwork';
import { Track } from '../../data/entities/track';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { FileMetadata } from '../../metadata/file-metadata';
import { FileMetadataFactory } from '../../metadata/file-metadata-factory';
import { AlbumArtworkCacheId } from '../album-artwork-cache/album-artwork-cache-id';
import { BaseAlbumArtworkCacheService } from '../album-artwork-cache/base-album-artwork-cache.service';
import { AlbumArtworkGetter } from './album-artwork-getter';

@Injectable({
    providedIn: 'root'
})
export class AlbumArtworkAdder {
    constructor(
        private albumArtworkCacheService: BaseAlbumArtworkCacheService,
        private albumArtworkRepository: BaseAlbumArtworkRepository,
        private trackRepository: BaseTrackRepository,
        private fileMetadataFactory: FileMetadataFactory,
        private logger: Logger,
        private albumArtworkGetter: AlbumArtworkGetter
    ) {
    }

    public async addAlbumArtworkAsync(albumKey: string): Promise<void> {
        try {
            const track: Track = this.trackRepository.getLastModifiedTrackForAlbumKeyAsync(albumKey);

            if (!track) {
                return;
            }

            const fileMetadata: FileMetadata = await this.fileMetadataFactory.createReadOnlyAsync(track.path);
            const albumArtwork: Buffer = this.albumArtworkGetter.getAlbumArtwork(fileMetadata);

            if (!albumArtwork) {
                return;
            }

            const albumArtworkCacheId: AlbumArtworkCacheId =
                await this.albumArtworkCacheService.addArtworkDataToCacheAsync(albumArtwork);

            if (!albumArtworkCacheId) {
                return;
            }

            await this.trackRepository.disableNeedsAlbumArtworkIndexingAsync(albumKey);
            const newAlbumArtwork: AlbumArtwork = new AlbumArtwork(albumKey, albumArtworkCacheId.id);
            this.albumArtworkRepository.addAlbumArtwork(newAlbumArtwork);
        } catch (e) {
            this.logger.error(`Could not add album artwork for albumKey=${albumKey}`, 'AlbumArtworkAdder', 'addAlbumArtworkAsync');
        }
    }
}
