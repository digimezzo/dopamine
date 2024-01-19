const { Logger } = require('../common/logger');
const { Timer } = require('../common/scheduling/timer');
const { TrackRemover } = require('./track-remover');
const { TrackUpdater } = require('./track-updater');
const { TrackAdder } = require('./track-adder');
const { RefreshingMessage } = require('./messages/refreshing-message');
const { WorkerProxy } = require('../workers/worker-proxy');

class TrackIndexer {
    static async indexTracksAsync() {
        Logger.info('+++ STARTED INDEXING TRACKS +++', 'TrackIndexer', 'indexTracksAsync');

        const timer = new Timer();
        timer.start();

        WorkerProxy.postMessage(new RefreshingMessage());

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
    }
}

exports.TrackIndexer = TrackIndexer;
