import { Injectable } from '@angular/core';
import { Track } from '../../data/entities/track';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { TrackFiller } from './track-filler';
import { TrackVerifier } from './track-verifier';
import { SnackBarServiceBase } from '../snack-bar/snack-bar.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';

@Injectable()
export class TrackUpdater {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private trackFiller: TrackFiller,
        private trackVerifier: TrackVerifier,
        private snackBarService: SnackBarServiceBase,
        private logger: Logger,
    ) {}

    public async updateTracksThatAreOutOfDateAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const tracks: Track[] = this.trackRepository.getAllTracks() ?? [];

            let numberOfUpdatedTracks: number = 0;

            for (const track of tracks) {
                try {
                    if (this.trackVerifier.doesTrackNeedIndexing(track) || this.trackVerifier.isTrackOutOfDate(track)) {
                        const filledTrack: Track = await this.trackFiller.addFileMetadataToTrackAsync(track, false);
                        this.trackRepository.updateTrack(filledTrack);
                        numberOfUpdatedTracks++;

                        if (numberOfUpdatedTracks === 1) {
                            // Only trigger the snack bar once
                            await this.snackBarService.updatingTracksAsync();
                        }
                    }
                } catch (e: unknown) {
                    this.logger.error(
                        e,
                        `A problem occurred while updating track with path='${track.path}'`,
                        'TrackUpdater',
                        'updateTracksThatAreOutOfDateAsync',
                    );
                }
            }

            timer.stop();

            this.logger.info(
                `Updated tracks: ${numberOfUpdatedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackUpdater',
                'updateTracksThatAreOutOfDateAsync',
            );
        } catch (e: unknown) {
            timer.stop();

            this.logger.error(e, 'A problem occurred while updating tracks', 'TrackUpdater', 'updateTracksThatAreOutOfDateAsync');
        }
    }
}
