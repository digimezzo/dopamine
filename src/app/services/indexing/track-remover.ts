import { Injectable } from '@angular/core';
import { Track } from '../../data/entities/track';
import { Logger } from '../../common/logger';
import { Timer } from '../../common/scheduling/timer';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FolderTrackRepositoryBase } from '../../data/repositories/folder-track-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { NotificationServiceBase } from '../notification/notification.service.base';

@Injectable()
export class TrackRemover {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private folderTrackRepository: FolderTrackRepositoryBase,
        private notificationService: NotificationServiceBase,
        private fileAccess: FileAccessBase,
        private logger: Logger,
    ) {}

    public async removeTracksThatDoNoNotBelongToFoldersAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const numberOfTracksToRemove: number = this.trackRepository.getNumberOfTracksThatDoNotBelongFolders();

            if (numberOfTracksToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There are no tracks to remove. Time required: ${timer.elapsedMilliseconds} ms`,
                    'TrackRemover',
                    'removeTracksThatDoNoNotBelongToFoldersAsync',
                );

                return;
            }

            this.logger.info(
                `Found ${numberOfTracksToRemove} tracks to remove.`,
                'TrackRemover',
                'removeTracksThatDoNoNotBelongToFoldersAsync',
            );

            await this.notificationService.removingTracksAsync();

            const numberOfRemovedTracks: number = this.trackRepository.deleteTracksThatDoNotBelongFolders();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedTracks} tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeTracksThatDoNoNotBelongToFoldersAsync',
            );
        } catch (e: unknown) {
            timer.stop();

            this.logger.error(e, 'Could not remove tracks', 'TrackRemover', 'removeTracksThatDoNoNotBelongToFoldersAsync');
        }
    }

    public async removeTracksThatAreNotFoundOnDiskAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const tracks: Track[] = this.trackRepository.getAllTracks() ?? [];

            this.logger.info(`Found ${tracks.length} tracks.`, 'TrackRemover', 'removeTracksThatAreNotFoundOnDiskAsync');

            let numberOfRemovedTracks: number = 0;

            for (const track of tracks) {
                if (!this.fileAccess.pathExists(track.path)) {
                    this.trackRepository.deleteTrack(track.trackId);
                    numberOfRemovedTracks++;
                }

                // Only trigger the snack bar once
                if (numberOfRemovedTracks === 1) {
                    await this.notificationService.removingTracksAsync();
                }
            }

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedTracks} tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeTracksThatAreNotFoundOnDiskAsync',
            );
        } catch (e: unknown) {
            timer.stop();

            this.logger.error(e, 'Could not remove tracks', 'TrackRemover', 'removeTracksThatAreNotFoundOnDiskAsync');
        }
    }

    public async removeFolderTracksForInexistingTracksAsync(): Promise<void> {
        const timer: Timer = new Timer();
        timer.start();

        try {
            const numberOfFolderTracksToRemove: number = this.folderTrackRepository.getNumberOfFolderTracksForInexistingTracks();

            if (numberOfFolderTracksToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There are no folder tracks to remove. Time required: ${timer.elapsedMilliseconds} ms`,
                    'TrackRemover',
                    'removeFolderTracksForInexistingTracksAsync',
                );

                return;
            }

            this.logger.info(
                `Found ${numberOfFolderTracksToRemove} folder tracks to remove.`,
                'TrackRemover',
                'removeFolderTracksForInexistingTracksAsync',
            );

            await this.notificationService.removingTracksAsync();

            const numberOfRemovedFolderTracks: number = this.folderTrackRepository.deleteFolderTracksForInexistingTracks();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedFolderTracks} folder tracks. Time required: ${timer.elapsedMilliseconds} ms`,
                'TrackRemover',
                'removeFolderTracksForInexistingTracksAsync',
            );
        } catch (e: unknown) {
            timer.stop();

            this.logger.error(e, `Could not remove folder tracks`, 'TrackRemover', 'removeFolderTracksForInexistingTracks');
        }
    }
}
