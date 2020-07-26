import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { Track } from '../../data/entities/track';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';

@Injectable({
    providedIn: 'root'
})
export class TrackUpdater {
    constructor(
        private trackRepository: BaseTrackRepository,
        private fileSystem: FileSystem,
        private logger: Logger) { }

    public async updateTracksThatAreOutOfDateAsync(): Promise<void> {
        const numberOfUpdatedTracks: number = 0;

        try {
            const tracks: Track[] = this.trackRepository.getTracks();

            for (const track of tracks) {
                try {
                    if (await this.isTrackOutOfDateAsync(track) || track.needsIndexing) {
                        this.trackRepository.updateTrack(track);
                    }
                } catch (error) {
                    this.logger.error(
                        `A problem occurred while updating track with path='${track.path}'. Error: ${error}`,
                        'TrackUpdater',
                        'updateTracksThatAreOutOfDateAsync');
                }

            }
        } catch (error) {
            this.logger.error(
                `A problem occurred while updating tracks. Error: ${error}`,
                'TrackUpdater',
                'updateTracksThatAreOutOfDateAsync');
        }
    }

    private async isTrackOutOfDateAsync(track: Track): Promise<boolean> {
        if (track.fileSize === 0) {
            return true;
        }

        if (track.fileSize !== this.fileSystem.getFilesizeInBytes(track.path)) {
            return true;
        }

        if (track.dateFileModified !== await this.fileSystem.getDateModifiedInTicksAsync(track.path)) {
            return true;
        }

        return false;
    }
}
