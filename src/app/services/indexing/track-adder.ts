import { Injectable } from '@angular/core';
import { FolderTrack } from '../../common/data/entities/folder-track';
import { Track } from '../../common/data/entities/track';
import { BaseFolderTrackRepository } from '../../common/data/repositories/base-folder-track-repository';
import { BaseRemovedTrackRepository } from '../../common/data/repositories/base-removed-track-repository';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { IndexablePath } from './indexable-path';
import { IndexablePathFetcher } from './indexable-path-fetcher';
import { TrackFiller } from './track-filler';

@Injectable()
export class TrackAdder {
    constructor(
        private trackRepository: BaseTrackRepository,
        private folderTrackRepository: BaseFolderTrackRepository,
        private removedTrackRepository: BaseRemovedTrackRepository,
        private indexablePathFetcher: IndexablePathFetcher,
        private trackFiller: TrackFiller,
        private settings: BaseSettings,
        private logger: Logger,
        private snackBarService: BaseSnackBarService
    ) {}

    public async addTracksThatAreNotInTheDatabaseAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const indexablePaths: IndexablePath[] = await this.getIndexablePathsAsync(this.settings.skipRemovedFilesDuringRefresh);

            let numberOfAddedTracks: number = 0;

            for (const indexablePath of indexablePaths) {
                try {
                    const newTrack: Track = new Track(indexablePath.path);
                    await this.trackFiller.addFileMetadataToTrackAsync(newTrack);

                    this.trackRepository.addTrack(newTrack);
                    const addedTrack: Track = this.trackRepository.getTrackByPath(newTrack.path);

                    this.folderTrackRepository.addFolderTrack(new FolderTrack(indexablePath.folderId, addedTrack.trackId));

                    numberOfAddedTracks++;

                    const percentageOfAddedTracks: number = Math.round((numberOfAddedTracks / indexablePaths.length) * 100);

                    await this.snackBarService.addedTracksAsync(numberOfAddedTracks, percentageOfAddedTracks);
                } catch (e) {
                    this.logger.error(
                        `A problem occurred while adding track with path='${indexablePath.path}'. Error: ${e.message}`,
                        'TrackAdder',
                        'addTracksThatAreNotInTheDatabaseAsync'
                    );
                }
            }

            timer.stop();

            this.logger.info(
                `Added tracks: ${numberOfAddedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackAdder',
                'addTracksThatAreNotInTheDatabaseAsync'
            );
        } catch (e) {
            timer.stop();

            this.logger.error(
                `A problem occurred while adding tracks. Error: ${e.message}`,
                'TrackAdder',
                'addTracksThatAreNotInTheDatabaseAsync'
            );
        }
    }

    private async getIndexablePathsAsync(skipRemovedFiles: boolean): Promise<IndexablePath[]> {
        const indexablePaths: IndexablePath[] = [];

        const allIndexablePaths: IndexablePath[] = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();
        const trackPaths: string[] = this.trackRepository.getAllTracks().map((x) => x.path);
        const removedTrackPaths: string[] = this.removedTrackRepository.getRemovedTracks().map((x) => x.path);

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
