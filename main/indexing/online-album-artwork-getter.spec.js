const { ImageProcessorMock } = require('../mocks/image-processor-mock');
const { LoggerMock } = require('../mocks/logger-mock');
const { OnlineAlbumArtworkGetter } = require('./online-album-artwork-getter');
const { LastfmApiMock } = require('../mocks/lastfm.api-mock');
const { LastfmAlbum } = require('../common/api/lastfm-album');
const { FileMetadataMock } = require('../mocks/file-metadata-mock');

describe('OnlineAlbumArtworkGetter', () => {
    let imageProcessorMock;
    let lastfmApiMock;
    let loggerMock;

    let lastfmAlbum;

    beforeEach(() => {
        imageProcessorMock = new ImageProcessorMock();
        lastfmApiMock = new LastfmApiMock();
        loggerMock = new LoggerMock();

        lastfmAlbum = new LastfmAlbum();
        lastfmAlbum.imageMega = 'http://images.com/image.png';
    });

    function createSut() {
        return new OnlineAlbumArtworkGetter(imageProcessorMock, lastfmApiMock, loggerMock);
    }

    describe('getOnlineArtworkAsync', () => {
        it('should return undefined if fileMetaData is undefined', async () => {
            // Arrange
            // const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            // lastfmApiMock.getAlbumInfoAsyncReturnValues = { 'Artist;Album;false;EN': lastfmAlbum };
            // imageProcessorMock.convertOnlineImageToBufferAsyncReturnValues = { 'http://images.com/image.png': expectedAlbumArtwork };

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getOnlineArtworkAsync(undefined);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return undefined if fileMetaData has artists but no titles', async () => {
            // Arrange
            const metaDataMock = new FileMetadataMock('Path');
            metaDataMock.album = '';
            metaDataMock.title = '';
            metaDataMock.artists = ['Artist 1', 'Artist 2'];
            metaDataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getOnlineArtworkAsync(metaDataMock);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return artwork if fileMetaData has artists and titles', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            lastfmApiMock.getAlbumInfoAsyncReturnValues = { 'Artist 1;My album title;false;EN': lastfmAlbum };
            imageProcessorMock.convertOnlineImageToBufferAsyncReturnValues = { 'http://images.com/image.png': expectedAlbumArtwork };

            const metaDataMock = new FileMetadataMock('Path');
            metaDataMock.album = 'My album title';
            metaDataMock.title = 'My track title';
            metaDataMock.artists = ['Artist 1', 'Artist 2'];
            metaDataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getOnlineArtworkAsync(metaDataMock);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return artwork if fileMetaData has artists and only a track title', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            lastfmApiMock.getAlbumInfoAsyncReturnValues = { 'Artist 1;My track title;false;EN': lastfmAlbum };
            imageProcessorMock.convertOnlineImageToBufferAsyncReturnValues = { 'http://images.com/image.png': expectedAlbumArtwork };

            const metaDataMock = new FileMetadataMock('Path');
            metaDataMock.album = '';
            metaDataMock.title = 'My track title';
            metaDataMock.artists = ['Artist 1', 'Artist 2'];
            metaDataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getOnlineArtworkAsync(metaDataMock);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return artwork if fileMetaData has artists and only an album title', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            lastfmApiMock.getAlbumInfoAsyncReturnValues = { 'Artist 1;My album title;false;EN': lastfmAlbum };
            imageProcessorMock.convertOnlineImageToBufferAsyncReturnValues = { 'http://images.com/image.png': expectedAlbumArtwork };

            const metaDataMock = new FileMetadataMock('Path');
            metaDataMock.album = 'My album title';
            metaDataMock.title = '';
            metaDataMock.artists = ['Artist 1', 'Artist 2'];
            metaDataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getOnlineArtworkAsync(metaDataMock);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return artwork if fileMetaData has titles and only album artists', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            lastfmApiMock.getAlbumInfoAsyncReturnValues = { 'Album artist 1;My album title;false;EN': lastfmAlbum };
            imageProcessorMock.convertOnlineImageToBufferAsyncReturnValues = { 'http://images.com/image.png': expectedAlbumArtwork };

            const metaDataMock = new FileMetadataMock('Path');
            metaDataMock.album = 'My album title';
            metaDataMock.title = 'My track title';
            metaDataMock.artists = [];
            metaDataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getOnlineArtworkAsync(metaDataMock);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return artwork if fileMetaData has titles and only track artists', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            lastfmApiMock.getAlbumInfoAsyncReturnValues = { 'Artist 1;My album title;false;EN': lastfmAlbum };
            imageProcessorMock.convertOnlineImageToBufferAsyncReturnValues = { 'http://images.com/image.png': expectedAlbumArtwork };

            const metaDataMock = new FileMetadataMock('Path');
            metaDataMock.album = 'My album title';
            metaDataMock.title = 'My track title';
            metaDataMock.artists = ['Artist 1', 'Artist 2'];
            metaDataMock.albumArtists = [];

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getOnlineArtworkAsync(metaDataMock);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return undefined if converting file to data throws error', async () => {
            // Arrange
            lastfmApiMock.getAlbumInfoAsyncReturnValues = { 'Artist 1;My album title;false;EN': lastfmAlbum };
            imageProcessorMock.convertImageBufferToFileAsyncShouldThrowError = true;

            const metaDataMock = new FileMetadataMock('Path');
            metaDataMock.album = 'My album title';
            metaDataMock.title = 'My track title';
            metaDataMock.artists = ['Artist 1', 'Artist 2'];
            metaDataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getOnlineArtworkAsync(metaDataMock);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return undefined if getting online album info throws error', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            lastfmApiMock.getAlbumInfoAsyncThrowsError = true;
            imageProcessorMock.convertOnlineImageToBufferAsyncReturnValues = { 'http://images.com/image.png': expectedAlbumArtwork };

            const metaDataMock = new FileMetadataMock('Path');
            metaDataMock.album = 'My album title';
            metaDataMock.title = 'My track title';
            metaDataMock.artists = ['Artist 1', 'Artist 2'];
            metaDataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getOnlineArtworkAsync(metaDataMock);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });
    });
});
