import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { Track } from '../../data/entities/track';
import { BaseFolderTrackRepository } from '../../data/repositories/base-folder-track-repository';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';

@Injectable()
export class TrackRemover {
    constructor(
        private trackRepository: BaseTrackRepository,
        private folderTrackRepository: BaseFolderTrackRepository,
        private snackBarService: BaseSnackBarService,
        private fileSystem: FileSystem,
        private logger: Logger
    ) { }

    public removeTracksThatDoNoNotBelongToFolders(): void {
        try {
            const timer: Timer = new Timer();
            timer.start();

            const numberOfTracksToRemove: number = this.trackRepository.getNumberOfTracksThatDoNotBelongFolders();

            if (numberOfTracksToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There are no tracks that do not belong to folders. Time required: ${timer.elapsedMilliseconds} ms`,
                    'TrackRemover',
                    'removeTracksThatDoNoNotBelongToFolders');

                return;
            }

            this.snackBarService.removingTracksAsync();

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

    public async removeTracksThatAreNotFoundOnDiskAsync(): Promise<void> {
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

                if (numberOfRemovedTracks === 1) {
                    // Only trigger the snack bar once
                    await this.snackBarService.removingTracksAsync();
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

    public removeFolderTracksForInexistingTracks(): void {
        try {
            const timer: Timer = new Timer();
            timer.start();

            const numberOfFolderTracksToRemove: number = this.folderTrackRepository.getNumberOfFolderTracksForInexistingTracks();

            if (numberOfFolderTracksToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There are no folder tracks for inexisting tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                    'TrackRemover',
                    'removeFolderTracksForInexistingTracks');

                return;
            }

            this.snackBarService.removingTracksAsync();

            const numberOfRemovedFolderTracks: number = this.folderTrackRepository.deleteFolderTracksForInexistingTracks();

            timer.stop();

            this.logger.info(
                `Removed folder tracks for inexisting tracks: ${numberOfRemovedFolderTracks}.
                Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeFolderTracksForInexistingTracks');
        } catch (e) {
            this.logger.error(
                `A problem occurred while removing folder tracks for inexisting tracks. Error: ${e.message}`,
                'TrackRemover',
                'removeFolderTracksForInexistingTracks');
        }
    }
}
