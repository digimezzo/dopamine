const { EmbeddedAlbumArtworkGetterMock } = require('../mocks/embedded-album-artwork-getter-mock');
const { ExternalAlbumArtworkGetterMock } = require('../mocks/external-album-artwork-getter-mock');
const { OnlineAlbumArtworkGetterMock } = require('../mocks/online-album-artwork-getter-mock');
const { AlbumArtworkGetter } = require('./album-artwork-getter');
const { FileMetadataMock } = require('../mocks/file-metadata-mock');
const { WorkerProxyMock } = require('../mocks/worker-proxy-mock');

describe('AlbumArtworkGetter', () => {
    let embeddedAlbumArtworkGetterMock;
    let externalAlbumArtworkGetterMock;
    let onlineAlbumArtworkGetterMock;
    let workerProxyMock;

    beforeEach(() => {
        embeddedAlbumArtworkGetterMock = new EmbeddedAlbumArtworkGetterMock();
        externalAlbumArtworkGetterMock = new ExternalAlbumArtworkGetterMock();
        onlineAlbumArtworkGetterMock = new OnlineAlbumArtworkGetterMock();
        workerProxyMock = new WorkerProxyMock();
    });

    function createSut() {
        return new AlbumArtworkGetter(
            embeddedAlbumArtworkGetterMock,
            externalAlbumArtworkGetterMock,
            onlineAlbumArtworkGetterMock,
            workerProxyMock,
        );
    }

    describe('getAlbumArtwork', () => {
        it('should return embedded artwork when there is embedded artwork', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock = new FileMetadataMock('/path/to/file');

            embeddedAlbumArtworkGetterMock.getEmbeddedArtworkReturnValues = { '/path/to/file': expectedAlbumArtwork };

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getAlbumArtworkAsync(metaDataMock, true);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return external artwork when there is no embedded artwork but there is external artwork', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock = new FileMetadataMock('/path/to/file');

            embeddedAlbumArtworkGetterMock.getEmbeddedArtworkReturnValues = { '/path/to/file': undefined };
            externalAlbumArtworkGetterMock.getExternalArtworkAsyncReturnValues = { '/path/to/file': expectedAlbumArtwork };

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getAlbumArtworkAsync(metaDataMock, true);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return online artwork when settings require downloading missing covers when there is no embedded and no external artwork but there is online artwork and getOnlineArtwork is true', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock = new FileMetadataMock('/path/to/file');

            embeddedAlbumArtworkGetterMock.getEmbeddedArtworkReturnValues = { '/path/to/file': undefined };
            externalAlbumArtworkGetterMock.getExternalArtworkAsyncReturnValues = { '/path/to/file': undefined };
            onlineAlbumArtworkGetterMock.getOnlineArtworkAsyncReturnValues = { '/path/to/file': expectedAlbumArtwork };

            workerProxyMock.downloadMissingAlbumCoversReturnValue = true;

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getAlbumArtworkAsync(metaDataMock, true);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return undefined when settings require downloading missing covers when there is no embedded and no external artwork and getOnlineArtwork is false', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock = new FileMetadataMock('/path/to/file');

            embeddedAlbumArtworkGetterMock.getEmbeddedArtworkReturnValues = { '/path/to/file': undefined };
            externalAlbumArtworkGetterMock.getExternalArtworkAsyncReturnValues = { '/path/to/file': undefined };
            onlineAlbumArtworkGetterMock.getOnlineArtworkAsyncReturnValues = { '/path/to/file': expectedAlbumArtwork };

            workerProxyMock.downloadMissingAlbumCoversReturnValue = true;

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getAlbumArtworkAsync(metaDataMock, false);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return undefined when settings do not require downloading missing covers when there is no embedded and no external artwork and getOnlineArtwork is true', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock = new FileMetadataMock('/path/to/file');

            embeddedAlbumArtworkGetterMock.getEmbeddedArtworkReturnValues = { '/path/to/file': undefined };
            externalAlbumArtworkGetterMock.getExternalArtworkAsyncReturnValues = { '/path/to/file': undefined };
            onlineAlbumArtworkGetterMock.getOnlineArtworkAsyncReturnValues = { '/path/to/file': expectedAlbumArtwork };

            workerProxyMock.downloadMissingAlbumCoversReturnValue = false;

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getAlbumArtworkAsync(metaDataMock, true);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return undefined when settings do not require downloading missing covers when there is no embedded and no external artwork but there is online artwork and getOnlineArtwork is false', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock = new FileMetadataMock('/path/to/file');

            embeddedAlbumArtworkGetterMock.getEmbeddedArtworkReturnValues = { '/path/to/file': undefined };
            externalAlbumArtworkGetterMock.getExternalArtworkAsyncReturnValues = { '/path/to/file': undefined };
            onlineAlbumArtworkGetterMock.getOnlineArtworkAsyncReturnValues = { '/path/to/file': expectedAlbumArtwork };

            workerProxyMock.downloadMissingAlbumCoversReturnValue = false;

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getAlbumArtworkAsync(metaDataMock, false);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return undefined when there is no embedded and no external and no online artwork', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock = new FileMetadataMock('/path/to/file');

            embeddedAlbumArtworkGetterMock.getEmbeddedArtworkReturnValues = { '/path/to/file': undefined };
            externalAlbumArtworkGetterMock.getExternalArtworkAsyncReturnValues = { '/path/to/file': undefined };
            onlineAlbumArtworkGetterMock.getOnlineArtworkAsyncReturnValues = { '/path/to/file': undefined };

            workerProxyMock.downloadMissingAlbumCoversReturnValue = false;

            const sut = createSut();

            // Act
            const actualAlbumArtwork = await sut.getAlbumArtworkAsync(metaDataMock, true);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });
    });
});
