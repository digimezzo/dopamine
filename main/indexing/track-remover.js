const { Timer } = require('../common/scheduling/timer');
const { RemovingTracksMessage } = require('./messages/removing-tracks-message');

class TrackRemover {
    constructor(folderTrackRepository, trackRepository, fileAccess, workerProxy, logger) {
        this.folderTrackRepository = folderTrackRepository;
        this.trackRepository = trackRepository;
        this.fileAccess = fileAccess;
        this.workerProxy = workerProxy;
        this.logger = logger;
    }

    async removeTracksThatDoNoNotBelongToFoldersAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const numberOfTracksToRemove = this.trackRepository.getNumberOfTracksThatDoNotBelongFolders();

            if (numberOfTracksToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There are no tracks to remove. Time required: ${timer.getElapsedMilliseconds()} ms`,
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

            this.workerProxy.postMessage(new RemovingTracksMessage());

            const numberOfRemovedTracks = this.trackRepository.deleteTracksThatDoNotBelongFolders();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedTracks} tracks. Time required: ${timer.getElapsedMilliseconds()} ms`,
                'TrackRemover',
                'removeTracksThatDoNoNotBelongToFoldersAsync',
            );
        } catch (e) {
            timer.stop();

            this.logger.error(e, 'Could not remove tracks', 'TrackRemover', 'removeTracksThatDoNoNotBelongToFoldersAsync');
        }
    }

    async removeTracksThatAreNotFoundOnDiskAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const tracks = this.trackRepository.getAllTracks() ?? [];

            this.logger.info(`Found ${tracks.length} tracks.`, 'TrackRemover', 'removeTracksThatAreNotFoundOnDiskAsync');

            let numberOfRemovedTracks = 0;

            for (const track of tracks) {
                if (!this.fileAccess.pathExists(track.path)) {
                    this.trackRepository.deleteTrack(track.trackId);
                    numberOfRemovedTracks++;
                }

                // Only send message once
                if (numberOfRemovedTracks === 1) {
                    this.workerProxy.postMessage(new RemovingTracksMessage());
                }
            }

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedTracks} tracks. Time required: ${timer.getElapsedMilliseconds()} ms`,
                'TrackRemover',
                'removeTracksThatAreNotFoundOnDiskAsync',
            );
        } catch (e) {
            timer.stop();

            this.logger.error(e, 'Could not remove tracks', 'TrackRemover', 'removeTracksThatAreNotFoundOnDiskAsync');
        }
    }

    async removeFolderTracksForInexistingTracksAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const numberOfFolderTracksToRemove = this.folderTrackRepository.getNumberOfFolderTracksForInexistingTracks();

            if (numberOfFolderTracksToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There are no folder tracks to remove. Time required: ${timer.getElapsedMilliseconds()} ms`,
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

            this.workerProxy.postMessage(new RemovingTracksMessage());

            const numberOfRemovedFolderTracks = this.folderTrackRepository.deleteFolderTracksForInexistingTracks();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedFolderTracks} folder tracks. Time required: ${timer.getElapsedMilliseconds()} ms`,
                'TrackRemover',
                'removeFolderTracksForInexistingTracksAsync',
            );
        } catch (e) {
            timer.stop();

            this.logger.error(e, `Could not remove folder tracks`, 'TrackRemover', 'removeFolderTracksForInexistingTracks');
        }
    }
}

exports.TrackRemover = TrackRemover;
