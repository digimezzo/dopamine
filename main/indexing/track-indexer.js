const { Timer } = require('../common/scheduling/timer');
const { RefreshingMessage } = require('./messages/refreshing-message');

class TrackIndexer {
    constructor(trackAdder, trackUpdater, trackRemover, workerProxy, logger) {
        this.trackAdder = trackAdder;
        this.trackUpdater = trackUpdater;
        this.trackRemover = trackRemover;
        this.workerProxy = workerProxy;
        this.logger = logger;
    }

    async indexTracksAsync() {
        this.logger.info('+++ STARTED INDEXING TRACKS +++', 'TrackIndexer', 'indexTracksAsync');

        const timer = new Timer();
        timer.start();

        this.workerProxy.postMessage(new RefreshingMessage());

        // Remove tracks
        await this.trackRemover.removeTracksThatDoNoNotBelongToFoldersAsync();
        await this.trackRemover.removeTracksThatAreNotFoundOnDiskAsync();
        await this.trackRemover.removeFolderTracksForInexistingTracksAsync();

        // Update tracks
        await this.trackUpdater.updateTracksThatAreOutOfDateAsync();

        // Add tracks
        await this.trackAdder.addTracksThatAreNotInTheDatabaseAsync();

        timer.stop();

        this.logger.info(
            `+++ FINISHED INDEXING TRACKS (Time required: ${timer.getElapsedMilliseconds()} ms) +++`,
            'TrackIndexer',
            'indexTracksAsync',
        );
    }
}

exports.TrackIndexer = TrackIndexer;
