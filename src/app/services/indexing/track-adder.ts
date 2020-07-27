import { Injectable } from '@angular/core';
import { BaseSettings } from '../../core/settings/base-settings';
import { RemovedTrack } from '../../data/entities/removed-track';
import { Track } from '../../data/entities/track';
import { BaseRemovedTrackRepository } from '../../data/repositories/base-removed-track-repository';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { IndexablePath } from './indexable-path';
import { IndexablePathFetcher } from './indexable-path-fetcher';

@Injectable({
    providedIn: 'root'
})
export class TrackAdder {
    constructor(
        private trackrepository: BaseTrackRepository,
        private removedTrackrepository: BaseRemovedTrackRepository,
        private indexablePathFetcher: IndexablePathFetcher,
        private settings: BaseSettings) { }

    public async addTracksThatAreNotInTheDatabaseAsync(): Promise<void> {
        const tracks: Track[] = this.trackrepository.getTracks();
        const removedTracks: RemovedTrack[] = this.removedTrackrepository.getRemovedTracks();
        const indexablePaths: IndexablePath[] = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();

        const trackPaths: string[] = tracks.map(x => x.path);
        const indexablePathsThatAreNotInTheDatabase: IndexablePath[] = indexablePaths.filter(x => !trackPaths.includes(x.path));

        for (const indexablePath of indexablePathsThatAreNotInTheDatabase) {
            const newTrack: Track = new Track(indexablePath.path);
            newTrack.dateFileModified = indexablePath.dateModifiedTicks;

            this.trackrepository.addTrack(newTrack);
        }
    }
}
