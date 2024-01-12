const { Timer } = require('../common/timer');
const { Logger } = require('../common/logger');
const { FileAccess } = require('../common/file-access');
const { TrackRepository } = require('../data/track-repository');
const { FolderTrackRepository } = require('../data/folder-track-repository');

class TrackRemover {
    static async removeTracksThatDoNoNotBelongToFoldersAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const numberOfTracksToRemove = TrackRepository.getNumberOfTracksThatDoNotBelongFolders();

            if (numberOfTracksToRemove === 0) {
                timer.stop();

                Logger.info(
                    `There are no tracks to remove. Time required: ${timer.getElapsedMilliseconds()} ms`,
                    'TrackRemover',
                    'removeTracksThatDoNoNotBelongToFoldersAsync',
                );

                return;
            }

            Logger.info(`Found ${numberOfTracksToRemove} tracks to remove.`, 'TrackRemover', 'removeTracksThatDoNoNotBelongToFoldersAsync');

            // await this.snackBarService.removingTracksAsync();

            const numberOfRemovedTracks = TrackRepository.deleteTracksThatDoNotBelongFolders();

            timer.stop();

            Logger.info(
                `Removed ${numberOfRemovedTracks} tracks. Time required: ${timer.getElapsedMilliseconds()} ms`,
                'TrackRemover',
                'removeTracksThatDoNoNotBelongToFoldersAsync',
            );
        } catch (e) {
            timer.stop();

            Logger.error(e, 'Could not remove tracks', 'TrackRemover', 'removeTracksThatDoNoNotBelongToFoldersAsync');
        }
    }

    static async removeTracksThatAreNotFoundOnDiskAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const tracks = TrackRepository.getAllTracks() ?? [];

            Logger.info(`Found ${tracks.length} tracks.`, 'TrackRemover', 'removeTracksThatAreNotFoundOnDiskAsync');

            let numberOfRemovedTracks = 0;

            for (const track of tracks) {
                if (!FileAccess.pathExists(track.path)) {
                    TrackRepository.deleteTrack(track.trackId);
                    numberOfRemovedTracks++;
                }

                // Only trigger the snack bar once
                // if (numberOfRemovedTracks === 1) {
                //   await this.snackBarService.removingTracksAsync();
                // }
            }

            timer.stop();

            Logger.info(
                `Removed ${numberOfRemovedTracks} tracks. Time required: ${timer.getElapsedMilliseconds()} ms`,
                'TrackRemover',
                'removeTracksThatAreNotFoundOnDiskAsync',
            );
        } catch (e) {
            timer.stop();

            Logger.error(e, 'Could not remove tracks', 'TrackRemover', 'removeTracksThatAreNotFoundOnDiskAsync');
        }
    }

    static async removeFolderTracksForInexistingTracksAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const numberOfFolderTracksToRemove = FolderTrackRepository.getNumberOfFolderTracksForInexistingTracks();

            if (numberOfFolderTracksToRemove === 0) {
                timer.stop();

                Logger.info(
                    `There are no folder tracks to remove. Time required: ${timer.getElapsedMilliseconds()} ms`,
                    'TrackRemover',
                    'removeFolderTracksForInexistingTracksAsync',
                );

                return;
            }

            Logger.info(
                `Found ${numberOfFolderTracksToRemove} folder tracks to remove.`,
                'TrackRemover',
                'removeFolderTracksForInexistingTracksAsync',
            );

            // await this.snackBarService.removingTracksAsync();

            const numberOfRemovedFolderTracks = FolderTrackRepository.deleteFolderTracksForInexistingTracks();

            timer.stop();

            Logger.info(
                `Removed ${numberOfRemovedFolderTracks} folder tracks. Time required: ${timer.getElapsedMilliseconds()} ms`,
                'TrackRemover',
                'removeFolderTracksForInexistingTracksAsync',
            );
        } catch (e) {
            timer.stop();

            Logger.error(e, `Could not remove folder tracks`, 'TrackRemover', 'removeFolderTracksForInexistingTracks');
        }
    }
}

exports.TrackRemover = TrackRemover;
