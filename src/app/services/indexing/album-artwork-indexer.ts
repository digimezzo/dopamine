import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { AlbumData } from '../../data/album-data';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { AlbumArtworkAdder } from './album-artwork-adder';
import { AlbumArtworkRemover } from './album-artwork-remover';

@Injectable()
export class AlbumArtworkIndexer {
    constructor(
        private trackRepository: BaseTrackRepository,
        private albumArtworkRemover: AlbumArtworkRemover,
        private albumArtworkAdder: AlbumArtworkAdder,
        private logger: Logger
    ) { }

    public async indexAlbumArtworkAsync(): Promise<void> {
        this.logger.info('+++ STARTED INDEXING ALBUM ARTWORK +++', 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync');

        const timer: Timer = new Timer();
        timer.start();

        try {
            const albumDataThatNeedsIndexing: AlbumData[] = this.trackRepository.getAlbumDataThatNeedsIndexing();

            for (const albumData of albumDataThatNeedsIndexing) {
                const couldRemoveAlbumArtwork: boolean = this.albumArtworkRemover.tryRemoveAlbumArtwork(albumData.albumKey);

                if (couldRemoveAlbumArtwork) {
                    await this.albumArtworkAdder.addAlbumArtworkAsync(albumData.albumKey);
                }
            }
        } catch (e) {
            this.logger.info(`Could not index album artwork. Error: ${e.message}`, 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync');
        }

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.elapsedMilliseconds}) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync');
    }
}
