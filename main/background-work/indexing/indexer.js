const { DismissMessage } = require('./messages/dismiss-message');

class Indexer {
    constructor(collectionChecker, trackIndexer, trackUpdater, trackRepository, workerProxy, logger) {
        this.collectionChecker = collectionChecker;
        this.trackIndexer = trackIndexer;
        this.trackUpdater = trackUpdater;
        this.trackRepository = trackRepository;
        this.workerProxy = workerProxy;
        this.logger = logger;
    }

    async indexCollectionIfOutdatedAsync() {
        this.logger.info('Indexing collection.', 'Indexer', 'indexCollectionIfOutdatedAsync');

        const collectionIsOutdated = await this.collectionChecker.isCollectionOutdatedAsync();

        if (collectionIsOutdated) {
            this.logger.info('Collection is outdated.', 'Indexer', 'indexCollectionIfOutdatedAsync');
            await this.trackIndexer.indexTracksAsync();
        } else {
            this.logger.info('Collection is not outdated.', 'Indexer', 'indexCollectionIfOutdatedAsync');
        }

        this.workerProxy.postMessage(new DismissMessage());
    }

    async indexCollectionAlwaysAsync() {
        this.logger.info('Indexing collection.', 'Indexer', 'indexCollectionAlwaysAsync');

        await this.trackIndexer.indexTracksAsync();

        this.workerProxy.postMessage(new DismissMessage());
    }

    reindexReplayGainForExistingTracks() {
        this.logger.info('Reindexing ReplayGain for existing tracks.', 'Indexer', 'reindexReplayGainForExistingTracks');

        this.trackUpdater.reindexReplayGainForExistingTracks();

        this.workerProxy.postMessage(new DismissMessage());
    }
}

exports.Indexer = Indexer;
