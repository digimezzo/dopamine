import { Injectable } from '@angular/core';
import { Track } from '../../common/data/entities/track';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { TrackFiller } from './track-filler';
import { TrackVerifier } from './track-verifier';

@Injectable()
export class TrackUpdater {
    constructor(
        private trackRepository: BaseTrackRepository,
        private trackFiller: TrackFiller,
        private trackVerifier: TrackVerifier,
        private snackBarService: BaseSnackBarService,
        private logger: Logger
    ) {}

    public async updateTracksThatAreOutOfDateAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const tracks: Track[] = this.trackRepository.getAllTracks();

            let numberOfUpdatedTracks: number = 0;

            for (const track of tracks) {
                try {
                    if (this.trackVerifier.doesTrackNeedIndexing(track) || (await this.trackVerifier.isTrackOutOfDateAsync(track))) {
                        const filledTrack: Track = await this.trackFiller.addFileMetadataToTrackAsync(track);
                        this.trackRepository.updateTrack(filledTrack);
                        numberOfUpdatedTracks++;

                        if (numberOfUpdatedTracks === 1) {
                            // Only trigger the snack bar once
                            await this.snackBarService.updatingTracksAsync();
                        }
                    }
                } catch (e) {
                    this.logger.error(
                        `A problem occurred while updating track with path='${track.path}'. Error: ${e.message}`,
                        'TrackUpdater',
                        'updateTracksThatAreOutOfDateAsync'
                    );
                }
            }

            timer.stop();

            this.logger.info(
                `Updated tracks: ${numberOfUpdatedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackUpdater',
                'updateTracksThatAreOutOfDateAsync'
            );
        } catch (e) {
            timer.stop();

            this.logger.error(
                `A problem occurred while updating tracks. Error: ${e.message}`,
                'TrackUpdater',
                'updateTracksThatAreOutOfDateAsync'
            );
        }
    }
}
