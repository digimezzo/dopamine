import { Injectable } from '@angular/core';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { AlbumArtworkAdder } from './album-artwork-adder';
import { AlbumArtworkRemover } from './album-artwork-remover';

@Injectable()
export class AlbumArtworkIndexer {
    public constructor(
        private albumArtworkRemover: AlbumArtworkRemover,
        private albumArtworkAdder: AlbumArtworkAdder,
        private snackBarService: BaseSnackBarService,
        private logger: Logger
    ) {}

    public async indexAlbumArtworkAsync(): Promise<void> {
        this.logger.info('+++ STARTED INDEXING ALBUM ARTWORK +++', 'AlbumArtworkIndexer', 'indexAlbumArtworkAsync');

        const timer: Timer = new Timer();
        timer.start();

        await this.albumArtworkRemover.removeAlbumArtworkThatHasNoTrackAsync();
        await this.albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();
        await this.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();
        await this.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING ALBUM ARTWORK (Time required: ${timer.elapsedMilliseconds} ms) +++`,
            'AlbumArtworkIndexer',
            'indexAlbumArtworkAsync'
        );

        await this.snackBarService.dismissDelayedAsync();
    }
}
