const { Logger } = require('../common/logger');
const { CollectionChecker } = require('./collection-checker');
const { TrackIndexer } = require('./track-indexer');

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

        // await this.albumArtworkIndexer.indexAlbumArtworkAsync();
    }

    static async indexCollectionIfFoldersHaveChangedAsync() {
        Logger.info('Indexing collection.', 'Indexer', 'indexCollectionIfFoldersHaveChangedAsync');

        await TrackIndexer.indexTracksAsync();
        // await this.albumArtworkIndexer.indexAlbumArtworkAsync();
    }

    static async indexCollectionAlwaysAsync() {
        Logger.info('Indexing collection.', 'Indexer', 'indexCollectionAlwaysAsync');

        await TrackIndexer.indexTracksAsync();
        // await this.albumArtworkIndexer.indexAlbumArtworkAsync();
    }

    // public async indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover: boolean): Promise<void> {
    //   if (this.isIndexingCollection) {
    //     this.logger.info('Already indexing.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');
    //
    //     return;
    //   }
    //
    //   this.isIndexingCollection = true;
    //   this.foldersHaveChanged = false;
    //
    //   this.logger.info('Indexing collection.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');
    //
    //   this.trackRepository.enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover);
    //   await this.albumArtworkIndexer.indexAlbumArtworkAsync();
    //
    //   this.isIndexingCollection = false;
    //   this.indexingFinished.next();
    // }
}

exports.Indexer = Indexer;
