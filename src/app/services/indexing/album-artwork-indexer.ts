import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';

@Injectable({
    providedIn: 'root'
})
export class AlbumArtworkIndexer {
    constructor(
        private logger: Logger
    ) { }

    public async indexAlbumArtworkAsync(): Promise<void> {
        this.logger.info('+++ STARTED INDEXING ALBUM ARTWORK +++', 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync');

        const timer: Timer = new Timer();
        timer.start();

       // TODO

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.elapsedMilliseconds}) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync');
    }
}
