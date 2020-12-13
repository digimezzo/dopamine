import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { ImageProcessor } from '../app/core/image-processor';
import { Logger } from '../app/core/logger';
import { FileMetadata } from '../app/metadata/file-metadata';
import { ExternalAlbumArtworkGetter } from '../app/services/indexing/external-album-artwork-getter';
import { ExternalArtworkPathGetter } from '../app/services/indexing/external-artwork-path-getter';

describe('ExternalAlbumArtworkGetter', () => {
    describe('getExternalArtworkAsync', () => {
        it('Should return undefined if fileMetaData is undefined', async () => {
            // Arrange
            const externalArtworkPathGetterMock: IMock<ExternalArtworkPathGetter> = Mock.ofType<ExternalArtworkPathGetter>();
            const imageprocessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const externalAlbumArtworkGetter: ExternalAlbumArtworkGetter = new ExternalAlbumArtworkGetter(
                externalArtworkPathGetterMock.object,
                imageprocessorMock.object,
                loggerMock.object);


            // Act
            const actualArtwork: Buffer = await externalAlbumArtworkGetter.getExternalArtworkAsync(undefined);

            // Assert
            assert.strictEqual(actualArtwork, undefined);
        });

        it('Should return undefined if fileMetaData is not undefined and external artwork path is undefined', async () => {
            // Arrange
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            const externalArtworkPathGetterMock: IMock<ExternalArtworkPathGetter> = Mock.ofType<ExternalArtworkPathGetter>();
            const imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const externalAlbumArtworkGetter: ExternalAlbumArtworkGetter = new ExternalAlbumArtworkGetter(
                externalArtworkPathGetterMock.object,
                imageProcessorMock.object,
                loggerMock.object);

            fileMetaDataMock.setup(x => x.path).returns(() => '/home/MyUser/Music/track.mp3');

            externalArtworkPathGetterMock.setup(
                x => x.getExternalArtworkPath('/home/MyUser/Music/track.mp3')
            ).returns(() => undefined);

            // Act
            const actualArtwork: Buffer = await externalAlbumArtworkGetter.getExternalArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualArtwork, undefined);
        });

        it('Should return undefined if fileMetaData is not undefined and external artwork path is empty', async () => {
            // Arrange
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            const externalArtworkPathGetterMock: IMock<ExternalArtworkPathGetter> = Mock.ofType<ExternalArtworkPathGetter>();
            const imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const externalAlbumArtworkGetter: ExternalAlbumArtworkGetter = new ExternalAlbumArtworkGetter(
                externalArtworkPathGetterMock.object,
                imageProcessorMock.object,
                loggerMock.object);

            fileMetaDataMock.setup(x => x.path).returns(() => '/home/MyUser/Music/track.mp3');

            externalArtworkPathGetterMock.setup(
                x => x.getExternalArtworkPath('/home/MyUser/Music/track.mp3')
            ).returns(() => '');

            // Act
            const actualArtwork: Buffer = await externalAlbumArtworkGetter.getExternalArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualArtwork, undefined);
        });

        it('Should return undefined if fileMetaData is not undefined and external artwork path is space', async () => {
            // Arrange
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            const externalArtworkPathGetterMock: IMock<ExternalArtworkPathGetter> = Mock.ofType<ExternalArtworkPathGetter>();
            const imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const externalAlbumArtworkGetter: ExternalAlbumArtworkGetter = new ExternalAlbumArtworkGetter(
                externalArtworkPathGetterMock.object,
                imageProcessorMock.object,
                loggerMock.object);

            fileMetaDataMock.setup(x => x.path).returns(() => '/home/MyUser/Music/track.mp3');

            externalArtworkPathGetterMock.setup(
                x => x.getExternalArtworkPath('/home/MyUser/Music/track.mp3')
            ).returns(() => '  ');

            // Act
            const actualArtwork: Buffer = await externalAlbumArtworkGetter.getExternalArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualArtwork, undefined);
        });

        it('Should return external artwork if fileMetaData is not undefined and an external artwork path was found', async () => {
            // Arrange
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            const externalArtworkPathGetterMock: IMock<ExternalArtworkPathGetter> = Mock.ofType<ExternalArtworkPathGetter>();
            const imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const externalAlbumArtworkGetter: ExternalAlbumArtworkGetter = new ExternalAlbumArtworkGetter(
                externalArtworkPathGetterMock.object,
                imageProcessorMock.object,
                loggerMock.object);

            const expectedArtwork = Buffer.from([1, 2, 3]);
            fileMetaDataMock.setup(x => x.path).returns(() => '/home/MyUser/Music/track.mp3');

            externalArtworkPathGetterMock.setup(
                x => x.getExternalArtworkPath('/home/MyUser/Music/track.mp3')
            ).returns(() => '/home/MyUser/Music/front.png');

            imageProcessorMock.setup(
                x => x.convertLocalImageToBufferAsync('/home/MyUser/Music/front.png')
                ).returns(async () => expectedArtwork);

            // Act
            const actualArtwork: Buffer = await externalAlbumArtworkGetter.getExternalArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualArtwork, expectedArtwork);
        });
    });
});
