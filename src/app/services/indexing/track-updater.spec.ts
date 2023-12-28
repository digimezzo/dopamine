import { IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../../common/logger';
import { TrackUpdater } from './track-updater';
import { TrackVerifier } from './track-verifier';
import { TrackRepository } from '../../data/repositories/track-repository';
import { SnackBarServiceBase } from '../snack-bar/snack-bar.service.base';
import { MetadataAdder } from './metadata-adder';
import { Track } from '../../data/entities/track';
import { MockCreator } from '../../testing/mock-creator';
import { IndexableTrack } from './indexable-track';

describe('TrackUpdater', () => {
    let trackRepositoryMock: IMock<TrackRepository>;
    let metadataAdderMock: IMock<MetadataAdder>;
    let trackVerifierMock: IMock<TrackVerifier>;
    let snackBarServiceMock: IMock<SnackBarServiceBase>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<TrackRepository>();
        metadataAdderMock = Mock.ofType<MetadataAdder>();
        trackVerifierMock = Mock.ofType<TrackVerifier>();
        snackBarServiceMock = Mock.ofType<SnackBarServiceBase>();
        loggerMock = Mock.ofType<Logger>();
    });

    function createSut(batchSize: number): TrackUpdater {
        const sut: TrackUpdater = new TrackUpdater(
            trackRepositoryMock.object,
            metadataAdderMock.object,
            trackVerifierMock.object,
            snackBarServiceMock.object,
            loggerMock.object,
        );
        sut.batchSize = batchSize;

        return sut;
    }

    describe('updateTracksThatAreOutOfDateAsync', () => {
        it('should get all tracks from the database', async () => {
            // Arrange
            const sut: TrackUpdater = createSut(2);

            // Arrange, Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.getAllTracks(), Times.once());
        });

        it('should not check if tracks are out of date if there are no tracks in the database', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => []);
            const sut: TrackUpdater = createSut(2);

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackVerifierMock.verify((x) => x.isTrackOutOfDate(It.isAny()), Times.never());
        });

        it('should not check if tracks need indexing if there are no tracks in the database', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => []);
            const sut: TrackUpdater = createSut(2);

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackVerifierMock.verify((x) => x.doesTrackNeedIndexing(It.isAny()), Times.never());
        });

        it('should check all tracks in the database if they need indexing', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);
            const t3: Track = MockCreator.createTrack('/home/user/Music/Track 3.mp3', 3);

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [t1, t2, t3]);
            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(It.isAny())).returns(() => true);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(It.isAny())).returns(() => true);

            const it1 = MockCreator.createIndexableTrack('/home/user/Music/Track 1.mp3', 1, 1);
            const it2 = MockCreator.createIndexableTrack('/home/user/Music/Track 2.mp3', 2, 2);
            const it3 = MockCreator.createIndexableTrack('/home/user/Music/Track 3.mp3', 3, 3);

            metadataAdderMock.setup((x) => x.addMetadataToTracksAsync([t1, t2], false)).returns(() => Promise.resolve([it1, it2]));
            metadataAdderMock.setup((x) => x.addMetadataToTracksAsync([t3], false)).returns(() => Promise.resolve([it3]));

            const sut: TrackUpdater = createSut(2);

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackVerifierMock.verify((x) => x.doesTrackNeedIndexing(t1), Times.once());
            trackVerifierMock.verify((x) => x.doesTrackNeedIndexing(t2), Times.once());
            trackVerifierMock.verify((x) => x.doesTrackNeedIndexing(t3), Times.once());
        });

        it('should not that check database track are out of date when they need indexing', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [t1, t2]);
            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(It.isAny())).returns(() => true);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(It.isAny())).returns(() => true);

            const sut: TrackUpdater = createSut(2);

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackVerifierMock.verify((x) => x.isTrackOutOfDate(t1), Times.never());
            trackVerifierMock.verify((x) => x.isTrackOutOfDate(t2), Times.never());
        });

        it('should check that database tracks are out of date when they no not need indexing', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [t1, t2]);
            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(It.isAny())).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(It.isAny())).returns(() => true);

            const sut: TrackUpdater = createSut(2);

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackVerifierMock.verify((x) => x.isTrackOutOfDate(t1), Times.once());
            trackVerifierMock.verify((x) => x.isTrackOutOfDate(t2), Times.once());
        });

        it('should add metadata to a track if it needs indexing or is out of date', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [t1, t2]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(t1)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(t1)).returns(() => true);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(t2)).returns(() => true);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(t2)).returns(() => false);

            const sut: TrackUpdater = createSut(2);

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            metadataAdderMock.verify((x) => x.addMetadataToTracksAsync([t1, t2], false), Times.once());
        });

        it('should not add metadata to a track if it does not needs indexing and is not out of date', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [t1, t2]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(t1)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(t1)).returns(() => false);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(t2)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(t2)).returns(() => false);

            const sut: TrackUpdater = createSut(2);

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            metadataAdderMock.verify((x) => x.addMetadataToTracksAsync([t1, t2], false), Times.never());
        });

        it('should notify only once that tracks are being updated when tracks need indexing or out of date', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [t1, t2]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(t1)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(t1)).returns(() => true);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(t2)).returns(() => true);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(t2)).returns(() => false);

            const it1: IndexableTrack = MockCreator.createIndexableTrack('/home/user/Music/Track 1.mp3', 1, 1);
            const it2: IndexableTrack = MockCreator.createIndexableTrack('/home/user/Music/Track 2.mp3', 2, 2);

            metadataAdderMock.setup((x) => x.addMetadataToTracksAsync([t1, t2], false)).returns(() => Promise.resolve([it1, it2]));

            const sut: TrackUpdater = createSut(2);

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingTracksAsync(), Times.once());
        });

        it('should not notify that tracks are being updated when tracks do not need indexing and are not out of date', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [t1, t2]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(t1)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(t1)).returns(() => false);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(t2)).returns(() => false);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(t2)).returns(() => false);

            const it1: IndexableTrack = MockCreator.createIndexableTrack('/home/user/Music/Track 1.mp3', 1, 1);
            const it2: IndexableTrack = MockCreator.createIndexableTrack('/home/user/Music/Track 2.mp3', 2, 2);

            metadataAdderMock.setup((x) => x.addMetadataToTracksAsync([t1, t2], false)).returns(() => Promise.resolve([it1, it2]));

            const sut: TrackUpdater = createSut(2);

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingTracksAsync(), Times.never());
        });

        it('should update tracks in batches', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);
            const t3: Track = MockCreator.createTrack('/home/user/Music/Track 3.mp3', 3);

            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [t1, t2, t3]);

            trackVerifierMock.setup((x) => x.doesTrackNeedIndexing(It.isAny())).returns(() => true);
            trackVerifierMock.setup((x) => x.isTrackOutOfDate(It.isAny())).returns(() => true);

            const it1 = MockCreator.createIndexableTrack('/home/user/Music/Track 1.mp3', 1, 1);
            const it2 = MockCreator.createIndexableTrack('/home/user/Music/Track 2.mp3', 2, 2);
            const it3 = MockCreator.createIndexableTrack('/home/user/Music/Track 3.mp3', 3, 3);

            metadataAdderMock.setup((x) => x.addMetadataToTracksAsync([t1, t2], false)).returns(() => Promise.resolve([it1, it2]));
            metadataAdderMock.setup((x) => x.addMetadataToTracksAsync([t3], false)).returns(() => Promise.resolve([it3]));

            const sut: TrackUpdater = createSut(2);

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            metadataAdderMock.verify((x) => x.addMetadataToTracksAsync([t1, t2], false), Times.once());
            metadataAdderMock.verify((x) => x.addMetadataToTracksAsync([t3], false), Times.once());
        });
    });
});
