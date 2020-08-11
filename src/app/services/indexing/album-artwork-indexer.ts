import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { AlbumData } from '../../data/album-data';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { BaseAlbumArtworkCacheService } from '../album-artwork-cache/base-album-artwork-cache.service';

@Injectable({
    providedIn: 'root'
})
export class AlbumArtworkIndexer {
    constructor(
        private trackRepository: BaseTrackRepository,
        private albumArtworkRepository: BaseAlbumArtworkRepository,
        private albumArtworkCacheService: BaseAlbumArtworkCacheService,
        private logger: Logger
    ) { }

    public async indexAlbumArtworkAsync(): Promise<void> {
        this.logger.info('+++ STARTED INDEXING ALBUM ARTWORK +++', 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync');

        const timer: Timer = new Timer();
        timer.start();

        const albumDataThatNeedsIndexing: AlbumData[] = this.trackRepository.getAlbumDataThatNeedsIndexing();

        for (const albumData of albumDataThatNeedsIndexing) {
            this.albumArtworkRepository.deleteAlbumArtwork(albumData.albumKey);
        }

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.elapsedMilliseconds}) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync');
    }
}
