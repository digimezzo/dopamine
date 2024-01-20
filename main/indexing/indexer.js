const { Logger } = require('../common/logger');
const { CollectionChecker } = require('./collection-checker');
const { TrackIndexer } = require('./track-indexer');
const { AlbumArtworkIndexer } = require('./album-artwork-indexer');
const { TrackRepository } = require('../data/track-repository');
const { DismissMessage } = require('./messages/dismiss-message');
const { WorkerProxy } = require('../workers/worker-proxy');
const { Ioc } = require('../ioc/ioc');

class Indexer {
    static async indexCollectionIfOutdatedAsync() {
        const parent = Ioc.get('Parent');
        Logger.info(`Parent says: ${parent.getName()}`, 'Indexer', 'indexCollectionIfOutdatedAsync');
        Logger.info('Indexing collection.', 'Indexer', 'indexCollectionIfOutdatedAsync');

        const collectionIsOutdated = await CollectionChecker.isCollectionOutdatedAsync();

        if (collectionIsOutdated) {
            Logger.info('Collection is outdated.', 'Indexer', 'indexCollectionIfOutdatedAsync');
            await TrackIndexer.indexTracksAsync();
        } else {
            Logger.info('Collection is not outdated.', 'Indexer', 'indexCollectionIfOutdatedAsync');
        }

        await AlbumArtworkIndexer.indexAlbumArtworkAsync();

        WorkerProxy.postMessage(new DismissMessage());
    }

    static async indexCollectionAlwaysAsync() {
        Logger.info('Indexing collection.', 'Indexer', 'indexCollectionAlwaysAsync');

        await TrackIndexer.indexTracksAsync();
        await AlbumArtworkIndexer.indexAlbumArtworkAsync();

        WorkerProxy.postMessage(new DismissMessage());
    }

    static async indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover) {
        Logger.info('Indexing collection.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

        TrackRepository.enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover);
        await AlbumArtworkIndexer.indexAlbumArtworkAsync();

        WorkerProxy.postMessage(new DismissMessage());
    }
}

exports.Indexer = Indexer;
