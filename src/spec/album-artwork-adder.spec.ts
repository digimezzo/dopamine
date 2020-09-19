import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumArtwork } from '../app/data/entities/album-artwork';
import { Track } from '../app/data/entities/track';
import { BaseAlbumArtworkRepository } from '../app/data/repositories/base-album-artwork-repository';
import { BaseTrackRepository } from '../app/data/repositories/base-track-repository';
import { FileMetadataFactory } from '../app/metadata/file-metadata-factory';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
import { BaseAlbumArtworkCacheService } from '../app/services/album-artwork-cache/base-album-artwork-cache.service';
import { AlbumArtworkAdder } from '../app/services/indexing/album-artwork-adder';
import { FileMetadataMock } from './mocking/file-metadata-mock';

describe('AlbumArtworkAdder', () => {
    describe('addAlbumArtworkAsync', () => {
        it('Should not add embedded artwork to the cache if a track is not found for the given album key', async () => {
            // Arrange
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const albumArtworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();

            const albumArtworkAdder: AlbumArtworkAdder = new AlbumArtworkAdder(
                albumArtworkCacheServiceMock.object,
                albumArtworkRepositoryMock.object,
                trackRepositoryMock.object,
                fileMetadataFactoryMock.object
            );

            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => null);

            // Act
            await albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            albumArtworkCacheServiceMock.verify(x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({})), Times.never());
        });

        it('Should add embedded artwork to the cache if a track is found for the given album key', async () => {
            // Arrange
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const albumArtworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();

            const albumArtworkAdder: AlbumArtworkAdder = new AlbumArtworkAdder(
                albumArtworkCacheServiceMock.object,
                albumArtworkRepositoryMock.object,
                trackRepositoryMock.object,
                fileMetadataFactoryMock.object
            );

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);

            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async() => fileMetadata1);
            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(fileMetadata1.picture)).returns(async() => new AlbumArtworkCacheId());

            // Act
            await albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            albumArtworkCacheServiceMock.verify(x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({})), Times.exactly(1));
        });

        it('Should not disable album artwork indexing for the track if no artwork was added to the cache', async () => {
              // Arrange
              const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
              const albumArtworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
              const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
              const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();

              const albumArtworkAdder: AlbumArtworkAdder = new AlbumArtworkAdder(
                  albumArtworkCacheServiceMock.object,
                  albumArtworkRepositoryMock.object,
                  trackRepositoryMock.object,
                  fileMetadataFactoryMock.object
              );

              const track1: Track = new Track('dummyPath');
              const fileMetadata1: FileMetadataMock = new FileMetadataMock();
              fileMetadata1.path = track1.path;
              fileMetadata1.picture = Buffer.from([1, 2, 3]);

              fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async() => fileMetadata1);
              trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
              albumArtworkCacheServiceMock.setup(
                  x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({}))
                  ).returns(async() => null);

              // Act
              await albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

              // Assert
              trackRepositoryMock.verify(x => x.disableNeedsAlbumArtworkIndexingAsync('dummyAlbumKey'), Times.never());
        });

        it('Should not add album artwork information to the database if no artwork was added to the cache', async () => {
            // Arrange
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const albumArtworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();

            const albumArtworkAdder: AlbumArtworkAdder = new AlbumArtworkAdder(
                albumArtworkCacheServiceMock.object,
                albumArtworkRepositoryMock.object,
                trackRepositoryMock.object,
                fileMetadataFactoryMock.object
            );

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);

            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async() => fileMetadata1);
            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({}))
                ).returns(async() => null);

            // Act
            await albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            albumArtworkRepositoryMock.verify(x => x.addAlbumArtwork(It.isObjectWith<AlbumArtwork>({})), Times.never());
      });

        it('Should add album artwork information to the database', async () => {
            // Arrange
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const albumArtworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
            const trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
            const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();

            const albumArtworkAdder: AlbumArtworkAdder = new AlbumArtworkAdder(
                albumArtworkCacheServiceMock.object,
                albumArtworkRepositoryMock.object,
                trackRepositoryMock.object,
                fileMetadataFactoryMock.object
            );

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);

            fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async() => fileMetadata1);
            trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({}))
                ).returns(async() => new AlbumArtworkCacheId());

            // Act
            await albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            albumArtworkRepositoryMock.verify(x => x.addAlbumArtwork(It.isObjectWith<AlbumArtwork>({})), Times.exactly(1));
        });
    });
});
