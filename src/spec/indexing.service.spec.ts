import { IMock, Mock, Times } from 'typemoq';
import { AlbumArtworkIndexer } from '../app/services/indexing/album-artwork-indexer';
import { CollectionChecker } from '../app/services/indexing/collection-checker';
import { IndexingService } from '../app/services/indexing/indexing.service';
import { TrackIndexer } from '../app/services/indexing/track-indexer';

describe('IndexingService', () => {
    describe('indexCollectionIfNeeded', () => {
        it('Should index the tracks if needed', async () => {
            // Arrange
            const collectionCheckerMock: IMock<CollectionChecker> = Mock.ofType<CollectionChecker>();
            const trackIndexerMock: IMock<TrackIndexer> = Mock.ofType<TrackIndexer>();
            const albumArtworkIndexerMock: IMock<AlbumArtworkIndexer> = Mock.ofType<AlbumArtworkIndexer>();

            const indexingService: IndexingService = new IndexingService(
                collectionCheckerMock.object,
                trackIndexerMock.object,
                albumArtworkIndexerMock.object
            );

            collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => true);

            // Act
            await indexingService.indexCollectionIfNeededAsync();

            // Assert
            trackIndexerMock.verify(x => x.indexTracksAsync(), Times.exactly(1));
        });

        it('Should not index the tracks if not needed', async () => {
            // Arrange
            const collectionCheckerMock: IMock<CollectionChecker> = Mock.ofType<CollectionChecker>();
            const trackIndexerMock: IMock<TrackIndexer> = Mock.ofType<TrackIndexer>();
            const albumArtworkIndexerMock: IMock<AlbumArtworkIndexer> = Mock.ofType<AlbumArtworkIndexer>();

            const indexingService: IndexingService = new IndexingService(
                collectionCheckerMock.object,
                trackIndexerMock.object,
                albumArtworkIndexerMock.object
            );

            collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => false);

            // Act
            await indexingService.indexCollectionIfNeededAsync();

            // Assert
            trackIndexerMock.verify(x => x.indexTracksAsync(), Times.never());
        });

        it('Should index album artwork when tracks need indexing', async () => {
            // Arrange
            const collectionCheckerMock: IMock<CollectionChecker> = Mock.ofType<CollectionChecker>();
            const trackIndexerMock: IMock<TrackIndexer> = Mock.ofType<TrackIndexer>();
            const albumArtworkIndexerMock: IMock<AlbumArtworkIndexer> = Mock.ofType<AlbumArtworkIndexer>();

            const indexingService: IndexingService = new IndexingService(
                collectionCheckerMock.object,
                trackIndexerMock.object,
                albumArtworkIndexerMock.object
            );

            collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => true);

            // Act
            await indexingService.indexCollectionIfNeededAsync();

            // Assert
            albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should index album artwork even when tracks no not need indexing', async () => {
            // Arrange
            const collectionCheckerMock: IMock<CollectionChecker> = Mock.ofType<CollectionChecker>();
            const trackIndexerMock: IMock<TrackIndexer> = Mock.ofType<TrackIndexer>();
            const albumArtworkIndexerMock: IMock<AlbumArtworkIndexer> = Mock.ofType<AlbumArtworkIndexer>();

            const indexingService: IndexingService = new IndexingService(
                collectionCheckerMock.object,
                trackIndexerMock.object,
                albumArtworkIndexerMock.object
            );

            collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => false);

            // Act
            await indexingService.indexCollectionIfNeededAsync();

            // Assert
            albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });
});
