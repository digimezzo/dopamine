const { Logger } = require('../common/logger');
const { Timer } = require('../common/timer');
const { TrackRemover } = require('./track-remover');
const { TrackUpdater } = require('./track-updater');
const { TrackAdder } = require('./track-adder');

class TrackIndexer {
    static async indexTracksAsync() {
        Logger.info('+++ STARTED INDEXING TRACKS +++', 'TrackIndexer', 'indexTracksAsync');

        const timer = new Timer();
        timer.start();

        // await this.snackBarService.refreshing();

        // Remove tracks
        await TrackRemover.removeTracksThatDoNoNotBelongToFoldersAsync();
        await TrackRemover.removeTracksThatAreNotFoundOnDiskAsync();
        await TrackRemover.removeFolderTracksForInexistingTracksAsync();

        // Update tracks
        await TrackUpdater.updateTracksThatAreOutOfDateAsync();

        // Add tracks
        await TrackAdder.addTracksThatAreNotInTheDatabaseAsync();

        timer.stop();

        Logger.info(
            `+++ FINISHED INDEXING TRACKS (Time required: ${timer.getElapsedMilliseconds()} ms) +++`,
            'TrackIndexer',
            'indexTracksAsync',
        );

        // await this.snackBarService.dismissDelayedAsync();
    }
}

exports.TrackIndexer = TrackIndexer;
