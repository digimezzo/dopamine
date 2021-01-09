// import { It, Times } from 'typemoq';
// import { AlbumArtwork } from '../app/data/entities/album-artwork';
// import { Track } from '../app/data/entities/track';
// import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
// import { AlbumArtworkAdderMocker } from './mocking/album-artwork-adder-mocker';
// import { FileMetadataMock } from './mocking/file-metadata-mock';

import { It, Times } from 'typemoq';
import { AlbumData } from '../app/data/album-data';
import { AlbumArtwork } from '../app/data/entities/album-artwork';
import { Track } from '../app/data/entities/track';
import { FileMetadata } from '../app/metadata/file-metadata';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkAdderMocker } from './mocking/album-artwork-adder-mocker';
import { FileMetadataMock } from './mocking/file-metadata-mock';

describe('AlbumArtworkAdder', () => {
    describe('addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync', () => {
        it('Should get album data that needs indexing', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            // Act
            mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.trackRepositoryMock.verify((x) => x.getAlbumDataThatNeedsIndexing(), Times.exactly(1));
        });

        it('Should not notify that album artwork is being updated if there is no album data that needs indexing', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();
            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('Should notify that album artwork is being updated if there is album data that needs indexing', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const albumData2: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey2';

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should not get the last modified track for an album key if there is no album data that needs indexing', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();
            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.trackRepositoryMock.verify((x) => x.getLastModifiedTrackForAlbumKeyAsync(It.isAny()), Times.never());
        });

        it('Should get the last modified track for an album key if there is album data that needs indexing', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.trackRepositoryMock.verify((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1'), Times.exactly(1));
        });

        it('Should not create a read-only file metadata if there is no last modified track for the given album key', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);
            mocker.trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1')).returns(() => undefined);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.fileMetadataFactoryMock.verify((x) => x.createReadOnlyAsync(It.isAny()), Times.never());
        });

        it('Should create a read-only file metadata if there is a last modified track for the given album key', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);
            mocker.trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1')).returns(() => track1);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.fileMetadataFactoryMock.verify((x) => x.createReadOnlyAsync('/home/user/Music/track1.mp3'), Times.exactly(1));
        });

        it('Should not get album artwork if a read-only file metadata was not created', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);
            mocker.trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1')).returns(() => track1);
            mocker.fileMetadataFactoryMock.setup((x) => x.createReadOnlyAsync('/home/user/Music/track1.mp3')).returns(() => undefined);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.albumArtworkGetterMock.verify((x) => x.getAlbumArtworkAsync(It.isAny()), Times.never());
        });

        it('Should get album artwork if a read-only file metadata was created', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadata1: FileMetadata = new FileMetadataMock();

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);
            mocker.trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1')).returns(() => track1);
            mocker.fileMetadataFactoryMock
                .setup((x) => x.createReadOnlyAsync('/home/user/Music/track1.mp3'))
                .returns(async () => fileMetadata1);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.albumArtworkGetterMock.verify((x) => x.getAlbumArtworkAsync(It.isAny()), Times.exactly(1));
        });

        it('Should not add album artwork to the cache if no album artwork data was found', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadata1: FileMetadata = new FileMetadataMock();

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);
            mocker.trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1')).returns(() => track1);
            mocker.fileMetadataFactoryMock
                .setup((x) => x.createReadOnlyAsync('/home/user/Music/track1.mp3'))
                .returns(async () => fileMetadata1);
            mocker.albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadata1)).returns(async () => undefined);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.albumArtworkCacheServiceMock.verify((x) => x.addArtworkDataToCacheAsync(It.isAny()), Times.never());
        });

        it('Should add album artwork to the cache if album artwork data was found', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadata1: FileMetadata = new FileMetadataMock();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);
            mocker.trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1')).returns(() => track1);
            mocker.fileMetadataFactoryMock
                .setup((x) => x.createReadOnlyAsync('/home/user/Music/track1.mp3'))
                .returns(async () => fileMetadata1);
            mocker.albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadata1)).returns(async () => albumArtworkData1);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.albumArtworkCacheServiceMock.verify((x) => x.addArtworkDataToCacheAsync(albumArtworkData1), Times.exactly(1));
        });

        it('Should not disable album artwork indexing for the given album key if the artwork was not added to the cache', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadata1: FileMetadata = new FileMetadataMock();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);
            mocker.trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1')).returns(() => track1);
            mocker.fileMetadataFactoryMock
                .setup((x) => x.createReadOnlyAsync('/home/user/Music/track1.mp3'))
                .returns(async () => fileMetadata1);
            mocker.albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadata1)).returns(async () => albumArtworkData1);
            mocker.albumArtworkCacheServiceMock
                .setup((x) => x.addArtworkDataToCacheAsync(albumArtworkData1))
                .returns(async () => undefined);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.trackRepositoryMock.verify((x) => x.disableNeedsAlbumArtworkIndexingAsync('AlbumKey1'), Times.never());
        });

        it('Should disable album artwork indexing for the given album key if the artwork was added to the cache', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadata1: FileMetadata = new FileMetadataMock();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);
            const albumArtworkCacheId1: AlbumArtworkCacheId = new AlbumArtworkCacheId();

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);
            mocker.trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1')).returns(() => track1);
            mocker.fileMetadataFactoryMock
                .setup((x) => x.createReadOnlyAsync('/home/user/Music/track1.mp3'))
                .returns(async () => fileMetadata1);
            mocker.albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadata1)).returns(async () => albumArtworkData1);
            mocker.albumArtworkCacheServiceMock
                .setup((x) => x.addArtworkDataToCacheAsync(albumArtworkData1))
                .returns(async () => albumArtworkCacheId1);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.trackRepositoryMock.verify((x) => x.disableNeedsAlbumArtworkIndexingAsync('AlbumKey1'), Times.exactly(1));
        });

        it('Should not add album artwork to the database if the artwork was not added to the cache', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadata1: FileMetadata = new FileMetadataMock();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);
            mocker.trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1')).returns(() => track1);
            mocker.fileMetadataFactoryMock
                .setup((x) => x.createReadOnlyAsync('/home/user/Music/track1.mp3'))
                .returns(async () => fileMetadata1);
            mocker.albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadata1)).returns(async () => albumArtworkData1);
            mocker.albumArtworkCacheServiceMock
                .setup((x) => x.addArtworkDataToCacheAsync(albumArtworkData1))
                .returns(async () => undefined);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.albumArtworkRepositoryMock.verify((x) => x.addAlbumArtwork(It.isAny()), Times.never());
        });

        it('Should add album artwork to the database if the artwork was added to the cache', async () => {
            // Arrange
            const mocker: AlbumArtworkAdderMocker = new AlbumArtworkAdderMocker();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadata1: FileMetadata = new FileMetadataMock();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);
            const albumArtworkCacheId1: AlbumArtworkCacheId = new AlbumArtworkCacheId();

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1]);
            mocker.trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('AlbumKey1')).returns(() => track1);
            mocker.fileMetadataFactoryMock
                .setup((x) => x.createReadOnlyAsync('/home/user/Music/track1.mp3'))
                .returns(async () => fileMetadata1);
            mocker.albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadata1)).returns(async () => albumArtworkData1);
            mocker.albumArtworkCacheServiceMock
                .setup((x) => x.addArtworkDataToCacheAsync(albumArtworkData1))
                .returns(async () => albumArtworkCacheId1);

            const newAlbumArtwork1: AlbumArtwork = new AlbumArtwork('AlbumKey1', albumArtworkCacheId1.id);

            // Act
            await mocker.albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            mocker.albumArtworkRepositoryMock.verify((x) => x.addAlbumArtwork(newAlbumArtwork1), Times.exactly(1));
        });
    });
});
