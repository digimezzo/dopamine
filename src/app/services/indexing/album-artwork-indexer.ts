import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { AlbumArtworkAdder } from './album-artwork-adder';
import { AlbumArtworkRemover } from './album-artwork-remover';

@Injectable()
export class AlbumArtworkIndexer {
    constructor(
        private albumArtworkRemover: AlbumArtworkRemover,
        private albumArtworkAdder: AlbumArtworkAdder,
        private logger: Logger
    ) { }

    public async indexAlbumArtworkAsync(): Promise<void> {
        this.logger.info('+++ STARTED INDEXING ALBUM ARTWORK +++', 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync');

        const timer: Timer = new Timer();
        timer.start();

        // TODO: refactor, unit test + unit test execution order
        this.albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();
        this.albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();
        await this.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();
        // Remove artwork from disk, which have no entry in db.

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.elapsedMilliseconds} ms) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync');
    }
}
