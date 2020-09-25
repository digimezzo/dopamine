import { Times } from 'typemoq';
import { IndexingServiceMock } from './mocking/indexing-service-mock';

describe('IndexingService', () => {
    describe('indexCollectionIfNeeded', () => {
        it('Should index the tracks if needed', async () => {
            // Arrange
            const mock: IndexingServiceMock = new IndexingServiceMock();

            mock.collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => true);

            // Act
            await mock.indexingService.indexCollectionIfNeededAsync();

            // Assert
            mock.trackIndexerMock.verify(x => x.indexTracksAsync(), Times.exactly(1));
        });

        it('Should not index the tracks if not needed', async () => {
            // Arrange
            const mock: IndexingServiceMock = new IndexingServiceMock();

            mock.collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => false);

            // Act
            await mock.indexingService.indexCollectionIfNeededAsync();

            // Assert
            mock.trackIndexerMock.verify(x => x.indexTracksAsync(), Times.never());
        });

        it('Should index album artwork when tracks need indexing', async () => {
            // Arrange
            const mock: IndexingServiceMock = new IndexingServiceMock();

            mock.collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => true);

            // Act
            await mock.indexingService.indexCollectionIfNeededAsync();

            // Assert
            mock.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should index album artwork even when tracks no not need indexing', async () => {
            // Arrange
            const mock: IndexingServiceMock = new IndexingServiceMock();

            mock.collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => false);

            // Act
            await mock.indexingService.indexCollectionIfNeededAsync();

            // Assert
            mock.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });
});
