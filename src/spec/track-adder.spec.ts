import { It, Times } from 'typemoq';
import { FolderTrack } from '../app/data/entities/folder-track';
import { RemovedTrack } from '../app/data/entities/removed-track';
import { Track } from '../app/data/entities/track';
import { IndexablePath } from '../app/services/indexing/indexable-path';
import { TrackAdderMocker } from './mocking/track-adder-mocker';

describe('TrackAdder', () => {
    describe('addTracksThatAreNotInTheDatabase', () => {
        it('should add tracks that are not in the database', async () => {
            // Arrange
            const mocker: TrackAdderMocker = new TrackAdderMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);

            mocker.removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => []);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            mocker.indexablePathFetcherMock
                .setup((x) => x.getIndexablePathsForAllFoldersAsync())
                .returns(async () => [indexablePath1, indexablePath2, indexablePath3]);

            // Act
            await mocker.trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            mocker.trackRepositoryMock.verify(
                (x) =>
                    x.addTrack(
                        It.isObjectWith<Track>({ path: '/home/user/Music/Track 3.mp3' })
                    ),
                Times.exactly(1)
            );
        });

        it('should not add tracks that are already in the database', async () => {
            // Arrange
            const mocker: TrackAdderMocker = new TrackAdderMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1]);

            mocker.removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => []);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            mocker.indexablePathFetcherMock
                .setup((x) => x.getIndexablePathsForAllFoldersAsync())
                .returns(async () => [indexablePath1, indexablePath2, indexablePath3]);

            // Act
            await mocker.trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            mocker.trackRepositoryMock.verify(
                (x) =>
                    x.addTrack(
                        It.isObjectWith<Track>({ path: '/home/user/Music/Track 1.mp3' })
                    ),
                Times.never()
            );
        });

        it('should add a folderTrack when adding a track to the database', async () => {
            // Arrange
            const mocker: TrackAdderMocker = new TrackAdderMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => []);
            mocker.trackRepositoryMock.setup((x) => x.getTrackByPath('/home/user/Music/Track 1.mp3')).returns(() => track1);
            mocker.removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => []);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);

            mocker.indexablePathFetcherMock.setup((x) => x.getIndexablePathsForAllFoldersAsync()).returns(async () => [indexablePath1]);

            // Act
            await mocker.trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            mocker.folderTrackRepositoryMock.verify(
                (x) =>
                    x.addFolderTrack(
                        It.isObjectWith<FolderTrack>({ folderId: 1, trackId: track1.trackId })
                    ),
                Times.exactly(1)
            );
        });

        it('should add a file metadata when adding a track to the database', async () => {
            // Arrange
            const mocker: TrackAdderMocker = new TrackAdderMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => []);
            mocker.trackRepositoryMock.setup((x) => x.getTrackByPath('/home/user/Music/Track 1.mp3')).returns(() => track1);
            mocker.removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => []);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);

            mocker.indexablePathFetcherMock.setup((x) => x.getIndexablePathsForAllFoldersAsync()).returns(async () => [indexablePath1]);

            // Act
            await mocker.trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            mocker.trackFillerMock.verify(
                (x) =>
                    x.addFileMetadataToTrackAsync(
                        It.isObjectWith<Track>({ path: '/home/user/Music/Track 1.mp3' })
                    ),
                Times.exactly(1)
            );
        });

        it('should add tracks that were previously removed, when removed tracks should not be ignored.', async () => {
            // Arrange
            const mocker: TrackAdderMocker = new TrackAdderMocker();

            mocker.settingsMock.setup((x) => x.skipRemovedFilesDuringRefresh).returns(() => false);

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);

            const removedTrack: RemovedTrack = new RemovedTrack('/home/user/Music/Track 3.mp3');

            mocker.removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => [removedTrack]);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            mocker.indexablePathFetcherMock
                .setup((x) => x.getIndexablePathsForAllFoldersAsync())
                .returns(async () => [indexablePath1, indexablePath2, indexablePath3]);

            // Act
            await mocker.trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            mocker.trackRepositoryMock.verify(
                (x) =>
                    x.addTrack(
                        It.isObjectWith<Track>({ path: '/home/user/Music/Track 3.mp3' })
                    ),
                Times.exactly(1)
            );
        });

        it('should not add tracks that were previously removed, when removed tracks should be ignored.', async () => {
            // Arrange
            const mocker: TrackAdderMocker = new TrackAdderMocker();

            mocker.settingsMock.setup((x) => x.skipRemovedFilesDuringRefresh).returns(() => true);

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);

            const removedTrack: RemovedTrack = new RemovedTrack('/home/user/Music/Track 3.mp3');

            mocker.removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => [removedTrack]);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            mocker.indexablePathFetcherMock
                .setup((x) => x.getIndexablePathsForAllFoldersAsync())
                .returns(async () => [indexablePath1, indexablePath2, indexablePath3]);

            // Act
            await mocker.trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            mocker.trackRepositoryMock.verify(
                (x) =>
                    x.addTrack(
                        It.isObjectWith<Track>({ path: '/home/user/Music/Track 3.mp3' })
                    ),
                Times.never()
            );
        });
    });
});
