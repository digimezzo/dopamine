import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { CollectionIndexer } from '../app/services/indexing/collection-indexer';
import { TrackRepository } from '../app/data/repositories/track-repository';
import { FileSystem } from '../app/core/io/file-system';
import { Track } from '../app/data/entities/track';
import { Logger } from '../app/core/logger';

describe('CollectionIndexer', () => {
    describe('indexCollectionAsync', () => {
        it('Should remove tracks which are not part of a collection folder', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRepositoryMock.object,
                fileSystemMock.object,
                loggerMock.object);

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => []);

            // Act
            await collectionIndexer.indexCollectionAsync();

            // Assert
            trackRepositoryMock.verify(x => x.deleteTracksThatDoNotBelongFolders(), Times.exactly(1));
        });

        it('Should remove tracks which are not found on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRepositoryMock.object,
                fileSystemMock.object,
                loggerMock.object);

            const track1: Track = new Track();
            track1.trackId = 1;
            track1.path = '/home/user/Music/Track 1.mp3';

            const track2: Track = new Track();
            track2.trackId = 2;
            track2.path = '/home/user/Music/Track 2.mp3';

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.pathExists(track1.path)).returns(() => true);
            fileSystemMock.setup(x => x.pathExists(track2.path)).returns(() => false);

            // Act
            await collectionIndexer.indexCollectionAsync();

            // Assert
            trackRepositoryMock.verify(x => x.deleteTrack(track2.trackId), Times.exactly(1));
        });

        it('Should not remove tracks which are found on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRepositoryMock.object,
                fileSystemMock.object,
                loggerMock.object);

            const track1: Track = new Track();
            track1.trackId = 1;
            track1.path = '/home/user/Music/Track 1.mp3';

            const track2: Track = new Track();
            track2.trackId = 2;
            track2.path = '/home/user/Music/Track 2.mp3';

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.pathExists(track1.path)).returns(() => true);
            fileSystemMock.setup(x => x.pathExists(track2.path)).returns(() => false);

            // Act
            await collectionIndexer.indexCollectionAsync();

            // Assert
            trackRepositoryMock.verify(x => x.deleteTrack(track1.trackId), Times.never());
        });
    });
});
