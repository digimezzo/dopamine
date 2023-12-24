import { Injectable } from '@angular/core';
import { Track } from '../../data/entities/track';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { TrackVerifier } from './track-verifier';
import { SnackBarServiceBase } from '../snack-bar/snack-bar.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { IndexableTrack } from './indexable-track';
import { MetadataAdder } from './metadata-adder';

@Injectable()
export class TrackUpdater {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private metadataAdder: MetadataAdder,
        private trackVerifier: TrackVerifier,
        private snackBarService: SnackBarServiceBase,
        private logger: Logger,
    ) {}

    private async updateTracksInBatch(tracks: Track[]): Promise<number> {
        let numberOfUpdatedTracks: number = 0;
        const filledIndexableTracks: IndexableTrack[] = await this.metadataAdder.addMetadataToIndexableTracksAsync(
            tracks.map((x) => new IndexableTrack(x, 0, 0)),
            false,
        );

        for (const filledIndexableTrack of filledIndexableTracks) {
            try {
                this.trackRepository.updateTrack(filledIndexableTrack);
                numberOfUpdatedTracks++;
            } catch (e: unknown) {
                this.logger.error(
                    e,
                    `A problem occurred while updating track with path='${filledIndexableTrack.path}'`,
                    'TrackUpdater',
                    'updateTracksInBatch',
                );
            }
        }

        return numberOfUpdatedTracks;
    }

    public async updateTracksThatAreOutOfDateAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const tracks: Track[] = this.trackRepository.getAllTracks() ?? [];

            let numberOfUpdatedTracks: number = 0;
            const batchSize: number = 20;
            let isShowingSnackBar: boolean = false;

            for (let i = 0; i < tracks.length; i += batchSize) {
                const tracksBatch: Track[] = tracks
                    .slice(i, i + batchSize)
                    .filter((x) => this.trackVerifier.doesTrackNeedIndexing(x) || this.trackVerifier.isTrackOutOfDate(x));

                // Only trigger the snack bar once
                if (tracksBatch.length > 0 && !isShowingSnackBar) {
                    isShowingSnackBar = true;
                    await this.snackBarService.updatingTracksAsync();
                }

                numberOfUpdatedTracks += await this.updateTracksInBatch(tracksBatch);
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
