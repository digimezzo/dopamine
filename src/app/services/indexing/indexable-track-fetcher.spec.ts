import { IMock, Mock } from 'typemoq';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { RemovedTrackRepositoryBase } from '../../data/repositories/removed-track-repository.base';
import { IndexablePathFetcher } from './indexable-path-fetcher';
import { IndexableTrackFetcher } from './indexable-track-fetcher';
import { Track } from '../../data/entities/track';
import { MockCreator } from '../../testing/mock-creator';
import { IndexableTrack } from './indexable-track';
import { IndexablePath } from './indexable-path';
import { RemovedTrack } from '../../data/entities/removed-track';

describe('IndexableTrackFetcher', () => {
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let removedTrackRepositoryMock: IMock<RemovedTrackRepositoryBase>;
    let indexablePathFetcherMock: IMock<IndexablePathFetcher>;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        removedTrackRepositoryMock = Mock.ofType<RemovedTrackRepositoryBase>();
        indexablePathFetcherMock = Mock.ofType<IndexablePathFetcher>();
    });

    function createSut(): IndexableTrackFetcher {
        return new IndexableTrackFetcher(trackRepositoryMock.object, removedTrackRepositoryMock.object, indexablePathFetcherMock.object);
    }

    describe('getIndexableTracksAsync', () => {
        it('should get tracks that are not in the database', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);

            trackRepositoryMock.setup((x: TrackRepositoryBase) => x.getAllTracks()).returns(() => [t1, t2]);
            removedTrackRepositoryMock.setup((x: RemovedTrackRepositoryBase) => x.getRemovedTracks()).returns(() => []);

            const ip1: IndexablePath = MockCreator.createIndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const ip2: IndexablePath = MockCreator.createIndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const ip3: IndexablePath = MockCreator.createIndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock.setup((x) => x.getIndexablePathsForAllFoldersAsync()).returns(() => Promise.resolve([ip1, ip2, ip3]));

            const sut: IndexableTrackFetcher = createSut();

            // Act
            const indexableTracks: IndexableTrack[] = await sut.getIndexableTracksAsync(false);

            // Assert
            expect(indexableTracks.length).toBe(1);
            expect(indexableTracks[0].path).toBe('/home/user/Music/Track 3.mp3');
        });

        it('should get tracks that were previously removed, when removed tracks should not be skipped.', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);

            trackRepositoryMock.setup((x: TrackRepositoryBase) => x.getAllTracks()).returns(() => [t1, t2]);

            const rt: RemovedTrack = MockCreator.createRemovedTrack('/home/user/Music/Track 3.mp3');
            removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => [rt]);

            const ip1: IndexablePath = MockCreator.createIndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const ip2: IndexablePath = MockCreator.createIndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const ip3: IndexablePath = MockCreator.createIndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock.setup((x) => x.getIndexablePathsForAllFoldersAsync()).returns(() => Promise.resolve([ip1, ip2, ip3]));

            const sut: IndexableTrackFetcher = createSut();

            // Act
            const indexableTracks: IndexableTrack[] = await sut.getIndexableTracksAsync(false);

            // Assert
            expect(indexableTracks.length).toBe(1);
            expect(indexableTracks[0].path).toBe('/home/user/Music/Track 3.mp3');
        });

        it('should not get tracks that were previously removed, when removed tracks should be skipped.', async () => {
            // Arrange
            const t1: Track = MockCreator.createTrack('/home/user/Music/Track 1.mp3', 1);
            const t2: Track = MockCreator.createTrack('/home/user/Music/Track 2.mp3', 2);

            trackRepositoryMock.setup((x: TrackRepositoryBase) => x.getAllTracks()).returns(() => [t1, t2]);

            const rt: RemovedTrack = MockCreator.createRemovedTrack('/home/user/Music/Track 3.mp3');
            removedTrackRepositoryMock.setup((x) => x.getRemovedTracks()).returns(() => [rt]);

            const ip1: IndexablePath = MockCreator.createIndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const ip2: IndexablePath = MockCreator.createIndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const ip3: IndexablePath = MockCreator.createIndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock.setup((x) => x.getIndexablePathsForAllFoldersAsync()).returns(() => Promise.resolve([ip1, ip2, ip3]));

            const sut: IndexableTrackFetcher = createSut();

            // Act
            const indexableTracks: IndexableTrack[] = await sut.getIndexableTracksAsync(true);

            // Assert
            expect(indexableTracks.length).toBe(0);
        });
    });
});
