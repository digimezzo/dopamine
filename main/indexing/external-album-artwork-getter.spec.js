const { ExternalArtworkPathGetterMock } = require('../mocks/external-artwork-path-getter-mock');
const { LoggerMock } = require('../mocks/logger-mock');
const { ImageProcessorMock } = require('../mocks/image-processor-mock');
const { ExternalAlbumArtworkGetter } = require('./external-album-artwork-getter');
const { FileMetadataMock } = require('../mocks/file-metadata-mock');

describe('ExternalAlbumArtworkGetter', () => {
    let externalArtworkPathGetterMock;
    let imageProcessorMock;
    let loggerMock;

    beforeEach(() => {
        externalArtworkPathGetterMock = new ExternalArtworkPathGetterMock();
        imageProcessorMock = new ImageProcessorMock();
        loggerMock = new LoggerMock();
    });

    function createSut() {
        return new ExternalAlbumArtworkGetter(externalArtworkPathGetterMock, imageProcessorMock, loggerMock);
    }

    describe('getExternalArtworkAsync', () => {
        it('should return undefined if fileMetaData is undefined', async () => {
            // Arrange
            const sut = createSut();

            // Act
            const artwork = await sut.getExternalArtworkAsync(undefined);

            // Assert
            expect(artwork).toBeUndefined();
        });

        it('should return undefined if fileMetaData is not undefined and external artwork path is empty', async () => {
            // Arrange
            const fileMetadataMock = new FileMetadataMock('/home/MyUser/Music/track.mp3');
            externalArtworkPathGetterMock.getExternalArtworkPathAsyncReturnValues = { '/home/MyUser/Music/track.mp3': '' };

            const sut = createSut();

            // Act
            const artwork = await sut.getExternalArtworkAsync(fileMetadataMock);

            // Assert
            expect(artwork).toBeUndefined();
        });

        it('should return undefined if fileMetaData is not undefined and external artwork path is space', async () => {
            // Arrange
            const fileMetadataMock = new FileMetadataMock('/home/MyUser/Music/track.mp3');
            externalArtworkPathGetterMock.getExternalArtworkPathAsyncReturnValues = { '/home/MyUser/Music/track.mp3': ' ' };

            const sut = createSut();

            // Act
            const actualArtwork = await sut.getExternalArtworkAsync(fileMetadataMock);

            // Assert
            expect(actualArtwork).toBeUndefined();
        });

        it('should return external artwork if fileMetaData is not undefined and an external artwork path was found', async () => {
            // Arrange
            const fileMetadataMock = new FileMetadataMock('/home/MyUser/Music/track.mp3');
            const expectedArtwork = Buffer.from([1, 2, 3]);

            externalArtworkPathGetterMock.getExternalArtworkPathAsyncReturnValues = {
                '/home/MyUser/Music/track.mp3': '/home/MyUser/Music/front.png',
            };

            imageProcessorMock.convertLocalImageToBufferAsyncReturnValues = {
                '/home/MyUser/Music/front.png': expectedArtwork,
            };

            const sut = createSut();

            // Act
            const actualArtwork = await sut.getExternalArtworkAsync(fileMetadataMock);

            // Assert
            expect(actualArtwork).toBe(expectedArtwork);
        });
    });
});
