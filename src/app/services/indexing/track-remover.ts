import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { Track } from '../../data/entities/track';
import { BaseFolderTrackRepository } from '../../data/repositories/base-folder-track-repository';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';

@Injectable({
    providedIn: 'root'
})
export class TrackRemover {
    constructor(
        private trackRepository: BaseTrackRepository,
        private folderTrackRepository: BaseFolderTrackRepository,
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
                'TrackRemover',
                'removeTracksThatDoNoNotBelongToFolders');
        } catch (e) {
            this.logger.error(
                `A problem occurred while removing tracks that do not belong to folders. Error: ${e.message}`,
                'TrackRemover',
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
                'TrackRemover',
                'removeTracksThatAreNotFoundOnDisk');
        } catch (e) {
            this.logger.error(
                `A problem occurred while removing tracks that are not found on disk. Error: ${e.message}`,
                'TrackRemover',
                'removeTracksThatAreNotFoundOnDisk');
        }
    }

    public removeOrphanedFolderTracks(): void {
        try {
            const timer: Timer = new Timer();
            timer.start();

            this.folderTrackRepository.deleteOrphanedFolderTracks();

            timer.stop();

            this.logger.info(
                `Removed orphaned FolderTracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeOrphanedFolderTracks');
        } catch (e) {
            this.logger.error(
                `A problem occurred while removing orphaned FolderTracks. Error: ${e.message}`,
                'TrackRemover',
                'removeOrphanedFolderTracks');
        }
    }
}
