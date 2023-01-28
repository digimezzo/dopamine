import { Injectable } from '@angular/core';
import { Track } from '../../common/data/entities/track';
import { BaseFolderTrackRepository } from '../../common/data/repositories/base-folder-track-repository';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';

@Injectable()
export class TrackRemover {
    constructor(
        private trackRepository: BaseTrackRepository,
        private folderTrackRepository: BaseFolderTrackRepository,
        private snackBarService: BaseSnackBarService,
        private fileAccess: BaseFileAccess,
        private logger: Logger
    ) {}

    public removeTracksThatDoNoNotBelongToFolders(): void {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const numberOfTracksToRemove: number = this.trackRepository.getNumberOfTracksThatDoNotBelongFolders();

            if (numberOfTracksToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There are no tracks to remove. Time required: ${timer.elapsedMilliseconds} ms`,
                    'TrackRemover',
                    'removeTracksThatDoNoNotBelongToFolders'
                );

                return;
            }

            this.logger.info(`Found ${numberOfTracksToRemove} tracks to remove.`, 'TrackRemover', 'removeTracksThatDoNoNotBelongToFolders');

            this.snackBarService.removingTracksAsync();

            const numberOfRemovedTracks: number = this.trackRepository.deleteTracksThatDoNotBelongFolders();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedTracks} tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeTracksThatDoNoNotBelongToFolders'
            );
        } catch (e) {
            timer.stop();

            this.logger.error(`Could not remove tracks. Error: ${e.message}`, 'TrackRemover', 'removeTracksThatDoNoNotBelongToFolders');
        }
    }

    public async removeTracksThatAreNotFoundOnDiskAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const tracks: Track[] = this.trackRepository.getAllTracks();

            this.logger.info(`Found ${tracks.length} tracks.`, 'TrackRemover', 'removeTracksThatAreNotFoundOnDisk');

            let numberOfRemovedTracks: number = 0;

            for (const track of tracks) {
                if (!this.fileAccess.pathExists(track.path)) {
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
                `Removed ${numberOfRemovedTracks} tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeTracksThatAreNotFoundOnDisk'
            );
        } catch (e) {
            timer.stop();

            this.logger.error(`Could not remove tracks. Error: ${e.message}`, 'TrackRemover', 'removeTracksThatAreNotFoundOnDisk');
        }
    }

    public removeFolderTracksForInexistingTracks(): void {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const numberOfFolderTracksToRemove: number = this.folderTrackRepository.getNumberOfFolderTracksForInexistingTracks();

            if (numberOfFolderTracksToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There are no folder tracks to remove. Time required: ${timer.elapsedMilliseconds} ms`,
                    'TrackRemover',
                    'removeFolderTracksForInexistingTracks'
                );

                return;
            }

            this.logger.info(
                `Found ${numberOfFolderTracksToRemove} folder tracks to remove.`,
                'TrackRemover',
                'removeFolderTracksForInexistingTracks'
            );

            this.snackBarService.removingTracksAsync();

            const numberOfRemovedFolderTracks: number = this.folderTrackRepository.deleteFolderTracksForInexistingTracks();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedFolderTracks} folder tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeFolderTracksForInexistingTracks'
            );
        } catch (e) {
            timer.stop();

            this.logger.error(
                `Could not remove folder tracks. Error: ${e.message}`,
                'TrackRemover',
                'removeFolderTracksForInexistingTracks'
            );
        }
    }
}
