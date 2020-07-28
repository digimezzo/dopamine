import { IMock, It, Mock, Times } from 'typemoq';
import { BaseSettings } from '../app/core/settings/base-settings';
import { RemovedTrack } from '../app/data/entities/removed-track';
import { Track } from '../app/data/entities/track';
import { BaseRemovedTrackRepository } from '../app/data/repositories/base-removed-track-repository';
import { BaseTrackRepository } from '../app/data/repositories/base-track-repository';
import { IndexablePath } from '../app/services/indexing/indexable-path';
import { IndexablePathFetcher } from '../app/services/indexing/indexable-path-fetcher';
import { TrackAdder } from '../app/services/indexing/track-adder';

describe('TrackAdder', () => {
    describe('addTracksThatAreNotInTheDatabase', () => {
        it('Should add tracks that are not in the database', async () => {
            // Arrange
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const removedTrackRepositoryMock: IMock<BaseRemovedTrackRepository> = Mock.ofType<BaseRemovedTrackRepository>();
            const indexablePathFetcherMock: IMock<IndexablePathFetcher> = Mock.ofType<IndexablePathFetcher>();
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const trackAdder: TrackAdder = new TrackAdder(
                trackRepositoryMock.object,
                removedTrackRepositoryMock.object,
                indexablePathFetcherMock.object,
                settingsMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);

            removedTrackRepositoryMock.setup(x => x.getRemovedTracks()).returns(() => []);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock.setup(x => x.getIndexablePathsForAllFoldersAsync()).returns(async () => [
                indexablePath1,
                indexablePath2,
                indexablePath3
            ]);

            // Act
            await trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            trackRepositoryMock.verify(x => x.addTrack(It.isObjectWith<Track>({ path: '/home/user/Music/Track 3.mp3' })), Times.exactly(1));
        });

        it('Should add tracks that were previously removed, when removed tracks should not be ignored.', async () => {
            // Arrange
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const removedTrackRepositoryMock: IMock<BaseRemovedTrackRepository> = Mock.ofType<BaseRemovedTrackRepository>();
            const indexablePathFetcherMock: IMock<IndexablePathFetcher> = Mock.ofType<IndexablePathFetcher>();
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const trackAdder: TrackAdder = new TrackAdder(
                trackRepositoryMock.object,
                removedTrackRepositoryMock.object,
                indexablePathFetcherMock.object,
                settingsMock.object
            );

            settingsMock.setup(x => x.ignoreRemovedFiles).returns(() => false);

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);

            const removedTrack: RemovedTrack = new RemovedTrack('/home/user/Music/Track 3.mp3');

            removedTrackRepositoryMock.setup(x => x.getRemovedTracks()).returns(() => [removedTrack]);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock.setup(x => x.getIndexablePathsForAllFoldersAsync()).returns(async () => [
                indexablePath1,
                indexablePath2,
                indexablePath3
            ]);

            // Act
            await trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            trackRepositoryMock.verify(x => x.addTrack(It.isObjectWith<Track>({ path: '/home/user/Music/Track 3.mp3' })), Times.exactly(1));
        });

        it('Should not add tracks that were previously removed, when removed tracks should be ignored.', async () => {
            // Arrange
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const removedTrackRepositoryMock: IMock<BaseRemovedTrackRepository> = Mock.ofType<BaseRemovedTrackRepository>();
            const indexablePathFetcherMock: IMock<IndexablePathFetcher> = Mock.ofType<IndexablePathFetcher>();
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const trackAdder: TrackAdder = new TrackAdder(
                trackRepositoryMock.object,
                removedTrackRepositoryMock.object,
                indexablePathFetcherMock.object,
                settingsMock.object
            );

            settingsMock.setup(x => x.ignoreRemovedFiles).returns(() => true);

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);

            const removedTrack: RemovedTrack = new RemovedTrack('/home/user/Music/Track 3.mp3');

            removedTrackRepositoryMock.setup(x => x.getRemovedTracks()).returns(() => [removedTrack]);

            const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3: IndexablePath = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock.setup(x => x.getIndexablePathsForAllFoldersAsync()).returns(async () => [
                indexablePath1,
                indexablePath2,
                indexablePath3
            ]);

            // Act
            await trackAdder.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            trackRepositoryMock.verify(x => x.addTrack(It.isObjectWith<Track>({ path: '/home/user/Music/Track 3.mp3' })), Times.never());
        });
    });
});
