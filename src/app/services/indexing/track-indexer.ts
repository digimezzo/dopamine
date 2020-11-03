import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { BaseStatusService } from '../status/base-status.service';
import { TrackAdder } from './track-adder';
import { TrackRemover } from './track-remover';
import { TrackUpdater } from './track-updater';

@Injectable()
export class TrackIndexer {
    constructor(
        private trackRemover: TrackRemover,
        private trackUpdater: TrackUpdater,
        private trackAdder: TrackAdder,
        private logger: Logger,
        private statusService: BaseStatusService
    ) { }

    public async indexTracksAsync(): Promise<void> {
        this.logger.info('+++ STARTED INDEXING TRACKS +++', 'TrackIndexer', 'indexTracksAsync');

        const timer: Timer = new Timer();
        timer.start();

        await this.statusService.removingSongsAsync();
        this.trackRemover.removeTracksThatDoNoNotBelongToFolders();
        this.trackRemover.removeTracksThatAreNotFoundOnDisk();
        this.trackRemover.removeOrphanedFolderTracks();

        await this.statusService.updatingSongsAsync();
        await this.trackUpdater.updateTracksThatAreOutOfDateAsync();

        await this.trackAdder.addTracksThatAreNotInTheDatabaseAsync();

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING TRACKS (Time required: ${timer.elapsedMilliseconds} ms) +++`,
            'TrackIndexer',
            'indexTracksAsync');

        await this.statusService.resetAsync();
    }
}
