import { Injectable } from '@angular/core';
import { QueuedTrackRepositoryBase } from '../../data/repositories/queued-track-repository.base';
import { Queue } from './queue';
import { Logger } from '../../common/logger';
import { QueuedTrack } from '../../data/entities/queued-track';

@Injectable({ providedIn: 'root' })
export class QueuePersister {
    public constructor(
        private queuedTrackRepository: QueuedTrackRepositoryBase,
        private logger: Logger,
    ) {}

    public save(queue: Queue): void {
        this.logger.info(`Saving queue`, 'QueuePersister', 'save');
        // TODO: implement this method

        return;
    }

    public restore(queue: Queue): Queue {
        this.logger.info(`Restoring queue`, 'QueuePersister', 'restore');

        try {
            const savedQueuedTracks: QueuedTrack[] | undefined = this.queuedTrackRepository.getSavedQueuedTracks();

            if (!savedQueuedTracks || savedQueuedTracks.length === 0) {
                this.logger.info(`No saved queued tracks found`, 'QueuePersister', 'restore');
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                this.logger.error(e, 'Failed to restore queue', 'QueuePersister', 'restore');
            }
        }

        return queue;
    }
}
