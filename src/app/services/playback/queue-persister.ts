import { Injectable } from '@angular/core';
import { QueuedTrackRepositoryBase } from '../../data/repositories/queued-track-repository.base';
import { Queue } from './queue';
import { Logger } from '../../common/logger';
import { QueuedTrack } from '../../data/entities/queued-track';
import { TrackModel } from '../track/track-model';
import { QueueRestoreInfo } from './queue-restore-info';
import { TrackModelFactory } from '../track/track-model-factory';
import { SettingsBase } from '../../common/settings/settings.base';
import { Track } from '../../data/entities/track';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { Timer } from '../../common/scheduling/timer';

@Injectable({ providedIn: 'root' })
export class QueuePersister {
    public constructor(
        private queuedTrackRepository: QueuedTrackRepositoryBase,
        private trackRepository: TrackRepositoryBase,
        private trackModelFactory: TrackModelFactory,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public save(queue: Queue, playingTrack: TrackModel | undefined, progressSeconds: number): void {
        this.logger.info(`Saving queue`, 'QueuePersister', 'save');

        const queuedTracks: QueuedTrack[] = [];

        try {
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

            this.logger.info(`Saved queue of ${queuedTracks.length} tracks`, 'QueuePersister', 'save');
        } catch (e: unknown) {
            if (e instanceof Error) {
                this.logger.error(e, 'Failed to save queue', 'QueuePersister', 'save');
            }
        }

        return;
    }

    public async restoreAsync(): Promise<QueueRestoreInfo> {
        this.logger.info(`Restoring queue`, 'QueuePersister', 'restore');

        try {
            const savedQueuedTracks: QueuedTrack[] | undefined = this.queuedTrackRepository.getSavedQueuedTracks();

            if (!savedQueuedTracks || savedQueuedTracks.length === 0) {
                this.logger.info(`No saved queued tracks found`, 'QueuePersister', 'restore');
                return new QueueRestoreInfo([], [], undefined, 0);
            }

            const tracksModels: TrackModel[] = [];
            const playbackOrder: number[] = new Array<number>(savedQueuedTracks.length).fill(0);
            let playingTrack: TrackModel | undefined = undefined;
            let progressSeconds: number = 0;

            const tracks: Track[] | undefined = this.trackRepository.getTracksForPaths(savedQueuedTracks.map((x) => x.path));

            if (!tracks || tracks.length === 0) {
                this.logger.info(`No tracks found for saved queued tracks.`, 'QueuePersister', 'restore');
                return new QueueRestoreInfo([], [], undefined, 0);
            }

            const albumKeyIndex = this.settings.albumKeyIndex;

            const timer = new Timer();
            timer.start();

            for (const savedQueuedTrack of savedQueuedTracks) {
                const trackFromTracks: Track | undefined = tracks.find((x) => x.path === savedQueuedTrack.path);

                if (trackFromTracks) {
                    const trackModel: TrackModel = this.trackModelFactory.createFromTrack(trackFromTracks, albumKeyIndex);

                    tracksModels.push(trackModel);
                    playbackOrder[savedQueuedTrack.orderId] = tracksModels.length - 1;

                    if (savedQueuedTrack.isPlaying) {
                        playingTrack = trackModel;
                        progressSeconds = savedQueuedTrack.progressSeconds;
                    }
                }
            }

            timer.stop();

            this.logger.info(
                `Restored queue of ${savedQueuedTracks.length} tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'QueuePersister',
                'restore',
            );

            return new QueueRestoreInfo(tracksModels, playbackOrder, playingTrack, progressSeconds);
        } catch (e: unknown) {
            if (e instanceof Error) {
                this.logger.error(e, 'Failed to restore queue', 'QueuePersister', 'restore');
            }
        }

        return new QueueRestoreInfo([], [], undefined, 0);
    }
}
