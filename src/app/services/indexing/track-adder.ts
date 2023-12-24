import { Injectable } from '@angular/core';
import { FolderTrack } from '../../data/entities/folder-track';
import { Track } from '../../data/entities/track';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { SettingsBase } from '../../common/settings/settings.base';
import { IndexablePath } from './indexable-path';
import { IndexablePathFetcher } from './indexable-path-fetcher';
import { TrackFiller } from './track-filler';
import { SnackBarServiceBase } from '../snack-bar/snack-bar.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { RemovedTrackRepositoryBase } from '../../data/repositories/removed-track-repository.base';
import { FolderTrackRepositoryBase } from '../../data/repositories/folder-track-repository.base';
import { SchedulerBase } from '../../common/scheduling/scheduler.base';
import { IndexableTrack } from './indexable-track';

@Injectable()
export class TrackAdder {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private folderTrackRepository: FolderTrackRepositoryBase,
        private removedTrackRepository: RemovedTrackRepositoryBase,
        private indexablePathFetcher: IndexablePathFetcher,
        private trackFiller: TrackFiller,
        private settings: SettingsBase,
        private logger: Logger,
        private snackBarService: SnackBarServiceBase,
    ) {}

    private async processIndexablePathsAsync(indexablePaths: IndexablePath[]): Promise<number> {
        let numberOfAddedTracks: number = 0;

        const indexableTracks: IndexableTrack[] = await this.trackFiller.addFileMetadataToTracksAsync(indexablePaths, false);

        for (let i = 0; i < indexableTracks.length; i++) {
            try {
                this.trackRepository.addTrack(indexableTracks[i]);
                const addedTrack: Track = this.trackRepository.getTrackByPath(indexableTracks[i].path)!;

                this.folderTrackRepository.addFolderTrack(new FolderTrack(indexableTracks[i].folderId, addedTrack.trackId));

                numberOfAddedTracks++;
            } catch (e: unknown) {
                this.logger.error(
                    e,
                    `A problem occurred while adding track with path='${indexableTracks[i].path}'`,
                    'TrackAdder',
                    'addTracksThatAreNotInTheDatabaseAsync',
                );
            }
        }

        return numberOfAddedTracks;
    }

    public async addTracksThatAreNotInTheDatabaseAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const indexablePaths: IndexablePath[] = await this.getIndexablePathsAsync(this.settings.skipRemovedFilesDuringRefresh);

            let numberOfAddedTracks: number = 0;
            const batchSize: number = 10;

            for (let i = 0; i < indexablePaths.length; i += batchSize) {
                const batch: IndexablePath[] = indexablePaths.slice(i, i + batchSize);
                numberOfAddedTracks += await this.processIndexablePathsAsync(batch);

                const percentageOfAddedTracks: number = Math.round((numberOfAddedTracks / indexablePaths.length) * 100);
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

    private async getIndexablePathsAsync(skipRemovedFiles: boolean): Promise<IndexablePath[]> {
        const indexablePaths: IndexablePath[] = [];

        const allIndexablePaths: IndexablePath[] = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();
        const trackPaths: string[] = (this.trackRepository.getAllTracks() ?? []).map((x) => x.path);
        const removedTrackPaths: string[] = (this.removedTrackRepository.getRemovedTracks() ?? []).map((x) => x.path);

        for (const indexablePath of allIndexablePaths) {
            const isTrackInDatabase: boolean = trackPaths.includes(indexablePath.path);
            const isTrackThatWasPreviouslyRemoved: boolean = removedTrackPaths.includes(indexablePath.path);
            const allowReAddingRemovedTracks: boolean = !skipRemovedFiles;
            const isTrackThatWasPreviouslyRemovedAndCanBeReAdded: boolean = isTrackThatWasPreviouslyRemoved && allowReAddingRemovedTracks;

            if (!isTrackInDatabase) {
                if (!isTrackThatWasPreviouslyRemoved || isTrackThatWasPreviouslyRemovedAndCanBeReAdded) {
                    indexablePaths.push(indexablePath);
                }
            }
        }

        return indexablePaths;
    }
}
