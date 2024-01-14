const { Logger } = require('../common/logger');
const { CollectionChecker } = require('./collection-checker');
const { TrackIndexer } = require('./track-indexer');
const { AlbumArtworkIndexer } = require('./album-artwork-indexer');
const { TrackRepository } = require('../data/track-repository');

class Indexer {
    static async indexCollectionIfOutdatedAsync() {
        Logger.info('Indexing collection.', 'Indexer', 'indexCollectionIfOutdatedAsync');

        const collectionIsOutdated = await CollectionChecker.isCollectionOutdatedAsync();

        if (collectionIsOutdated) {
            Logger.info('Collection is outdated.', 'Indexer', 'indexCollectionIfOutdatedAsync');
            await TrackIndexer.indexTracksAsync();
        } else {
            Logger.info('Collection is not outdated.', 'Indexer', 'indexCollectionIfOutdatedAsync');
        }

        await AlbumArtworkIndexer.indexAlbumArtworkAsync();
    }

    static async indexCollectionIfFoldersHaveChangedAsync() {
        Logger.info('Indexing collection.', 'Indexer', 'indexCollectionIfFoldersHaveChangedAsync');

        await TrackIndexer.indexTracksAsync();
        await AlbumArtworkIndexer.indexAlbumArtworkAsync();
    }

    static async indexCollectionAlwaysAsync() {
        Logger.info('Indexing collection.', 'Indexer', 'indexCollectionAlwaysAsync');

        await TrackIndexer.indexTracksAsync();
        await AlbumArtworkIndexer.indexAlbumArtworkAsync();
    }

    static async indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover) {
        Logger.info('Indexing collection.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

        TrackRepository.enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover);
        await AlbumArtworkIndexer.indexAlbumArtworkAsync();
    }
}

exports.Indexer = Indexer;
