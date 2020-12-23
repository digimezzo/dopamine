import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { Timer } from '../../core/timer';
import { FolderTrack } from '../../data/entities/folder-track';
import { Track } from '../../data/entities/track';
import { BaseFolderTrackRepository } from '../../data/repositories/base-folder-track-repository';
import { BaseRemovedTrackRepository } from '../../data/repositories/base-removed-track-repository';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { BaseIndexablePathFetcher } from './base-indexable-path-fetcher';
import { IndexablePath } from './indexable-path';
import { TrackFiller } from './track-filler';

@Injectable()
export class TrackAdder {
    constructor(
        private trackrepository: BaseTrackRepository,
        private folderTrackRepository: BaseFolderTrackRepository,
        private removedTrackrepository: BaseRemovedTrackRepository,
        private indexablePathFetcher: BaseIndexablePathFetcher,
        private trackFiller: TrackFiller,
        private settings: BaseSettings,
        private logger: Logger,
        private snackBarService: BaseSnackBarService) { }

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

                    this.trackrepository.addTrack(newTrack);
                    const addedTrack: Track = this.trackrepository.getTrackByPath(newTrack.path);

                    this.folderTrackRepository.addFolderTrack(new FolderTrack(indexablePath.folderId, addedTrack.trackId));

                    numberOfAddedTracks++;

                    const percentageOfAddedTracks: number = Math.round((numberOfAddedTracks / indexablePaths.length) * 100);

                    await this.snackBarService.addedTracksAsync(numberOfAddedTracks, percentageOfAddedTracks);
                } catch (e) {
                    this.logger.error(
                        `A problem occurred while adding track with path='${indexablePath.path}'. Error: ${e.message}`,
                        'TrackAdder',
                        'addTracksThatAreNotInTheDatabaseAsync');
                }
            }

            timer.stop();

            this.logger.info(
                `Added tracks: ${numberOfAddedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackAdder',
                'addTracksThatAreNotInTheDatabaseAsync');
        } catch (e) {
            timer.stop();

            this.logger.error(
                `A problem occurred while adding tracks. Error: ${e.message}`,
                'TrackAdder',
                'addTracksThatAreNotInTheDatabaseAsync');
        }
    }

    private async getIndexablePathsAsync(skipRemovedFiles: boolean): Promise<IndexablePath[]> {
        const indexablePaths: IndexablePath[] = [];

        const allIndexablePaths: IndexablePath[] = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();
        const trackPaths: string[] = this.trackrepository.getTracks().map(x => x.path);
        const removedTrackPaths: string[] = this.removedTrackrepository.getRemovedTracks().map(x => x.path);

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
