const { DismissMessage } = require('./messages/dismiss-message');

class Indexer {
    constructor(collectionChecker, albumArtworkIndexer, trackIndexer, trackRepository, workerProxy, logger) {
        this.collectionChecker = collectionChecker;
        this.albumArtworkIndexer = albumArtworkIndexer;
        this.trackIndexer = trackIndexer;
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

        await this.albumArtworkIndexer.indexAlbumArtworkAsync();

        this.workerProxy.postMessage(new DismissMessage());
    }

    async indexCollectionAlwaysAsync() {
        this.logger.info('Indexing collection.', 'Indexer', 'indexCollectionAlwaysAsync');

        await this.trackIndexer.indexTracksAsync();
        await this.albumArtworkIndexer.indexAlbumArtworkAsync();

        this.workerProxy.postMessage(new DismissMessage());
    }

    async indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover) {
        this.logger.info('Indexing collection.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

        this.trackRepository.enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover);
        await this.albumArtworkIndexer.indexAlbumArtworkAsync();

        this.workerProxy.postMessage(new DismissMessage());
    }
}

exports.Indexer = Indexer;
