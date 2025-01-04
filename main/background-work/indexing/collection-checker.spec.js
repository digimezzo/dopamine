const { TrackRepositoryMock } = require('../mocks/track-repository-mock');
const { LoggerMock } = require('../mocks/logger-mock');
const { IndexablePath } = require('./indexable-path');
const { IndexablePathFetcherMock } = require('../mocks/indexable-path-fetcher-mock');
const { CollectionChecker } = require('./collection-checker');

describe('CollectionChecker', () => {
    let trackRepositoryMock;
    let indexablePathFetcherMock;
    let loggerMock;

    beforeEach(() => {
        trackRepositoryMock = new TrackRepositoryMock();
        indexablePathFetcherMock = new IndexablePathFetcherMock();
        loggerMock = new LoggerMock();

        const indexablePath1 = new IndexablePath('/home/user/Music/track1.mp3', 10, 1);
        const indexablePath2 = new IndexablePath('/home/user/Music/track2.mp3', 20, 1);

        indexablePathFetcherMock.getIndexablePathsForAllFoldersAsyncReturnValue = [indexablePath1, indexablePath2];
    });

    function createSut() {
        return new CollectionChecker(trackRepositoryMock, indexablePathFetcherMock, loggerMock);
    }

    describe('isCollectionOutdatedAsync', () => {
        it('should not be outdated when there are no changes', async () => {
            // Arrange
            trackRepositoryMock.getNumberOfTracksThatNeedIndexingReturnValue = 0;
            trackRepositoryMock.getNumberOfTracksReturnValue = 2;
            trackRepositoryMock.getMaximumDateFileModifiedReturnValue = 20;

            const sut = createSut();

            // Act
            const collectionIsOutdated = await sut.isCollectionOutdatedAsync();

            // Assert
            expect(collectionIsOutdated).toBeFalsy();
        });

        it('should be outdated if there are database tracks that need indexing', async () => {
            // Arrange
            trackRepositoryMock.getNumberOfTracksThatNeedIndexingReturnValue = 1;
            trackRepositoryMock.getNumberOfTracksReturnValue = 2;
            trackRepositoryMock.getMaximumDateFileModifiedReturnValue = 20;

            const sut = createSut();

            // Act
            const collectionIsOutdated = await sut.isCollectionOutdatedAsync();

            // Assert
            expect(collectionIsOutdated).toBeTruthy();
        });

        it('should be outdated if the number of database tracks is larger than the number of files on disk', async () => {
            // Arrange
            trackRepositoryMock.getNumberOfTracksThatNeedIndexingReturnValue = 0;
            trackRepositoryMock.getNumberOfTracksReturnValue = 3;
            trackRepositoryMock.getMaximumDateFileModifiedReturnValue = 20;

            const sut = createSut();

            // Act
            const collectionNeedsIndexing = await sut.isCollectionOutdatedAsync();

            // Assert
            expect(collectionNeedsIndexing).toBeTruthy();
        });

        it('should be outdated if the number of database tracks is smaller than the number of files on disk', async () => {
            // Arrange
            trackRepositoryMock.getNumberOfTracksThatNeedIndexingReturnValue = 0;
            trackRepositoryMock.getNumberOfTracksReturnValue = 3;
            trackRepositoryMock.getMaximumDateFileModifiedReturnValue = 20;

            const sut = createSut();

            // Act
            const collectionIsOutdated = await sut.isCollectionOutdatedAsync();

            // Assert
            expect(collectionIsOutdated).toBeTruthy();
        });

        it('should be outdated if a database track is out of date', async () => {
            // Arrange
            trackRepositoryMock.getNumberOfTracksThatNeedIndexingReturnValue = 0;
            trackRepositoryMock.getNumberOfTracksReturnValue = 2;
            trackRepositoryMock.getMaximumDateFileModifiedReturnValue = 19;

            const sut = createSut();

            // Act
            const collectionIsOutdated = await sut.isCollectionOutdatedAsync();

            // Assert
            expect(collectionIsOutdated).toBeTruthy();
        });
    });
});
