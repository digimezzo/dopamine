import { It, Times } from 'typemoq';
import { Track } from '../app/data/entities/track';
import { TrackUpdaterMocker } from './mocking/track-updater-mocker';

describe('TrackUpdater', () => {
    describe('updateTracksThatAreOutOfDateAsync', () => {
        it('should get all tracks from the database', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            // Act
            mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify((x) => x.getTracks(), Times.exactly(1));
        });

        it('should not check if tracks are out of date if there are no tracks in the database', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();
            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => []);

            // Act
            mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackVerifierMock.verify((x) => x.isTrackOutOfDateAsync(It.isAny()), Times.never());
        });

        it('should not check if tracks need indexing if there are no tracks in the database', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();
            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => []);

            // Act
            mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackVerifierMock.verify((x) => x.doesTrackNeedIndexing(It.isAny()), Times.never());
        });

        it('should check all tracks in the database if they need indexing', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);
            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(It.isAny())).returns(() => true);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(It.isAny())).returns(async () => true);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackVerifierMock.verify((x) => x.doesTrackNeedIndexing(track1), Times.exactly(1));
            mocker.trackVerifierMock.verify((x) => x.doesTrackNeedIndexing(track2), Times.exactly(1));
        });

        it('should not check any tracks in the database if they are out of date, when they need indexing.', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);
            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(It.isAny())).returns(() => true);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(It.isAny())).returns(async () => true);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackVerifierMock.verify((x) => x.isTrackOutOfDateAsync(track1), Times.never());
            mocker.trackVerifierMock.verify((x) => x.isTrackOutOfDateAsync(track2), Times.never());
        });

        it('should check all tracks in the database if they are out of date, when they no not need indexing.', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);
            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(It.isAny())).returns(() => false);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(It.isAny())).returns(async () => true);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackVerifierMock.verify((x) => x.isTrackOutOfDateAsync(track1), Times.exactly(1));
            mocker.trackVerifierMock.verify((x) => x.isTrackOutOfDateAsync(track2), Times.exactly(1));
        });

        it('should add metadata to a track if it needs indexing or is out of date', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track1)).returns(async () => true);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => true);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track2)).returns(async () => false);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackFillerMock.verify((x) => x.addFileMetadataToTrackAsync(track1), Times.exactly(1));
            mocker.trackFillerMock.verify((x) => x.addFileMetadataToTrackAsync(track2), Times.exactly(1));
        });

        it('should not add metadata to a track if it does not needs indexing and is not out of date', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track1)).returns(async () => false);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => false);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track2)).returns(async () => false);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackFillerMock.verify((x) => x.addFileMetadataToTrackAsync(track1), Times.never());
            mocker.trackFillerMock.verify((x) => x.addFileMetadataToTrackAsync(track2), Times.never());
        });

        it('should update a track in the database using a track that has metadata filled in, if it needs indexing or is out of date.', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track1)).returns(async () => true);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => true);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track2)).returns(async () => false);

            const filledTrack1: Track = new Track('/home/user/Music/Track 1.mp3');
            const filledTrack2: Track = new Track('/home/user/Music/Track 2.mp3');
            filledTrack1.trackTitle = 'Title 1';
            filledTrack2.trackTitle = 'Title 2';

            mocker.trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track1)).returns(async () => filledTrack1);
            mocker.trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track2)).returns(async () => filledTrack2);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify((x) => x.updateTrack(filledTrack1), Times.exactly(1));
            mocker.trackRepositoryMock.verify((x) => x.updateTrack(filledTrack2), Times.exactly(1));
            mocker.trackRepositoryMock.verify((x) => x.updateTrack(track1), Times.never());
            mocker.trackRepositoryMock.verify((x) => x.updateTrack(track2), Times.never());
        });

        it('should not update a track in the database if it does not need indexing and is not out of date.', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track1)).returns(async () => false);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => false);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track2)).returns(async () => false);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify((x) => x.updateTrack(It.isAny()), Times.never());
        });

        it('should notify only once that tracks are being updated, if tracks need indexing or out of date.', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track1)).returns(async () => true);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => true);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track2)).returns(async () => false);

            const filledTrack1: Track = new Track('/home/user/Music/Track 1.mp3');
            const filledTrack2: Track = new Track('/home/user/Music/Track 2.mp3');
            filledTrack1.trackTitle = 'Title 1';
            filledTrack2.trackTitle = 'Title 2';

            mocker.trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track1)).returns(async () => filledTrack1);
            mocker.trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track2)).returns(async () => filledTrack2);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.snackBarServiceMock.verify((x) => x.updatingTracksAsync(), Times.exactly(1));
        });

        it('should not notify that tracks are being updated, if tracks do not need indexing and are not out of date.', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getTracks()).returns(() => [track1, track2]);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track1)).returns(async () => false);

            mocker.trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => false);
            mocker.trackVerifierMock.setup((x) => x.isTrackOutOfDateAsync(track2)).returns(async () => false);

            const filledTrack1: Track = new Track('/home/user/Music/Track 1.mp3');
            const filledTrack2: Track = new Track('/home/user/Music/Track 2.mp3');
            filledTrack1.trackTitle = 'Title 1';
            filledTrack2.trackTitle = 'Title 2';

            mocker.trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track1)).returns(async () => filledTrack1);
            mocker.trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track2)).returns(async () => filledTrack2);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.snackBarServiceMock.verify((x) => x.updatingTracksAsync(), Times.never());
        });
    });
});
