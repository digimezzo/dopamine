import * as assert from 'assert';
import { CollectionCheckerMock } from './mocking/collection-checker-mock';

describe('CollectionChecker', () => {
    describe('collectionNeedsIndexingAsync', () => {
        it('Should not require indexing when there are no changes', async () => {
            // Arrange
            const mock: CollectionCheckerMock = new CollectionCheckerMock();

            mock.trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mock.trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 2);
            mock.trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await mock.collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(!collectionNeedsIndexing);
        });

        it('Should require indexing if there are database tracks that need indexing', async () => {
            // Arrange
            const mock: CollectionCheckerMock = new CollectionCheckerMock();

            mock.trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 1);
            mock.trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 2);
            mock.trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await mock.collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });

        it('Should require indexing if the number of database tracks is larger than the number of files on disk', async () => {
            // Arrange
            const mock: CollectionCheckerMock = new CollectionCheckerMock();

            mock.trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mock.trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 3);
            mock.trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await mock.collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });

        it('Should require indexing if the number of database tracks is smaller than the number of files on disk', async () => {
            // Arrange
            const mock: CollectionCheckerMock = new CollectionCheckerMock();

            mock.trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mock.trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 1);
            mock.trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await mock.collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });

        it('Should require indexing if a database track is out of date', async () => {
            // Arrange
            const mock: CollectionCheckerMock = new CollectionCheckerMock();

            mock.trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mock.trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 2);
            mock.trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 19);

            // Act
            const collectionNeedsIndexing: boolean = await mock.collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });
    });
});
