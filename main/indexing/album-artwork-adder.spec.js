const { LoggerMock } = require('../mocks/logger-mock');
const { TrackRepositoryMock } = require('../mocks/track-repository-mock');
const { AlbumArtworkRepositoryMock } = require('../mocks/album-artwork-repository-mock');
const { AlbumArtworkGetterMock } = require('../mocks/album-artwork-getter-mock');
const { FileMetadataFactoryMock } = require('../mocks/file-metadata.factory-mock');
const { AlbumArtworkCacheMock } = require('../mocks/album-artwork-cache-mock');
const { WorkerProxyMock } = require('../mocks/worker-proxy-mock');
const { AlbumArtworkAdder } = require('./album-artwork-adder');
const { Track } = require('../data/entities/track');
const { AlbumArtworkCacheId } = require('./album-artwork-cache-id');
const { GuidFactoryMock } = require('../mocks/guid-factory-mock');
const { AlbumArtwork } = require('../data/entities/album-artwork');

describe('AlbumArtworkAdder', () => {
    let trackRepositoryMock;
    let albumArtworkRepositoryMock;
    let albumArtworkGetterMock;
    let fileMetadataFactoryMock;
    let albumArtworkCacheMock;
    let workerProxyMock;
    let loggerMock;

    beforeEach(() => {
        trackRepositoryMock = new TrackRepositoryMock();
        albumArtworkRepositoryMock = new AlbumArtworkRepositoryMock();
        albumArtworkGetterMock = new AlbumArtworkGetterMock();
        fileMetadataFactoryMock = new FileMetadataFactoryMock();
        albumArtworkCacheMock = new AlbumArtworkCacheMock();
        workerProxyMock = new WorkerProxyMock();
        loggerMock = new LoggerMock();
    });

    function createSut() {
        return new AlbumArtworkAdder(
            trackRepositoryMock,
            albumArtworkRepositoryMock,
            albumArtworkGetterMock,
            fileMetadataFactoryMock,
            albumArtworkCacheMock,
            workerProxyMock,
            loggerMock,
        );
    }

    describe('addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync', () => {
        it('should get album data that needs indexing', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(trackRepositoryMock.getAlbumDataThatNeedsIndexingCalls.length).toBe(1);
        });

        it('should notify that album artwork is being updated if it is the first time that indexing runs', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };

            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkReturnValue = 0;

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.length).toBe(1);
        });

        it('should not notify that album artwork is being updated if it is not the first time that indexing runs', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };

            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkReturnValue = 10;

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.length).toBe(0);
        });

        it('should not get the last modified track for an album key if there is no album data that needs indexing', async () => {
            // Arrange
            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [];

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncCalls.length).toEqual(0);
        });

        it('should get the last modified track for an album key if there is album data that needs indexing', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };
            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncCalls.length).toEqual(1);
        });

        it('should not create a read-only file metadata if there is no last modified track for the given album key', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };
            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncReturnValues = { AlbumKey1: undefined };

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(fileMetadataFactoryMock.createCalls.length).toBe(0);
        });

        it('should create a read-only file metadata if there is a last modified track for the given album key', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };
            const track1 = new Track('/home/user/Music/track1.mp3');

            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncReturnValues = { AlbumKey1: track1 };

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(fileMetadataFactoryMock.createCalls.filter((x) => x === '/home/user/Music/track1.mp3').length).toBe(1);
        });

        it('should get album artwork if a read-only file metadata was created', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };
            const track1 = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = {};

            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncReturnValues = { AlbumKey1: track1 };
            fileMetadataFactoryMock.createReturnValues = { '/home/user/Music/track1.mp3': fileMetadataStub };

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(albumArtworkGetterMock.getAlbumArtworkAsyncCalls.length).toEqual(1);
        });

        it('should not add album artwork to the cache if no album artwork data was found', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };
            const track1 = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = {};

            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncReturnValues = { AlbumKey1: track1 };
            fileMetadataFactoryMock.createReturnValues = { '/home/user/Music/track1.mp3': fileMetadataStub };
            albumArtworkGetterMock.getAlbumArtworkAsyncReturnValues = { '/home/user/Music/track1.mp3;true': undefined };

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(albumArtworkCacheMock.addArtworkDataToCacheAsyncCalls.length).toEqual(0);
        });

        it('should add album artwork to the cache if album artwork data was found', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };
            const track1 = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = { path: '/home/user/Music/track1.mp3' };
            const albumArtworkData1 = Buffer.from([1, 2, 3]);

            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncReturnValues = { AlbumKey1: track1 };
            fileMetadataFactoryMock.createReturnValues = { '/home/user/Music/track1.mp3': fileMetadataStub };
            albumArtworkGetterMock.getAlbumArtworkAsyncReturnValues = { '/home/user/Music/track1.mp3;true': albumArtworkData1 };
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkReturnValue = 1;

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(albumArtworkCacheMock.addArtworkDataToCacheAsyncCalls.filter((x) => x === albumArtworkData1).length).toBe(1);
        });

        it('should not disable album artwork indexing for the given album key if the artwork was not added to the cache', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };
            const track1 = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = { path: '/home/user/Music/track1.mp3' };
            const albumArtworkData1 = Buffer.from([1, 2, 3]);

            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncReturnValues = { AlbumKey1: track1 };
            fileMetadataFactoryMock.createReturnValues = { '/home/user/Music/track1.mp3': fileMetadataStub };
            albumArtworkGetterMock.getAlbumArtworkAsyncReturnValues = { '/home/user/Music/track1.mp3;true': albumArtworkData1 };
            albumArtworkCacheMock.addArtworkDataToCacheAsyncReturnValues = { '1,2,3': undefined };

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(trackRepositoryMock.disableNeedsAlbumArtworkIndexingCalls.length).toEqual(0);
        });

        it('should disable album artwork indexing for the given album key if the artwork was added to the cache', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };
            const track1 = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = { path: '/home/user/Music/track1.mp3' };
            const albumArtworkData1 = Buffer.from([1, 2, 3]);

            const guidFactoryMock = new GuidFactoryMock();
            guidFactoryMock.createReturnValue = '123456';
            const albumArtworkCacheId1 = new AlbumArtworkCacheId(guidFactoryMock);
            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncReturnValues = { AlbumKey1: track1 };
            fileMetadataFactoryMock.createReturnValues = { '/home/user/Music/track1.mp3': fileMetadataStub };
            albumArtworkGetterMock.getAlbumArtworkAsyncReturnValues = { '/home/user/Music/track1.mp3;true': albumArtworkData1 };
            albumArtworkCacheMock.addArtworkDataToCacheAsyncReturnValues = { '1,2,3': albumArtworkCacheId1 };

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(trackRepositoryMock.disableNeedsAlbumArtworkIndexingCalls.filter((x) => x === 'AlbumKey1').length).toEqual(1);
        });

        it('should not add album artwork to the database if the artwork was not added to the cache', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };
            const track1 = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = { path: '/home/user/Music/track1.mp3' };
            const albumArtworkData1 = Buffer.from([1, 2, 3]);

            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncReturnValues = { AlbumKey1: track1 };
            fileMetadataFactoryMock.createReturnValues = { '/home/user/Music/track1.mp3': fileMetadataStub };
            albumArtworkGetterMock.getAlbumArtworkAsyncReturnValues = { '/home/user/Music/track1.mp3;true': albumArtworkData1 };
            albumArtworkCacheMock.addArtworkDataToCacheAsyncReturnValues = { '1,2,3': undefined };

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(albumArtworkRepositoryMock.addAlbumArtworkCalls.length).toEqual(0);
        });

        it('should add album artwork to the database if the artwork was added to the cache', async () => {
            // Arrange
            const albumData1 = { albumKey: 'AlbumKey1' };
            const track1 = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = { path: '/home/user/Music/track1.mp3' };
            const albumArtworkData1 = Buffer.from([1, 2, 3]);
            const guidFactoryMock = new GuidFactoryMock();
            guidFactoryMock.createReturnValue = '123456';
            const albumArtworkCacheId1 = new AlbumArtworkCacheId(guidFactoryMock);

            trackRepositoryMock.getAlbumDataThatNeedsIndexingReturnValue = [albumData1];
            trackRepositoryMock.getLastModifiedTrackForAlbumKeyAsyncReturnValues = { AlbumKey1: track1 };
            fileMetadataFactoryMock.createReturnValues = { '/home/user/Music/track1.mp3': fileMetadataStub };
            albumArtworkGetterMock.getAlbumArtworkAsyncReturnValues = { '/home/user/Music/track1.mp3;true': albumArtworkData1 };
            albumArtworkCacheMock.addArtworkDataToCacheAsyncReturnValues = { '1,2,3': albumArtworkCacheId1 };

            const newAlbumArtwork1 = new AlbumArtwork('AlbumKey1', albumArtworkCacheId1.id);

            const sut = createSut();

            // Act
            await sut.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(albumArtworkRepositoryMock.addAlbumArtworkCalls.filter((x) => x === 'album-123456').length).toEqual(1);
        });
    });
});
