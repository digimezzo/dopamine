import { IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../../common/logger';
import { TrackFiller } from './track-filler';
import { TrackUpdater } from './track-updater';
import { TrackVerifier } from './track-verifier';
import { TrackRepository } from '../../data/repositories/track-repository';
import { Track } from '../../data/entities/track';
import { NotificationServiceBase } from '../notification/notification.service.base';

describe('TrackUpdater', () => {
    let trackRepositoryMock: IMock<TrackRepository>;
    let trackFillerMock: IMock<TrackFiller>;
    let trackVerifierMock: IMock<TrackVerifier>;
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let loggerMock: IMock<Logger>;
    let trackUpdater: TrackUpdater;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<TrackRepository>();
        trackFillerMock = Mock.ofType<TrackFiller>();
        trackVerifierMock = Mock.ofType<TrackVerifier>();
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        loggerMock = Mock.ofType<Logger>();
        trackUpdater = new TrackUpdater(
            trackRepositoryMock.object,
            trackFillerMock.object,
            trackVerifierMock.object,
            notificationServiceMock.object,
            loggerMock.object,
        );
    });

    describe('updateTracksThatAreOutOfDateAsync', () => {
        it('should get all tracks from the database', async () => {
            // Arrange

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.getAllTracks(), Times.exactly(1));
        });

        it('should not check if tracks are out of date if there are no tracks in the database', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => []);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackVerifierMock.verify((x) => x.isTrackOutOfDate(It.isAny()), Times.never());
        });

        it('should not check if tracks need indexing if there are no tracks in the database', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => []);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackVerifierMock.verify((x) => x.doesTrackNeedIndexing(It.isAny()), Times.never());
        });

        it('should check all tracks in the database if they need indexing', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);
            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(It.isAny())).returns(() => true);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(It.isAny())).returns(() => true);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackVerifierMock.verify((x) => x.doesTrackNeedIndexing(track1), Times.exactly(1));
            trackVerifierMock.verify((x) => x.doesTrackNeedIndexing(track2), Times.exactly(1));
        });

        it('should not check any tracks in the database if they are out of date, when they need indexing.', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);
            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(It.isAny())).returns(() => true);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(It.isAny())).returns(() => true);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackVerifierMock.verify((x) => x.isTrackOutOfDate(track1), Times.never());
            trackVerifierMock.verify((x) => x.isTrackOutOfDate(track2), Times.never());
        });

        it('should check all tracks in the database if they are out of date, when they no not need indexing.', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);
            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(It.isAny())).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(It.isAny())).returns(() => true);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackVerifierMock.verify((x) => x.isTrackOutOfDate(track1), Times.exactly(1));
            trackVerifierMock.verify((x) => x.isTrackOutOfDate(track2), Times.exactly(1));
        });

        it('should add metadata to a track if it needs indexing or is out of date', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track1)).returns(() => true);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => true);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track2)).returns(() => false);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackFillerMock.verify((x) => x.addFileMetadataToTrackAsync(track1, false), Times.exactly(1));
            trackFillerMock.verify((x) => x.addFileMetadataToTrackAsync(track2, false), Times.exactly(1));
        });

        it('should not add metadata to a track if it does not needs indexing and is not out of date', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track1)).returns(() => false);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track2)).returns(() => false);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackFillerMock.verify((x) => x.addFileMetadataToTrackAsync(track1, false), Times.never());
            trackFillerMock.verify((x) => x.addFileMetadataToTrackAsync(track2, false), Times.never());
        });

        it('should update a track in the database using a track that has metadata filled in, if it needs indexing or is out of date.', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track1)).returns(() => true);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => true);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track2)).returns(() => false);

            const filledTrack1: Track = new Track('/home/user/Music/Track 1.mp3');
            const filledTrack2: Track = new Track('/home/user/Music/Track 2.mp3');
            filledTrack1.trackTitle = 'Title 1';
            filledTrack2.trackTitle = 'Title 2';

            trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track1, false)).returns(() => Promise.resolve(filledTrack1));
            trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track2, false)).returns(() => Promise.resolve(filledTrack2));

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.updateTrack(filledTrack1), Times.exactly(1));
            trackRepositoryMock.verify((x) => x.updateTrack(filledTrack2), Times.exactly(1));
            trackRepositoryMock.verify((x) => x.updateTrack(track1), Times.never());
            trackRepositoryMock.verify((x) => x.updateTrack(track2), Times.never());
        });

        it('should not update a track in the database if it does not need indexing and is not out of date.', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track1)).returns(() => false);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track2)).returns(() => false);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.updateTrack(It.isAny()), Times.never());
        });

        it('should notify only once that tracks are being updated, if tracks need indexing or out of date.', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track1)).returns(() => true);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => true);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track2)).returns(() => false);

            const filledTrack1: Track = new Track('/home/user/Music/Track 1.mp3');
            const filledTrack2: Track = new Track('/home/user/Music/Track 2.mp3');
            filledTrack1.trackTitle = 'Title 1';
            filledTrack2.trackTitle = 'Title 2';

            trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track1, false)).returns(() => Promise.resolve(filledTrack1));
            trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track2, false)).returns(() => Promise.resolve(filledTrack2));

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingTracksAsync(), Times.exactly(1));
        });

        it('should not notify that tracks are being updated, if tracks do not need indexing and are not out of date.', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track1)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track1)).returns(() => false);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(track2)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(track2)).returns(() => false);

            const filledTrack1: Track = new Track('/home/user/Music/Track 1.mp3');
            const filledTrack2: Track = new Track('/home/user/Music/Track 2.mp3');
            filledTrack1.trackTitle = 'Title 1';
            filledTrack2.trackTitle = 'Title 2';

            trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track1, false)).returns(() => Promise.resolve(filledTrack1));
            trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track2, false)).returns(() => Promise.resolve(filledTrack2));

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingTracksAsync(), Times.never());
        });
    });
});
