import { IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../app/core/logger';
import { AlbumData } from '../app/data/album-data';
import { AlbumArtwork } from '../app/data/entities/album-artwork';
import { Track } from '../app/data/entities/track';
import { AlbumArtworkRepository } from '../app/data/repositories/album-artwork-repository';
import { TrackRepository } from '../app/data/repositories/track-repository';
import { FileMetadataFactory } from '../app/metadata/file-metadata-factory';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkCacheService } from '../app/services/album-artwork-cache/album-artwork-cache.service';
import { BaseAlbumArtworkCacheService } from '../app/services/album-artwork-cache/base-album-artwork-cache.service';
import { AlbumArtworkIndexer } from '../app/services/indexing/album-artwork-indexer';
import { FileMetadataMock } from './mocking/file-metadata-mock';

describe('AlbumArtworkIndexer', () => {
    describe('indexAlbumArtworkAsync', () => {
        it('Should get the albumData that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const albumArtworkCacheServiceMock: IMock<AlbumArtworkCacheService> = Mock.ofType<AlbumArtworkCacheService>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                albumArtworkCacheServiceMock.object,
                fileMetadataFactoryMock.object,
                loggerMock.object
            );

            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            trackRepositoryMock.verify(x => x.getAlbumDataThatNeedsIndexing(), Times.exactly(1));
        });

        it('Should not delete any artwork if there is no albumData that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const albumArtworkCacheServiceMock: IMock<AlbumArtworkCacheService> = Mock.ofType<AlbumArtworkCacheService>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                albumArtworkCacheServiceMock.object,
                fileMetadataFactoryMock.object,
                loggerMock.object
            );

            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtwork(It.isAnyString()), Times.never());
        });

        it('Should delete artwork for all albumData that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                albumArtworkCacheServiceMock.object,
                fileMetadataFactoryMock.object,
                loggerMock.object
            );

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = ';AlbumTitle1;;AlbumArtist1;';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = ';AlbumTitle2;;AlbumArtist2;';

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);
            const fileMetadata2: FileMetadataMock = new FileMetadataMock();
            fileMetadata2.path = track2.path;
            fileMetadata2.picture = Buffer.from([4, 5, 6]);

            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData1.albumKey)).returns(() => track1);
            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData2.albumKey)).returns(() => track2);
            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track1.path)).returns(async () => fileMetadata1);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track2.path)).returns(async () => fileMetadata2);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtwork(It.isAnyString()), Times.exactly(2));
            albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtwork(albumData1.albumKey), Times.exactly(1));
            albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtwork(albumData2.albumKey), Times.exactly(1));
        });

        it('Should add artwork to cache for all albumData that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                albumArtworkCacheServiceMock.object,
                fileMetadataFactoryMock.object,
                loggerMock.object
            );

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = ';AlbumTitle1;;AlbumArtist1;';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = ';AlbumTitle2;;AlbumArtist2;';

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);
            const fileMetadata2: FileMetadataMock = new FileMetadataMock();
            fileMetadata2.path = track2.path;
            fileMetadata2.picture = Buffer.from([4, 5, 6]);

            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData1.albumKey)).returns(() => track1);
            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData2.albumKey)).returns(() => track2);
            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track1.path)).returns(async () => fileMetadata1);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track2.path)).returns(async () => fileMetadata2);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkCacheServiceMock.verify(x => x.addArtworkDataToCacheAsync(It.isAny()), Times.exactly(2));
            albumArtworkCacheServiceMock.verify(x => x.addArtworkDataToCacheAsync(fileMetadata1.picture), Times.exactly(1));
            albumArtworkCacheServiceMock.verify(x => x.addArtworkDataToCacheAsync(fileMetadata2.picture), Times.exactly(1));
        });

        it('Should disable requirement to index artwork for album keys for which artwork was added to the cache', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                albumArtworkCacheServiceMock.object,
                fileMetadataFactoryMock.object,
                loggerMock.object
            );

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = ';AlbumTitle1;;AlbumArtist1;';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = ';AlbumTitle2;;AlbumArtist2;';

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);
            const fileMetadata2: FileMetadataMock = new FileMetadataMock();
            fileMetadata2.path = track2.path;
            fileMetadata2.picture = Buffer.from([4, 5, 6]);

            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData1.albumKey)).returns(() => track1);
            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData2.albumKey)).returns(() => track2);
            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track1.path)).returns(async () => fileMetadata1);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track2.path)).returns(async () => fileMetadata2);

            albumArtworkCacheServiceMock.setup(x => x.addArtworkDataToCacheAsync(fileMetadata1.picture)).returns(async () => null);
            albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(fileMetadata2.picture)).returns(async () => new AlbumArtworkCacheId()
                );

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            trackRepositoryMock.verify(x => x.disableNeedsAlbumArtworkIndexingAsync(It.isAny()), Times.exactly(1));
            trackRepositoryMock.verify(x => x.disableNeedsAlbumArtworkIndexingAsync(albumData2.albumKey), Times.exactly(1));
        });

        it('Should not disable requirement to index artwork for album keys for which no artwork was added to the cache', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                albumArtworkCacheServiceMock.object,
                fileMetadataFactoryMock.object,
                loggerMock.object
            );

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = ';AlbumTitle1;;AlbumArtist1;';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = ';AlbumTitle2;;AlbumArtist2;';

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);
            const fileMetadata2: FileMetadataMock = new FileMetadataMock();
            fileMetadata2.path = track2.path;
            fileMetadata2.picture = Buffer.from([4, 5, 6]);

            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData1.albumKey)).returns(() => track1);
            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData2.albumKey)).returns(() => track2);
            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track1.path)).returns(async () => fileMetadata1);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track2.path)).returns(async () => fileMetadata2);

            albumArtworkCacheServiceMock.setup(x => x.addArtworkDataToCacheAsync(fileMetadata1.picture)).returns(async () => null);
            albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(fileMetadata2.picture)).returns(async () => new AlbumArtworkCacheId()
                );

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            trackRepositoryMock.verify(x => x.disableNeedsAlbumArtworkIndexingAsync(It.isAny()), Times.exactly(1));
            trackRepositoryMock.verify(x => x.disableNeedsAlbumArtworkIndexingAsync(albumData1.albumKey), Times.never());
        });

        it('Should add album artwork for album keys for which artwork was added to the cache', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                albumArtworkCacheServiceMock.object,
                fileMetadataFactoryMock.object,
                loggerMock.object
            );

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = ';AlbumTitle1;;AlbumArtist1;';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = ';AlbumTitle2;;AlbumArtist2;';

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);
            const fileMetadata2: FileMetadataMock = new FileMetadataMock();
            fileMetadata2.path = track2.path;
            fileMetadata2.picture = Buffer.from([4, 5, 6]);

            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData1.albumKey)).returns(() => track1);
            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData2.albumKey)).returns(() => track2);
            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track1.path)).returns(async () => fileMetadata1);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track2.path)).returns(async () => fileMetadata2);

            albumArtworkCacheServiceMock.setup(x => x.addArtworkDataToCacheAsync(fileMetadata1.picture)).returns(async () => null);
            albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(fileMetadata2.picture)).returns(async () => new AlbumArtworkCacheId()
                );

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRepositoryMock.verify(x => x.addAlbumArtwork(It.isAny()), Times.exactly(1));
            albumArtworkRepositoryMock.verify(
                x => x.addAlbumArtwork(It.isObjectWith<AlbumArtwork>({ albumKey: albumData2.albumKey })
                ), Times.exactly(1));
        });

        it('Should not add album artwork for album keys for which no artwork was added to the cache', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                albumArtworkCacheServiceMock.object,
                fileMetadataFactoryMock.object,
                loggerMock.object
            );

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = ';AlbumTitle1;;AlbumArtist1;';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = ';AlbumTitle2;;AlbumArtist2;';

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');

            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);
            const fileMetadata2: FileMetadataMock = new FileMetadataMock();
            fileMetadata2.path = track2.path;
            fileMetadata2.picture = Buffer.from([4, 5, 6]);

            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData1.albumKey)).returns(() => track1);
            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync(albumData2.albumKey)).returns(() => track2);
            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track1.path)).returns(async () => fileMetadata1);
            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync(track2.path)).returns(async () => fileMetadata2);

            albumArtworkCacheServiceMock.setup(x => x.addArtworkDataToCacheAsync(fileMetadata1.picture)).returns(async () => null);
            albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(fileMetadata2.picture)).returns(async () => new AlbumArtworkCacheId()
                );

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRepositoryMock.verify(x => x.addAlbumArtwork(It.isAny()), Times.exactly(1));
            albumArtworkRepositoryMock.verify(
                x => x.addAlbumArtwork(It.isObjectWith<AlbumArtwork>({ albumKey: albumData1.albumKey })
                ), Times.never());
        });
    });
});
