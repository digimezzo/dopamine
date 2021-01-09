import * as assert from 'assert';
import { CollectionCheckerMocker } from './mocking/collection-checker-mocker';

describe('CollectionChecker', () => {
    describe('isCollectionOutdatedAsync', () => {
        it('Should not be outdated when there are no changes', async () => {
            // Arrange
            const mocker: CollectionCheckerMocker = new CollectionCheckerMocker();

            mocker.trackRepositoryMock.setup((x) => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mocker.trackRepositoryMock.setup((x) => x.getNumberOfTracks()).returns(() => 2);
            mocker.trackRepositoryMock.setup((x) => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionIsOutdated: boolean = await mocker.collectionChecker.isCollectionOutdatedAsync();

            // Assert
            assert.ok(!collectionIsOutdated);
        });

        it('Should be outdated if there are database tracks that need indexing', async () => {
            // Arrange
            const mocker: CollectionCheckerMocker = new CollectionCheckerMocker();

            mocker.trackRepositoryMock.setup((x) => x.getNumberOfTracksThatNeedIndexing()).returns(() => 1);
            mocker.trackRepositoryMock.setup((x) => x.getNumberOfTracks()).returns(() => 2);
            mocker.trackRepositoryMock.setup((x) => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionIsOutdated: boolean = await mocker.collectionChecker.isCollectionOutdatedAsync();

            // Assert
            assert.ok(collectionIsOutdated);
        });

        it('Should be outdated if the number of database tracks is larger than the number of files on disk', async () => {
            // Arrange
            const mocker: CollectionCheckerMocker = new CollectionCheckerMocker();

            mocker.trackRepositoryMock.setup((x) => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mocker.trackRepositoryMock.setup((x) => x.getNumberOfTracks()).returns(() => 3);
            mocker.trackRepositoryMock.setup((x) => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await mocker.collectionChecker.isCollectionOutdatedAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });

        it('Should be outdated if the number of database tracks is smaller than the number of files on disk', async () => {
            // Arrange
            const mocker: CollectionCheckerMocker = new CollectionCheckerMocker();

            mocker.trackRepositoryMock.setup((x) => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mocker.trackRepositoryMock.setup((x) => x.getNumberOfTracks()).returns(() => 1);
            mocker.trackRepositoryMock.setup((x) => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionIsOutdated: boolean = await mocker.collectionChecker.isCollectionOutdatedAsync();

            // Assert
            assert.ok(collectionIsOutdated);
        });

        it('Should be outdated if a database track is out of date', async () => {
            // Arrange
            const mocker: CollectionCheckerMocker = new CollectionCheckerMocker();

            mocker.trackRepositoryMock.setup((x) => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            mocker.trackRepositoryMock.setup((x) => x.getNumberOfTracks()).returns(() => 2);
            mocker.trackRepositoryMock.setup((x) => x.getMaximumDateFileModified()).returns(() => 19);

            // Act
            const collectionIsOutdated: boolean = await mocker.collectionChecker.isCollectionOutdatedAsync();

            // Assert
            assert.ok(collectionIsOutdated);
        });
    });
});
