import { Injectable } from '@angular/core';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { TrackAdder } from './track-adder';
import { TrackRemover } from './track-remover';
import { TrackUpdater } from './track-updater';
import { NotificationServiceBase } from '../notification/notification.service.base';

@Injectable()
export class TrackIndexer {
    public constructor(
        private trackRemover: TrackRemover,
        private trackUpdater: TrackUpdater,
        private trackAdder: TrackAdder,
        private logger: Logger,
        private notificationService: NotificationServiceBase,
    ) {}

    public async indexTracksAsync(): Promise<void> {
        this.logger.info('+++ STARTED INDEXING TRACKS +++', 'TrackIndexer', 'indexTracksAsync');

        const timer: Timer = new Timer();
        timer.start();

        await this.notificationService.refreshing();

        // Remove tracks
        await this.trackRemover.removeTracksThatDoNoNotBelongToFoldersAsync();
        await this.trackRemover.removeTracksThatAreNotFoundOnDiskAsync();
        await this.trackRemover.removeFolderTracksForInexistingTracksAsync();

        // Update tracks
        await this.trackUpdater.updateTracksThatAreOutOfDateAsync();

        // Add tracks
        await this.trackAdder.addTracksThatAreNotInTheDatabaseAsync();

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING TRACKS (Time required: ${timer.elapsedMilliseconds} ms) +++`,
            'TrackIndexer',
            'indexTracksAsync',
        );

        await this.notificationService.dismissDelayedAsync();
    }
}
