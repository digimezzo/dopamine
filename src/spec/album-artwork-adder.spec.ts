import { It, Times } from 'typemoq';
import { AlbumArtwork } from '../app/data/entities/album-artwork';
import { Track } from '../app/data/entities/track';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkAdderMocker } from './mocking/album-artwork-adder-mocker';
import { FileMetadataMock } from './mocking/file-metadata-mock';

describe('AlbumArtworkAdder', () => {
    describe('addAlbumArtworkAsync', () => {
        it('Should not add embedded artwork to the cache if a track is not found for the given album key', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            mocker.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => null);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mocker.albumArtworkCacheServiceMock.verify(x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({})), Times.never());
        });

        it('Should get album artwork if a track is found for the given album key', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();

            mocker.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async () => fileMetadata1);
            mocker.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            mocker.albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(fileMetadata1.picture)).returns(async () => new AlbumArtworkCacheId());

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mocker.albumArtworkGetter.verify(x => x.getAlbumArtwork(fileMetadata1), Times.exactly(1));
        });

        it('Should not get album artwork if a track is found for the given album key', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();

            mocker.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async () => fileMetadata1);
            mocker.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => null);
            mocker.albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(fileMetadata1.picture)).returns(async () => new AlbumArtworkCacheId());

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mocker.albumArtworkGetter.verify(x => x.getAlbumArtwork(fileMetadata1), Times.never());
        });

        it('Should add artwork to the cache if album artwork was found', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();

            mocker.albumArtworkGetter.setup(x => x.getAlbumArtwork(fileMetadata1)).returns(() => Buffer.from([1, 2, 3]));
            mocker.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async () => fileMetadata1);
            mocker.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            mocker.albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(fileMetadata1.picture)).returns(async () => new AlbumArtworkCacheId());

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mocker.albumArtworkCacheServiceMock.verify(x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({})), Times.exactly(1));
        });

        it('Should not add artwork to the cache if no album artwork was found', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();

            mocker.albumArtworkGetter.setup(x => x.getAlbumArtwork(fileMetadata1)).returns(() => null);
            mocker.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async () => fileMetadata1);
            mocker.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            mocker.albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(fileMetadata1.picture)).returns(async () => new AlbumArtworkCacheId());

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mocker.albumArtworkCacheServiceMock.verify(x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({})), Times.never());
        });

        it('Should not disable album artwork indexing for the track if no artwork was added to the cache', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();

            mocker.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async () => fileMetadata1);
            mocker.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            mocker.albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({}))
            ).returns(async () => null);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mocker.trackRepositoryMock.verify(x => x.disableNeedsAlbumArtworkIndexingAsync('dummyAlbumKey'), Times.never());
        });

        it('Should not add album artwork information to the database if no artwork was added to the cache', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();

            mocker.albumArtworkGetter.setup(x => x.getAlbumArtwork(fileMetadata1)).returns(() => Buffer.from([1, 2, 3]));
            mocker.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async () => fileMetadata1);
            mocker.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            mocker.albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({}))
            ).returns(async () => null);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mocker.albumArtworkRepositoryMock.verify(x => x.addAlbumArtwork(It.isObjectWith<AlbumArtwork>({})), Times.never());
        });

        it('Should add album artwork information to the database if artwork was added to the cache', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const track1: Track = new Track('dummyPath');
            const fileMetadata1: FileMetadataMock = new FileMetadataMock();

            mocker.albumArtworkGetter.setup(x => x.getAlbumArtwork(fileMetadata1)).returns(() => Buffer.from([1, 2, 3]));
            mocker.fileMetadataFactoryMock.setup(x => x.createReadOnlyAsync('dummyPath')).returns(async () => fileMetadata1);
            mocker.trackRepositoryMock.setup(x => x.getLastModifiedTrackForAlbumKeyAsync('dummyAlbumKey')).returns(() => track1);
            mocker.albumArtworkCacheServiceMock.setup(
                x => x.addArtworkDataToCacheAsync(It.isObjectWith<Buffer>({}))
            ).returns(async () => new AlbumArtworkCacheId());

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkAsync('dummyAlbumKey');

            // Assert
            mocker.albumArtworkRepositoryMock.verify(x => x.addAlbumArtwork(It.isObjectWith<AlbumArtwork>({})), Times.exactly(1));
        });
    });
});
