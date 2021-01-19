import * as assert from 'assert';
import * as path from 'path';
import { IMock, Mock, Times } from 'typemoq';
import { ImageProcessor } from '../../core/image-processor';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory';
import { AlbumArtworkCacheService } from './album-artwork-cache.service';

describe('AlbumArtworkCacheService', () => {
    let albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let fileSystemMock: IMock<FileSystem>;
    let loggerMock: IMock<Logger>;
    let service: AlbumArtworkCacheService;

    beforeEach(() => {
        albumArtworkCacheIdFactoryMock = Mock.ofType<AlbumArtworkCacheIdFactory>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        fileSystemMock = Mock.ofType<FileSystem>();
        loggerMock = Mock.ofType<Logger>();
        service = new AlbumArtworkCacheService(
            albumArtworkCacheIdFactoryMock.object,
            imageProcessorMock.object,
            fileSystemMock.object,
            loggerMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            assert.ok(service);
        });

        it('should create the full directory path to the artwork cache if it does not exist', () => {
            // Arrange
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');

            // Act
            service = new AlbumArtworkCacheService(
                albumArtworkCacheIdFactoryMock.object,
                imageProcessorMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            // Assert
            fileSystemMock.verify(
                (x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/.config/Dopamine/Cache/CoverArt'),
                Times.exactly(1)
            );
        });
    });

    describe('addArtworkDataToCacheAsync', () => {
        it('should return undefined when the data is undefined', async () => {
            // Arrange

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await service.addArtworkDataToCacheAsync(undefined);

            // Assert
            assert.strictEqual(albumArtworkCacheId, undefined);
        });
        it('should return undefined when the data is empty', async () => {
            // Arrange
            const data = Buffer.alloc(0);

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await service.addArtworkDataToCacheAsync(data);

            // Assert
            assert.strictEqual(albumArtworkCacheId, undefined);
        });

        it('should return a valid AlbumArtworkCacheId when the data is not empty', async () => {
            // Arrange
            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId();
            albumArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => albumArtworkCacheIdToCreate);
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/Dopamine/Cache/CoverArt');

            const data = Buffer.from([1, 2, 3]);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId = await service.addArtworkDataToCacheAsync(data);

            // Assert
            assert.strictEqual(albumArtworkCacheIdToCreate.id, albumArtworkCacheIdToReturn.id);
        });

        it('should save data to file when the data is not empty', async () => {
            // Arrange
            albumArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => albumArtworkCacheIdToCreate);
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/Dopamine/Cache/CoverArt');

            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId();

            const data = Buffer.from([1, 2, 3]);

            const imagePath = path.join(fileSystemMock.object.coverArtCacheFullPath(), `${albumArtworkCacheIdToCreate.id}.jpg`);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId = await service.addArtworkDataToCacheAsync(data);

            // Assert
            imageProcessorMock.verify((x) => x.convertImageBufferToFileAsync(data, imagePath), Times.exactly(1));
        });
    });

    describe('removeArtworkDataFromCache', () => {
        it('should delete cached artwork file if it exists', async () => {
            // Arrange
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            const cachedArtworkFilePath: string = path.join(
                fileSystemMock.object.coverArtCacheFullPath(),
                'album-4c315456-43ba-4984-8a7e-403837514638.jpg'
            );

            // Act
            await service.removeArtworkDataFromCacheAsync('album-4c315456-43ba-4984-8a7e-403837514638');

            // Assert
            fileSystemMock.verify((x) => x.deleteFileIfExistsAsync(cachedArtworkFilePath), Times.exactly(1));
        });
    });
});
