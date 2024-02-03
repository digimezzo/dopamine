const { LoggerMock } = require('../mocks/logger-mock');
const { EmbeddedAlbumArtworkGetter } = require('./embedded-album-artwork-getter');
const { FileMetadataMock } = require('../mocks/file-metadata-mock');

describe('EmbeddedAlbumArtworkGetter', () => {
    describe('getEmbeddedArtwork', () => {
        it('should return null if fileMetaData is undefined', () => {
            // Arrange
            const loggerMock = new LoggerMock();
            const embeddedAlbumArtworkGetter = new EmbeddedAlbumArtworkGetter(loggerMock);

            // Act
            const artwork = embeddedAlbumArtworkGetter.getEmbeddedArtwork(undefined);

            // Assert
            expect(artwork).toBeUndefined();
        });

        it('should return embedded artwork if fileMetaData is not undefined', () => {
            // Arrange
            const loggerMock = new LoggerMock();
            const fileMetaDataMock = new FileMetadataMock();
            const embeddedAlbumArtworkGetter = new EmbeddedAlbumArtworkGetter(loggerMock);

            const artwork = Buffer.from([1, 2, 3]);
            fileMetaDataMock.picture = artwork;

            // Act
            const actualArtwork = embeddedAlbumArtworkGetter.getEmbeddedArtwork(fileMetaDataMock);

            // Assert
            expect(actualArtwork).toEqual(artwork);
        });
    });
});
