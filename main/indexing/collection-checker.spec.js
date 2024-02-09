const { TrackRepositoryMock } = require("../mocks/track-repository-mock");
const { LoggerMock } = require("../mocks/logger-mock");
const { IndexablePath } = require("./indexable-path");
const { IndexablePathFetcherMock } = require("../mocks/indexable-path-fetcher-mock");

describe('CollectionChecker', () => {
    let indexablePathFetcherMock;
    let trackRepositoryMock;
    let loggerMock;
    let collectionChecker;

    beforeEach(() => {
        indexablePathFetcherMock = new IndexablePathFetcherMock();
        trackRepositoryMock = new TrackRepositoryMock();
        loggerMock = new LoggerMock();

        const indexablePath1 = new IndexablePath('/home/user/Music/track1.mp3', 10, 1);
        const indexablePath2 = new IndexablePath('/home/user/Music/track2.mp3', 20, 1);

        indexablePathFetcherMock
            .setup((x) => x.getIndexablePathsForAllFoldersAsync())
            .returns(() => Promise.resolve([indexablePath1, indexablePath2]));

        collectionChecker = new CollectionChecker(indexablePathFetcherMock.object, trackRepositoryMock.object, loggerMock.object);
    });

    describe('isCollectionOutdatedAsync', () => {
        it('should not be outdated when there are no changes', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            trackRepositoryMock.setup((x) => x.getNumberOfTracks()).returns(() => 2);
            trackRepositoryMock.setup((x) => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionIsOutdated: boolean = await collectionChecker.isCollectionOutdatedAsync();

            // Assert
            expect(collectionIsOutdated).toBeFalsy();
        });

        it('should be outdated if there are database tracks that need indexing', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getNumberOfTracksThatNeedIndexing()).returns(() => 1);
            trackRepositoryMock.setup((x) => x.getNumberOfTracks()).returns(() => 2);
            trackRepositoryMock.setup((x) => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionIsOutdated: boolean = await collectionChecker.isCollectionOutdatedAsync();

            // Assert
            expect(collectionIsOutdated).toBeTruthy();
        });

        it('should be outdated if the number of database tracks is larger than the number of files on disk', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            trackRepositoryMock.setup((x) => x.getNumberOfTracks()).returns(() => 3);
            trackRepositoryMock.setup((x) => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await collectionChecker.isCollectionOutdatedAsync();

            // Assert
            expect(collectionNeedsIndexing).toBeTruthy();
        });

        it('should be outdated if the number of database tracks is smaller than the number of files on disk', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            trackRepositoryMock.setup((x) => x.getNumberOfTracks()).returns(() => 1);
            trackRepositoryMock.setup((x) => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionIsOutdated: boolean = await collectionChecker.isCollectionOutdatedAsync();

            // Assert
            expect(collectionIsOutdated).toBeTruthy();
        });

        it('should be outdated if a database track is out of date', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            trackRepositoryMock.setup((x) => x.getNumberOfTracks()).returns(() => 2);
            trackRepositoryMock.setup((x) => x.getMaximumDateFileModified()).returns(() => 19);

            // Act
            const collectionIsOutdated: boolean = await collectionChecker.isCollectionOutdatedAsync();

            // Assert
            expect(collectionIsOutdated).toBeTruthy();
        });
    });
});
