import * as assert from 'assert';
import { CollectionCheckerMocker } from './mocking/collection-checker-mocker';

describe('CollectionChecker', () => {
    describe('collectionNeedsIndexingAsync', () => {
        it('Should not require indexing when there are no changes', async () => {
            // Arrange
            const mocker: CollectionCheckerMocker = new CollectionCheckerMocker();

            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 2);
            mocker.trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await mocker.collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(!collectionNeedsIndexing);
        });

        it('Should require indexing if there are database tracks that need indexing', async () => {
            // Arrange
            const mocker: CollectionCheckerMocker = new CollectionCheckerMocker();

            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 1);
            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 2);
            mocker.trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await mocker.collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });

        it('Should require indexing if the number of database tracks is larger than the number of files on disk', async () => {
            // Arrange
            const mocker: CollectionCheckerMocker = new CollectionCheckerMocker();

            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 3);
            mocker.trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await mocker.collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });

        it('Should require indexing if the number of database tracks is smaller than the number of files on disk', async () => {
            // Arrange
            const mocker: CollectionCheckerMocker = new CollectionCheckerMocker();

            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 1);
            mocker.trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await mocker.collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });

        it('Should require indexing if a database track is out of date', async () => {
            // Arrange
            const mocker: CollectionCheckerMocker = new CollectionCheckerMocker();

            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 2);
            mocker.trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 19);

            // Act
            const collectionNeedsIndexing: boolean = await mocker.collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });
    });
});
