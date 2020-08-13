import * as assert from 'assert';
import * as path from 'path';
import { IMock, Mock, Times } from 'typemoq';
import { ImageProcessor } from '../app/core/image-processor';
import { FileSystem } from '../app/core/io/file-system';
import { Logger } from '../app/core/logger';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkCacheIdFactory } from '../app/services/album-artwork-cache/album-artwork-cache-id-factory';
import { AlbumArtworkCacheService } from '../app/services/album-artwork-cache/album-artwork-cache.service';

describe('AlbumArtworkCacheService', () => {
    describe('constructor', () => {
        it('Should create the full directory path to the artwork cache if it does not exist', async () => {
            // Arrange
            const albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory> = Mock.ofType<AlbumArtworkCacheIdFactory>();
            const imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');

            // Act
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                albumArtworkCacheIdFactoryMock.object,
                imageProcessorMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            // Assert
            fileSystemMock.verify(
                x => x.createFullDirectoryPathIfDoesNotExist('/home/user/.config/Dopamine/Cache/CoverArt'),
                Times.exactly(1)
            );
        });
    });

    describe('addArtworkDataToCacheAsync', () => {
        it('Should return null when the data is null', async () => {
            // Arrange
            const albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory> = Mock.ofType<AlbumArtworkCacheIdFactory>();
            const imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                albumArtworkCacheIdFactoryMock.object,
                imageProcessorMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(null);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return null when the data is undefined', async () => {
            // Arrange
            const albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory> = Mock.ofType<AlbumArtworkCacheIdFactory>();
            const imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                albumArtworkCacheIdFactoryMock.object,
                imageProcessorMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(undefined);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return null when the data is empty', async () => {
            // Arrange
            const albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory> = Mock.ofType<AlbumArtworkCacheIdFactory>();
            const imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                albumArtworkCacheIdFactoryMock.object,
                imageProcessorMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const data = Buffer.alloc(0);

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return a valid AlbumArtworkCacheId when the data is not empty', async () => {
            // Arrange
            const albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory> = Mock.ofType<AlbumArtworkCacheIdFactory>();
            const imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId();
            albumArtworkCacheIdFactoryMock.setup(x => x.create()).returns(() => albumArtworkCacheIdToCreate);
            fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/Dopamine/Cache/CoverArt');

            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                albumArtworkCacheIdFactoryMock.object,
                imageProcessorMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const data = Buffer.from([1, 2, 3]);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            assert.strictEqual(albumArtworkCacheIdToCreate.id, albumArtworkCacheIdToReturn.id);
        });

        it('Should save data to file when the data is not empty', async () => {
            // Arrange
            const albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory> = Mock.ofType<AlbumArtworkCacheIdFactory>();
            const imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId();
            albumArtworkCacheIdFactoryMock.setup(x => x.create()).returns(() => albumArtworkCacheIdToCreate);
            fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/Dopamine/Cache/CoverArt');

            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                albumArtworkCacheIdFactoryMock.object,
                imageProcessorMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const data = Buffer.from([1, 2, 3]);

            const imagePath = path.join(fileSystemMock.object.coverArtCacheFullPath(), `${albumArtworkCacheIdToCreate.id}.jpg`);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            imageProcessorMock.verify(x => x.saveDataToFile(data, imagePath), Times.exactly(1));
        });
    });
});
