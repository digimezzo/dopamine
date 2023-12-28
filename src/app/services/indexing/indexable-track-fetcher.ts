import { Injectable } from '@angular/core';
import { IndexablePath } from './indexable-path';
import { IndexableTrack } from './indexable-track';
import { IndexablePathFetcher } from './indexable-path-fetcher';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { RemovedTrackRepositoryBase } from '../../data/repositories/removed-track-repository.base';

@Injectable({ providedIn: 'root' })
export class IndexableTrackFetcher {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private removedTrackRepository: RemovedTrackRepositoryBase,
        private indexablePathFetcher: IndexablePathFetcher,
    ) {}

    public async getIndexableTracksAsync(skipRemovedFiles: boolean): Promise<IndexableTrack[]> {
        const indexableTracks: IndexableTrack[] = [];

        const indexablePaths: IndexablePath[] = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();
        const trackPaths: string[] = (this.trackRepository.getAllTracks() ?? []).map((x) => x.path);
        const removedTrackPaths: string[] = (this.removedTrackRepository.getRemovedTracks() ?? []).map((x) => x.path);

        for (const indexablePath of indexablePaths) {
            const isTrackInDatabase: boolean = trackPaths.includes(indexablePath.path);
            const isTrackThatWasPreviouslyRemoved: boolean = removedTrackPaths.includes(indexablePath.path);
            const allowReAddingRemovedTracks: boolean = !skipRemovedFiles;
            const isTrackThatWasPreviouslyRemovedAndCanBeReAdded: boolean = isTrackThatWasPreviouslyRemoved && allowReAddingRemovedTracks;

            if (!isTrackInDatabase) {
                if (!isTrackThatWasPreviouslyRemoved || isTrackThatWasPreviouslyRemovedAndCanBeReAdded) {
                    indexableTracks.push(new IndexableTrack(indexablePath));
                }
            }
        }

        return indexableTracks;
    }
}
