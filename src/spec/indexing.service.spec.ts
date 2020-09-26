import { Times } from 'typemoq';
import { IndexingServiceMocker } from './mocking/indexing-service-mocker';

describe('IndexingService', () => {
    describe('indexCollectionIfNeeded', () => {
        it('Should index the tracks if needed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            mocker.collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfNeededAsync();

            // Assert
            mocker.trackIndexerMock.verify(x => x.indexTracksAsync(), Times.exactly(1));
        });

        it('Should not index the tracks if not needed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            mocker.collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => false);

            // Act
            await mocker.indexingService.indexCollectionIfNeededAsync();

            // Assert
            mocker.trackIndexerMock.verify(x => x.indexTracksAsync(), Times.never());
        });

        it('Should index album artwork when tracks need indexing', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            mocker.collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfNeededAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should index album artwork even when tracks no not need indexing', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            mocker.collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => false);

            // Act
            await mocker.indexingService.indexCollectionIfNeededAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });
});
