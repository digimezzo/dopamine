import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { CollectionChecker } from '../app/services/indexing/collection-checker';
import { IndexablePathFetcher } from '../app/services/indexing/indexable-path-fetcher';
import { BaseTrackRepository } from '../app/data/repositories/base-track-repository';
import { Logger } from '../app/core/logger';
import { IndexablePath } from '../app/services/indexing/indexable-path';

describe('CollectionChecker', () => {
    describe('collectionNeedsIndexingAsync', () => {
        it('Should not require indexing when there are no changes', async () => {
            // Arrange
            const indexablePathFetcherMock: IMock<IndexablePathFetcher> = Mock.ofType<IndexablePathFetcher>();
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const collectionChecker: CollectionChecker = new CollectionChecker(
                indexablePathFetcherMock.object,
                trackRepositoryMock.object,
                loggerMock.object
            );

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/track1.mp3', 10, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/track2.mp3', 20, 1);

            trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            indexablePathFetcherMock.setup(x => x.getIndexablePathsForAllFoldersAsync())
            .returns(async () => [indexablePath1, indexablePath2]);
            trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 2);
            trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(!collectionNeedsIndexing);
        });

        it('Should require indexing if there are database tracks that need indexing', async () => {
            // Arrange
            const indexablePathFetcherMock: IMock<IndexablePathFetcher> = Mock.ofType<IndexablePathFetcher>();
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const collectionChecker: CollectionChecker = new CollectionChecker(
                indexablePathFetcherMock.object,
                trackRepositoryMock.object,
                loggerMock.object
            );

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/track1.mp3', 10, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/track2.mp3', 20, 1);

            trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 1);
            indexablePathFetcherMock.setup(x => x.getIndexablePathsForAllFoldersAsync())
            .returns(async () => [indexablePath1, indexablePath2]);
            trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 2);
            trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });

        it('Should require indexing if the number of database tracks is larger than the number of files on disk', async () => {
            // Arrange
            const indexablePathFetcherMock: IMock<IndexablePathFetcher> = Mock.ofType<IndexablePathFetcher>();
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const collectionChecker: CollectionChecker = new CollectionChecker(
                indexablePathFetcherMock.object,
                trackRepositoryMock.object,
                loggerMock.object
            );

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/track1.mp3', 10, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/track2.mp3', 20, 1);

            trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            indexablePathFetcherMock.setup(x => x.getIndexablePathsForAllFoldersAsync())
            .returns(async () => [indexablePath1, indexablePath2]);
            trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 3);
            trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });

        it('Should require indexing if the number of database tracks is smaller than the number of files on disk', async () => {
            // Arrange
            const indexablePathFetcherMock: IMock<IndexablePathFetcher> = Mock.ofType<IndexablePathFetcher>();
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const collectionChecker: CollectionChecker = new CollectionChecker(
                indexablePathFetcherMock.object,
                trackRepositoryMock.object,
                loggerMock.object
            );

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/track1.mp3', 10, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/track2.mp3', 20, 1);

            trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            indexablePathFetcherMock.setup(x => x.getIndexablePathsForAllFoldersAsync())
            .returns(async () => [indexablePath1, indexablePath2]);
            trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 1);
            trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 20);

            // Act
            const collectionNeedsIndexing: boolean = await collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });

        it('Should require indexing if a database track is out of date', async () => {
            // Arrange
            const indexablePathFetcherMock: IMock<IndexablePathFetcher> = Mock.ofType<IndexablePathFetcher>();
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const collectionChecker: CollectionChecker = new CollectionChecker(
                indexablePathFetcherMock.object,
                trackRepositoryMock.object,
                loggerMock.object
            );

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/track1.mp3', 10, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/track2.mp3', 20, 1);

            trackRepositoryMock.setup(x => x.getNumberOfTracksThatNeedIndexing()).returns(() => 0);
            indexablePathFetcherMock.setup(x => x.getIndexablePathsForAllFoldersAsync())
            .returns(async () => [indexablePath1, indexablePath2]);
            trackRepositoryMock.setup(x => x.getNumberOfTracks()).returns(() => 2);
            trackRepositoryMock.setup(x => x.getMaximumDateFileModified()).returns(() => 19);

            // Act
            const collectionNeedsIndexing: boolean = await collectionChecker.collectionNeedsIndexingAsync();

            // Assert
            assert.ok(collectionNeedsIndexing);
        });
    });
});
