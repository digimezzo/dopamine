import { Injectable } from '@angular/core';
import { QueuedTrackRepositoryBase } from '../../data/repositories/queued-track-repository.base';
import { Queue } from './queue';
import { Logger } from '../../common/logger';
import { QueuedTrack } from '../../data/entities/queued-track';
import { TrackModel } from '../track/track-model';

@Injectable({ providedIn: 'root' })
export class QueuePersister {
    public constructor(
        private queuedTrackRepository: QueuedTrackRepositoryBase,
        private logger: Logger,
    ) {}

    public save(queue: Queue, playingTrack: TrackModel | undefined, progressSeconds: number): void {
        this.logger.info(`Saving queue`, 'QueuePersister', 'save');

        const queuedTracks: QueuedTrack[] = [];
        for (const track of queue.tracks) {
            const queuedTrack: QueuedTrack = new QueuedTrack(track.path);
            queuedTrack.isPlaying = 0;
            queuedTrack.progressSeconds = 0;
            queuedTrack.orderId = queue.getPlaybackOrderIndex(track);

            if (playingTrack && track.path === playingTrack.path) {
                queuedTrack.isPlaying = 1;
                queuedTrack.progressSeconds = progressSeconds;
            }

            queuedTracks.push(queuedTrack);
        }

        this.queuedTrackRepository.saveQueuedTracks(queuedTracks);

        return;
    }

    public restore(queue: Queue): Queue {
        this.logger.info(`Restoring queue`, 'QueuePersister', 'restore');

        try {
            const savedQueuedTracks: QueuedTrack[] | undefined = this.queuedTrackRepository.getSavedQueuedTracks();

            if (!savedQueuedTracks || savedQueuedTracks.length === 0) {
                this.logger.info(`No saved queued tracks found`, 'QueuePersister', 'restore');
            }

            // TODO: implement this method
        } catch (e: unknown) {
            if (e instanceof Error) {
                this.logger.error(e, 'Failed to restore queue', 'QueuePersister', 'restore');
            }
        }

        return queue;
    }
}
