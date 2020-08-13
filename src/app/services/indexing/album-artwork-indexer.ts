import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { AlbumData } from '../../data/album-data';
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
export class AlbumArtworkIndexer {
    constructor(
        private trackRepository: BaseTrackRepository,
        private albumArtworkRepository: BaseAlbumArtworkRepository,
        private albumArtworkCacheService: BaseAlbumArtworkCacheService,
        private fileMetadataFactory: FileMetadataFactory,
        private logger: Logger
    ) { }

    public async indexAlbumArtworkAsync(): Promise<void> {
        this.logger.info('+++ STARTED INDEXING ALBUM ARTWORK +++', 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync');

        const timer: Timer = new Timer();
        timer.start();

        const albumDataThatNeedsIndexing: AlbumData[] = this.trackRepository.getAlbumDataThatNeedsIndexing();

        for (const albumData of albumDataThatNeedsIndexing) {
            this.albumArtworkRepository.deleteAlbumArtwork(albumData.albumKey);
            const track: Track = this.trackRepository.getLastModifiedTrackForAlbumKeyAsync(albumData.albumKey);
            const fileMetadata: FileMetadata = await this.fileMetadataFactory.createReadOnlyAsync(track.path);
            const albumArtworkCacheId: AlbumArtworkCacheId =
            await this.albumArtworkCacheService.addArtworkDataToCacheAsync(fileMetadata.picture);

            if (albumArtworkCacheId) {
                await this.trackRepository.disableNeedsAlbumArtworkIndexingAsync(albumData.albumKey);
                const newAlbumArtwork: AlbumArtwork = new AlbumArtwork(albumData.albumKey, albumArtworkCacheId.id);
                this.albumArtworkRepository.addAlbumArtwork(newAlbumArtwork);
            }
        }

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.elapsedMilliseconds}) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync');
    }
}
