import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { IndexingService } from '../app/services/indexing/indexing.service';
import { Logger } from '../app/core/logger';
import { CollectionChecker } from '../app/services/indexing/collection-checker';
import { CollectionIndexer } from '../app/services/indexing/collection-indexer';

describe('IndexingService', () => {
    describe('indexCollectionIfNeeded', () => {
        it('Should index the collection if needed', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const collectionCheckerMock: IMock<CollectionChecker> = Mock.ofType<CollectionChecker>();
            const collectionIndexerMock: IMock<CollectionIndexer> = Mock.ofType<CollectionIndexer>();

            const indexingService: IndexingService = new IndexingService(
                loggerMock.object,
                collectionCheckerMock.object,
                collectionIndexerMock.object
            );

            collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => true);

            // Act
            await indexingService.indexCollectionIfNeededAsync();

            // Assert
            collectionIndexerMock.verify(x => x.indexCollectionAsync(), Times.exactly(1));
        });

        it('Should not index the collection if not needed', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const collectionCheckerMock: IMock<CollectionChecker> = Mock.ofType<CollectionChecker>();
            const collectionIndexerMock: IMock<CollectionIndexer> = Mock.ofType<CollectionIndexer>();

            const indexingService: IndexingService = new IndexingService(
                loggerMock.object,
                collectionCheckerMock.object,
                collectionIndexerMock.object
            );

            collectionCheckerMock.setup(x => x.collectionNeedsIndexingAsync()).returns(async () => false);

            // Act
            await indexingService.indexCollectionIfNeededAsync();

            // Assert
            collectionIndexerMock.verify(x => x.indexCollectionAsync(), Times.never());
        });
    });
});
