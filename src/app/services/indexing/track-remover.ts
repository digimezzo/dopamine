import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { Track } from '../../data/entities/track';
import { FileSystem } from '../../core/io/file-system';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';

@Injectable({
    providedIn: 'root'
})
export class TrackRemover {
    constructor(
        private trackRepository: BaseTrackRepository,
        private fileSystem: FileSystem,
        private logger: Logger
    ) { }

    public removeTracksThatDoNoNotBelongToFolders(): void {
        try {
            const timer: Timer = new Timer();
            timer.start();

            const numberOfRemovedTracks: number = this.trackRepository.deleteTracksThatDoNotBelongFolders();

            timer.stop();

            this.logger.info(
                `Tracks removed that do not belong to folders: ${numberOfRemovedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackIndexer',
                'removeTracksThatDoNoNotBelongToFolders');
        } catch (error) {
            this.logger.error(
                `A problem occurred while removing tracks that do not belong to folders. Error: ${error}`,
                'TrackIndexer',
                'removeTracksThatDoNoNotBelongToFolders');
        }
    }

    public removeTracksThatAreNotFoundOnDisk(): void {
        try {
            const timer: Timer = new Timer();
            timer.start();

            const tracks: Track[] = this.trackRepository.getTracks();

            let numberOfRemovedTracks: number = 0;

            for (const track of tracks) {
                if (!this.fileSystem.pathExists(track.path)) {
                    this.trackRepository.deleteTrack(track.trackId);
                    numberOfRemovedTracks++;
                }
            }

            timer.stop();

            this.logger.info(
                `Tracks removed that are not found on disk: ${numberOfRemovedTracks}. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackIndexer',
                'removeTracksThatAreNotFoundOnDisk');
        } catch (error) {
            this.logger.error(
                `A problem occurred while removing tracks that are not found on disk. Error: ${error}`,
                'TrackIndexer',
                'removeTracksThatAreNotFoundOnDisk');
        }
    }
}
