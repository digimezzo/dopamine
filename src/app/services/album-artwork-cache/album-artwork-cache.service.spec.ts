import { IMock, Mock, Times } from 'typemoq';
import { ImageProcessor } from '../../common/image-processor';
import { BaseFileSystem } from '../../common/io/base-file-system';
import { Logger } from '../../common/logger';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory';
import { AlbumArtworkCacheService } from './album-artwork-cache.service';

describe('AlbumArtworkCacheService', () => {
    let albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let fileSystemMock: IMock<BaseFileSystem>;
    let loggerMock: IMock<Logger>;
    let service: AlbumArtworkCacheService;

    beforeEach(() => {
        albumArtworkCacheIdFactoryMock = Mock.ofType<AlbumArtworkCacheIdFactory>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        fileSystemMock = Mock.ofType<BaseFileSystem>();
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
            expect(service).toBeDefined();
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
            expect(albumArtworkCacheId).toBeUndefined();
        });
        it('should return undefined when the data is empty', async () => {
            // Arrange
            const data = Buffer.alloc(0);

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await service.addArtworkDataToCacheAsync(data);

            // Assert
            expect(albumArtworkCacheId).toBeUndefined();
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
            expect(albumArtworkCacheIdToCreate.id).toEqual(albumArtworkCacheIdToReturn.id);
        });

        it('should save data to file when the data is not empty', async () => {
            // Arrange
            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId();
            const imagePath: string = '/home/user/Dopamine/Cache/CoverArt/Dummy.jpg';
            albumArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => albumArtworkCacheIdToCreate);
            fileSystemMock.setup((x) => x.coverArtFullPath(albumArtworkCacheIdToCreate.id)).returns(() => imagePath);

            const data = Buffer.from([1, 2, 3]);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId = await service.addArtworkDataToCacheAsync(data);

            // Assert
            imageProcessorMock.verify((x) => x.convertImageBufferToFileAsync(data, imagePath), Times.exactly(1));
        });
    });

    describe('removeArtworkDataFromCache', () => {
        it('should delete cached artwork file if it exists', async () => {
            // Arrange
            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId();
            const imagePath: string = '/home/user/Dopamine/Cache/CoverArt/Dummy.jpg';
            albumArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => albumArtworkCacheIdToCreate);
            fileSystemMock.setup((x) => x.coverArtFullPath(albumArtworkCacheIdToCreate.id)).returns(() => imagePath);

            // Act
            await service.removeArtworkDataFromCacheAsync(albumArtworkCacheIdToCreate.id);

            // Assert
            fileSystemMock.verify((x) => x.deleteFileIfExistsAsync(imagePath), Times.exactly(1));
        });
    });
});
