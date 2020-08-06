import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { Track } from '../../data/entities/track';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { TrackFiller } from './track-filler';

@Injectable({
    providedIn: 'root'
})
export class TrackUpdater {
    constructor(
        private trackRepository: BaseTrackRepository,
        private trackFiller: TrackFiller,
        private fileSystem: FileSystem,
        private logger: Logger) { }

    public async updateTracksThatAreOutOfDateAsync(): Promise<void> {
        try {
            const timer: Timer = new Timer();
            timer.start();

            const tracks: Track[] = this.trackRepository.getTracks();

            let numberOfUpdatedTracks: number = 0;

            for (const track of tracks) {
                try {
                    if (await this.isTrackOutOfDateAsync(track) || track.needsIndexing) {
                        await this.trackFiller.addFileMetadataToTrackAsync(track);
                        this.trackRepository.updateTrack(track);
                        numberOfUpdatedTracks++;
                    }
                } catch (e) {
                    this.logger.error(
                        `A problem occurred while updating track with path='${track.path}'. Error: ${e.message}`,
                        'TrackUpdater',
                        'updateTracksThatAreOutOfDateAsync');
                }

            }

            timer.stop();

            this.logger.info(
                `Updated tracks: ${numberOfUpdatedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackUpdater',
                'updateTracksThatAreOutOfDateAsync');
        } catch (e) {
            this.logger.error(
                `A problem occurred while updating tracks. Error: ${e.message}`,
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
