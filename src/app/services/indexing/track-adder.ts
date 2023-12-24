import { Injectable } from '@angular/core';
import { FolderTrack } from '../../data/entities/folder-track';
import { Track } from '../../data/entities/track';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { SettingsBase } from '../../common/settings/settings.base';
import { IndexablePath } from './indexable-path';
import { IndexablePathFetcher } from './indexable-path-fetcher';
import { SnackBarServiceBase } from '../snack-bar/snack-bar.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { RemovedTrackRepositoryBase } from '../../data/repositories/removed-track-repository.base';
import { FolderTrackRepositoryBase } from '../../data/repositories/folder-track-repository.base';
import { IndexableTrack } from './indexable-track';
import { MetadataAdder } from './metadata-adder';

@Injectable()
export class TrackAdder {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private folderTrackRepository: FolderTrackRepositoryBase,
        private removedTrackRepository: RemovedTrackRepositoryBase,
        private indexablePathFetcher: IndexablePathFetcher,
        private metadataAdder: MetadataAdder,
        private settings: SettingsBase,
        private logger: Logger,
        private snackBarService: SnackBarServiceBase,
    ) {}

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
            const indexablePaths: IndexablePath[] = await this.getIndexablePathsAsync(this.settings.skipRemovedFilesDuringRefresh);

            let numberOfAddedTracks: number = 0;
            const batchSize: number = 20;

            for (let i = 0; i < indexablePaths.length; i += batchSize) {
                const indexablePathsBatch: IndexablePath[] = indexablePaths.slice(i, i + batchSize);
                numberOfAddedTracks += await this.addTracksInBatch(
                    indexablePathsBatch.map((x) => new IndexableTrack(new Track(x.path), x.dateModifiedTicks, x.folderId)),
                );

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
