import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { AlbumData } from '../../data/album-data';
import { AlbumArtwork } from '../../data/entities/album-artwork';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { AlbumArtworkAdder } from './album-artwork-adder';
import { AlbumArtworkRemover } from './album-artwork-remover';

@Injectable()
export class AlbumArtworkIndexer {
    constructor(
        private trackRepository: BaseTrackRepository,
        private albumArtworkRepository: BaseAlbumArtworkRepository,
        private albumArtworkRemover: AlbumArtworkRemover,
        private albumArtworkAdder: AlbumArtworkAdder,
        private logger: Logger
    ) { }

    public async indexAlbumArtworkAsync(): Promise<void> {
        this.logger.info('+++ STARTED INDEXING ALBUM ARTWORK +++', 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync');

        const timer: Timer = new Timer();
        timer.start();

        // TODO: refactor, unit test + unit test execution order
        // Remove album artwork from disk that have no tracks
        // Remove album artwork from disk from tracks that need indexing
        // Add new album artwork from tracks that need indexing
        this.removeAlbumArtworksThatHaveNoTrack();
        await this.addAlbumArtworkAsync();

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.elapsedMilliseconds} ms) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync');
    }

    private async addAlbumArtworkAsync(): Promise<void> {
        try {
            const albumDataThatNeedsIndexing: AlbumData[] = this.trackRepository.getAlbumDataThatNeedsIndexing();
            this.logger.info(
                `Found ${albumDataThatNeedsIndexing.length} album data that needs indexing`,
                'AlbumArtworkIndexer',
                'addAlbumArtworkAsync');

            for (const albumData of albumDataThatNeedsIndexing) {
                const couldRemoveAlbumArtwork: boolean = this.albumArtworkRemover.tryRemoveAlbumArtwork(albumData.albumKey);

                if (couldRemoveAlbumArtwork) {
                    await this.albumArtworkAdder.addAlbumArtworkAsync(albumData.albumKey);
                }
            }
        } catch (e) {
            this.logger.info(`Could not add album artwork. Error: ${e.message}`, 'AlbumArtworkIndexer', 'addAlbumArtworkAsync');
        }
    }

    private async removeAlbumArtworksThatHaveNoTrack(): Promise<void> {
        try {
            const albumArtworksThatHaveNoTrack: AlbumArtwork[] = this.albumArtworkRepository.getAlbumArtworksThatHaveNoTrack();

            for (const albumArtworkThatHasNoTrack of albumArtworksThatHaveNoTrack) {
                this.albumArtworkRemover.tryRemoveAlbumArtwork(albumArtworkThatHasNoTrack.albumKey);
            }
        } catch (e) {
            this.logger.info(
                `Could not remove album artwork. Error: ${e.message}`,
                'AlbumArtworkIndexer',
                'removeAlbumArtworksThatHaveNoTrack'
            );
        }
    }
}
