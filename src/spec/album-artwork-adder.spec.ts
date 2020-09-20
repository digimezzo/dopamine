import { It, Times } from 'typemoq';
import { AlbumArtwork } from '../app/data/entities/album-artwork';
import { Track } from '../app/data/entities/track';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkAdderMock } from './mocking/album-artwork-adder-mock';
import { FileMetadataMock } from './mocking/file-metadata-mock';

describe('AlbumArtworkAdder', () => {
    describe('addAlbumArtworkAsync', () => {
        it('Should not add embedded artwork to the cache if a track is not found for the given album key', async () => {
            // Arrange
            const mock: AlbumArtworkAdderMock = new AlbumArtworkAdderMock();

            mock.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => null);

            // Act
            await mock.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mock.albumArtworkCacheServiceMock.verify(x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({})), Times.never());
        });

        it('Should add embedded artwork to the cache if a track is found for the given album key', async () => {
            // Arrange
            const mock: AlbumArtworkAdderMock = new AlbumArtworkAdderMock();

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);

            mock.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async() => fileMetadata1);
            mock.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            mock.albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(fileMetadata1.picture)).returns(async() => new AlbumArtworkCacheId());

            // Act
            await mock.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mock.albumArtworkCacheServiceMock.verify(x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({})), Times.exactly(1));
        });

        it('Should not disable album artwork indexing for the track if no artwork was added to the cache', async () => {
              // Arrange
              const mock: AlbumArtworkAdderMock = new AlbumArtworkAdderMock();

              const track1: Track = new Track('dummyPath');
              const fileMetadata1: FileMetadataMock = new FileMetadataMock();
              fileMetadata1.path = track1.path;
              fileMetadata1.picture = Buffer.from([1, 2, 3]);

              mock.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async() => fileMetadata1);
              mock.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
              mock.albumArtworkCacheServiceMock.setup(
                  x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({}))
                  ).returns(async() => null);

              // Act
              await mock.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

              // Assert
              mock.trackRepositoryMock.verify(x => x.disableNeedsAlbumArtworkIndexingAsync('dummyAlbumKey'), Times.never());
        });

        it('Should not add album artwork information to the database if no artwork was added to the cache', async () => {
            // Arrange
            const mock: AlbumArtworkAdderMock = new AlbumArtworkAdderMock();

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);

            mock.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async() => fileMetadata1);
            mock.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            mock.albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({}))
                ).returns(async() => null);

            // Act
            await mock.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mock.albumArtworkRepositoryMock.verify(x => x.addAlbumArtwork(It.isObjectWith<AlbumArtwork>({})), Times.never());
      });

        it('Should add album artwork information to the database', async () => {
            // Arrange
            const mock: AlbumArtworkAdderMock = new AlbumArtworkAdderMock();

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();
            fileMetadata1.path = track1.path;
            fileMetadata1.picture = Buffer.from([1, 2, 3]);

            mock.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async() => fileMetadata1);
            mock.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            mock.albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({}))
                ).returns(async() => new AlbumArtworkCacheId());

            // Act
            await mock.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mock.albumArtworkRepositoryMock.verify(x => x.addAlbumArtwork(It.isObjectWith<AlbumArtwork>({})), Times.exactly(1));
        });
    });
});
