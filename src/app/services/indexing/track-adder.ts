import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
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
        private settings: BaseSettings,
        private logger: Logger) { }

    public async addTracksThatAreNotInTheDatabaseAsync(): Promise<void> {
        try {
            const indexablePaths: IndexablePath[] = await this.getIndexablePathsAsync(this.settings.ignoreRemovedFiles);

            for (const indexablePath of indexablePaths) {
                try {
                    const newTrack: Track = new Track(indexablePath.path);
                    newTrack.dateFileModified = indexablePath.dateModifiedTicks;
                    newTrack.artists = '';
                    newTrack.genres = '';
                    newTrack.albumTitle = '';
                    newTrack.albumArtists = '';
                    newTrack.albumKey = '';
                    newTrack.fileName = '';
                    newTrack.mimeType = '';
                    newTrack.fileSize = 0;
                    newTrack.bitRate = 0;
                    newTrack.sampleRate = 0;
                    newTrack.trackTitle = '';
                    newTrack.trackNumber = 0;
                    newTrack.trackCount = 0;
                    newTrack.discNumber = 0;
                    newTrack.discCount = 0;
                    newTrack.duration = 0;
                    newTrack.year = 0;
                    newTrack.hasLyrics = 0;
                    newTrack.dateAdded = 0;
                    newTrack.dateFileCreated = 0;
                    newTrack.dateLastSynced = 0;
                    newTrack.dateFileModified = 0;
                    newTrack.needsIndexing = 0;
                    newTrack.needsAlbumArtworkIndexing = 0;
                    newTrack.indexingSuccess = 1;
                    newTrack.indexingFailureReason = '';
                    newTrack.rating = 0;
                    newTrack.love = 0;
                    newTrack.playCount = 0;
                    newTrack.skipCount = 0;
                    newTrack.dateLastPlayed = 0;

                    this.trackrepository.addTrack(newTrack);
                } catch (error) {
                    this.logger.error(
                        `A problem occurred while adding track with path='${indexablePath.path}'. Error: ${error}`,
                        'TrackAdder',
                        'addTracksThatAreNotInTheDatabaseAsync');
                }
            }
        } catch (error) {
            this.logger.error(
                `A problem occurred while adding tracks. Error: ${error}`,
                'TrackAdder',
                'addTracksThatAreNotInTheDatabaseAsync');
        }
    }

    private async getIndexablePathsAsync(ignoreRemovedFiles: boolean): Promise<IndexablePath[]> {
        const indexablePaths: IndexablePath[] = [];

        const allIndexablePaths: IndexablePath[] = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();
        const trackPaths: string[] = this.trackrepository.getTracks().map(x => x.path);
        const removedTrackPaths: string[] = this.removedTrackrepository.getRemovedTracks().map(x => x.path);

        for (const indexablePath of allIndexablePaths) {
            if (!trackPaths.includes(indexablePath.path) && ignoreRemovedFiles ? !removedTrackPaths.includes(indexablePath.path) : true) {
                indexablePaths.push(indexablePath);
            }
        }

        return indexablePaths;
    }
}
