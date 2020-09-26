import { Times } from 'typemoq';
import { Track } from '../app/data/entities/track';
import { TrackRemoverMocker } from './mocking/track-remover-mocker';

describe('Trackremover', () => {
    describe('removeTracksThatDoNoNotBelongToFolders', () => {
        it('Should remove tracks which are not part of a collection folder', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => []);

            // Act
            mocker.trackRemover.removeTracksThatDoNoNotBelongToFolders();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.deleteTracksThatDoNotBelongFolders(), Times.exactly(1));
        });

    });

    describe('removeTracksThatAreNotFoundOnDisk', () => {
        it('Should remove tracks which are not found on disk', async () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.pathExists(track1.path)).returns(() => true);
            mocker.fileSystemMock.setup(x => x.pathExists(track2.path)).returns(() => false);

            // Act
            mocker.trackRemover.removeTracksThatAreNotFoundOnDisk();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.deleteTrack(track2.trackId), Times.exactly(1));
        });

        it('Should not remove tracks which are found on disk', async () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.pathExists(track1.path)).returns(() => true);
            mocker.fileSystemMock.setup(x => x.pathExists(track2.path)).returns(() => false);

            // Act
            mocker.trackRemover.removeTracksThatAreNotFoundOnDisk();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.deleteTrack(track1.trackId), Times.never());
        });
    });
});
