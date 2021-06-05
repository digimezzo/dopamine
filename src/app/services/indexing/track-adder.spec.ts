import { IMock, It, Mock, Times } from 'typemoq';
import { FolderTrack } from '../../common/data/entities/folder-track';
import { RemovedTrack } from '../../common/data/entities/removed-track';
import { Track } from '../../common/data/entities/track';
import { BaseFolderTrackRepository } from '../../common/data/repositories/base-folder-track-repository';
import { BaseRemovedTrackRepository } from '../../common/data/repositories/base-removed-track-repository';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { IndexablePath } from './indexable-path';
import { IndexablePathFetcher } from './indexable-path-fetcher';
import { TrackAdder } from './track-adder';
import { TrackFiller } from './track-filler';

describe('TrackAdder', () => {
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let folderTrackRepositoryMock: IMock<BaseFolderTrackRepository>;
    let removedTrackRepositoryMock: IMock<BaseRemovedTrackRepository>;
    let indexablePathFetcherMock: IMock<IndexablePathFetcher>;
    let trackFillerMock: IMock<TrackFiller>;
    let settingsMock: IMock<BaseSettings>;
    let loggerMock: IMock<Logger>;
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let trackAdder: TrackAdder;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        folderTrackRepositoryMock = Mock.ofType<BaseFolderTrackRepository>();
        removedTrackRepositoryMock = Mock.ofType<BaseRemovedTrackRepository>();
        indexablePathFetcherMock = Mock.ofType<IndexablePathFetcher>();
        trackFillerMock = Mock.ofType<TrackFiller>();
        settingsMock = Mock.ofType<BaseSettings>();
        loggerMock = Mock.ofType<Logger>();
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        trackAdder = new TrackAdder(
            trackRepositoryMock.object,
            folderTrackRepositoryMock.object,
            removedTrackRepositoryMock.object,
            indexablePathFetcherMock.object,
            trackFillerMock.object,
            settingsMock.object,
            loggerMock.object,
            snackBarServiceMock.object
        );
    });

    describe('addTracksThatAreNotInTheDatabase', () => {
        it('should add tracks that are not in the database', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);

            removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => []);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock
                .setup((x) => x.getIndexablePathsForAllFoldersAsync())
                .returns(async () => [indexablePath1, indexablePath2, indexablePath3]);

            // Act
            await trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            trackRepositoryMock.verify(
                (x) => x.addTrack(It.isObjectWith<Track>({ path: '/home/user/Music/Track 3.mp3' })),
                Times.exactly(1)
            );
        });

        it('should not add tracks that are already in the database', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1]);

            removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => []);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock
                .setup((x) => x.getIndexablePathsForAllFoldersAsync())
                .returns(async () => [indexablePath1, indexablePath2, indexablePath3]);

            // Act
            await trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.addTrack(It.isObjectWith<Track>({ path: '/home/user/Music/Track 1.mp3' })), Times.never());
        });

        it('should add a folderTrack when adding a track to the database', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => []);
            trackRepositoryMock.setup((x) => x.getTrackByPath('/home/user/Music/Track 1.mp3')).returns(() => track1);
            removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => []);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);

            indexablePathFetcherMock.setup((x) => x.getIndexablePathsForAllFoldersAsync()).returns(async () => [indexablePath1]);

            // Act
            await trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            folderTrackRepositoryMock.verify(
                (x) => x.addFolderTrack(It.isObjectWith<FolderTrack>({ folderId: 1, trackId: track1.trackId })),
                Times.exactly(1)
            );
        });

        it('should add a file metadata when adding a track to the database', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => []);
            trackRepositoryMock.setup((x) => x.getTrackByPath('/home/user/Music/Track 1.mp3')).returns(() => track1);
            removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => []);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);

            indexablePathFetcherMock.setup((x) => x.getIndexablePathsForAllFoldersAsync()).returns(async () => [indexablePath1]);

            // Act
            await trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            trackFillerMock.verify(
                (x) => x.addFileMetadataToTrackAsync(It.isObjectWith<Track>({ path: '/home/user/Music/Track 1.mp3' })),
                Times.exactly(1)
            );
        });

        it('should add tracks that were previously removed, when removed tracks should not be ignored.', async () => {
            // Arrange
            settingsMock.setup((x) => x.skipRemovedFilesDuringRefresh).returns(() => false);

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);

            const removedTrack: RemovedTrack = new RemovedTrack('/home/user/Music/Track 3.mp3');

            removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => [removedTrack]);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock
                .setup((x) => x.getIndexablePathsForAllFoldersAsync())
                .returns(async () => [indexablePath1, indexablePath2, indexablePath3]);

            // Act
            await trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            trackRepositoryMock.verify(
                (x) => x.addTrack(It.isObjectWith<Track>({ path: '/home/user/Music/Track 3.mp3' })),
                Times.exactly(1)
            );
        });

        it('should not add tracks that were previously removed, when removed tracks should be ignored.', async () => {
            // Arrange
            settingsMock.setup((x) => x.skipRemovedFilesDuringRefresh).returns(() => true);

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);

            const removedTrack: RemovedTrack = new RemovedTrack('/home/user/Music/Track 3.mp3');

            removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => [removedTrack]);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock
                .setup((x) => x.getIndexablePathsForAllFoldersAsync())
                .returns(async () => [indexablePath1, indexablePath2, indexablePath3]);

            // Act
            await trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.addTrack(It.isObjectWith<Track>({ path: '/home/user/Music/Track 3.mp3' })), Times.never());
        });
    });
});
