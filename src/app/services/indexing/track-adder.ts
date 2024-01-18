import { Injectable } from '@angular/core';
import { FolderTrack } from '../../data/entities/folder-track';
import { Track } from '../../data/entities/track';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { SettingsBase } from '../../common/settings/settings.base';
import { SnackBarServiceBase } from '../snack-bar/snack-bar.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FolderTrackRepositoryBase } from '../../data/repositories/folder-track-repository.base';
import { IndexableTrack } from './indexable-track';
import { MetadataAdder } from './metadata-adder';
import { IndexableTrackFetcher } from './indexable-track-fetcher';

@Injectable()
export class TrackAdder {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private folderTrackRepository: FolderTrackRepositoryBase,
        private indexableTrackFetcher: IndexableTrackFetcher,
        private metadataAdder: MetadataAdder,
        private settings: SettingsBase,
        private logger: Logger,
        private snackBarService: SnackBarServiceBase,
    ) {}

    public batchSize: number = 20;

    private async addTracksInBatch(indexableTracks: IndexableTrack[]): Promise<number> {
        let numberOfAddedTracks: number = 0;
        const filledIndexableTracks: IndexableTrack[] = await this.metadataAdder.addMetadataToIndexableTracksAsync(indexableTracks, false);

        for (const filledIndexableTrack of filledIndexableTracks) {
            try {
                this.trackRepository.addTrack(filledIndexableTrack);
                const addedTrack: Track = this.trackRepository.getTrackByPath(filledIndexableTrack.path)!;
                this.folderTrackRepository.addFolderTrack(new FolderTrack(filledIndexableTrack.folderId, addedTrack.trackId));
                numberOfAddedTracks++;
            } catch (e: unknown) {
                this.logger.error(
                    e,
                    `A problem occurred while adding track with path='${filledIndexableTrack.path}'`,
                    'TrackAdder',
                    'addTracksInBatch',
                );
            }
        }

        return numberOfAddedTracks;
    }

    public async addTracksThatAreNotInTheDatabaseAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const indexableTracks: IndexableTrack[] = await this.indexableTrackFetcher.getIndexableTracksAsync(
                this.settings.skipRemovedFilesDuringRefresh,
            );

            let numberOfAddedTracks: number = 0;

            for (let i = 0; i < indexableTracks.length; i += this.batchSize) {
                const indexableTracksBatch: IndexableTrack[] = indexableTracks.slice(i, i + this.batchSize);
                numberOfAddedTracks += await this.addTracksInBatch(indexableTracksBatch);

                const percentageOfAddedTracks: number = Math.round((numberOfAddedTracks / indexableTracks.length) * 100);
                await this.snackBarService.addedTracksAsync(numberOfAddedTracks, percentageOfAddedTracks);
            }

            timer.stop();

            this.logger.info(
                `Added tracks: ${numberOfAddedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackAdder',
                'addTracksThatAreNotInTheDatabaseAsync',
            );
        } catch (e: unknown) {
            timer.stop();

            this.logger.error(e, 'A problem occurred while adding tracks', 'TrackAdder', 'addTracksThatAreNotInTheDatabaseAsync');
        }
    }
}
