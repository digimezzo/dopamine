import * as path from 'path';
import { IMock, Mock, Times } from 'typemoq';
import { ImageProcessor } from '../../core/image-processor';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory';
import { AlbumArtworkCacheService } from './album-artwork-cache.service';

describe('AlbumArtworkCacheService', () => {
    let albumArtworkRepositoryMock: IMock<BaseAlbumArtworkRepository>;
    let albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let fileSystemMock: IMock<FileSystem>;
    let loggerMock: IMock<Logger>;
    let service: AlbumArtworkCacheService;

    beforeEach(() => {
        albumArtworkRepositoryMock = Mock.ofType<BaseAlbumArtworkRepository>();
        albumArtworkCacheIdFactoryMock = Mock.ofType<AlbumArtworkCacheIdFactory>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        fileSystemMock = Mock.ofType<FileSystem>();
        loggerMock = Mock.ofType<Logger>();
        service = new AlbumArtworkCacheService(
            albumArtworkRepositoryMock.object,
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
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');

            // Act
            service = new AlbumArtworkCacheService(
                albumArtworkRepositoryMock.object,
                albumArtworkCacheIdFactoryMock.object,
                imageProcessorMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            // Assert
            fileSystemMock.verify(
                (x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/.config/dopameme/Cache/CoverArt'),
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
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/dopameme/Cache/CoverArt');

            const data = Buffer.from([1, 2, 3]);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId = await service.addArtworkDataToCacheAsync(data);

            // Assert
            expect(albumArtworkCacheIdToCreate.id).toEqual(albumArtworkCacheIdToReturn.id);
        });

        it('should save data to file when the data is not empty', async () => {
            // Arrange
            albumArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => albumArtworkCacheIdToCreate);
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/dopameme/Cache/CoverArt');

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
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');
            const expectedCachedArtworkFilePath: string = path.join(
                fileSystemMock.object.coverArtCacheFullPath(),
                'album-4c315456-43ba-4984-8a7e-403837514638.jpg'
            );

            // Act
            await service.removeArtworkDataFromCacheAsync('album-4c315456-43ba-4984-8a7e-403837514638');

            // Assert
            fileSystemMock.verify((x) => x.deleteFileIfExistsAsync(expectedCachedArtworkFilePath), Times.exactly(1));
        });
    });

    describe('getCachedArtworkFilePathAsync', () => {
        it('should return an empty path if no artworkId is found in the database', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getArtworkId('myAlbumKey')).returns(() => undefined);
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');

            // Act
            const cachedArtworkFilePath: string = service.getCachedArtworkFilePathAsync('myAlbumKey');

            // Assert
            expect(cachedArtworkFilePath).toEqual('');
        });

        it('should return the cached artwork file path if no artworkId is found in the database', async () => {
            // Arrange
            albumArtworkRepositoryMock
                .setup((x) => x.getArtworkId('myAlbumKey'))
                .returns(() => 'album-4c315456-43ba-4984-8a7e-403837514638');
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');
            const expectedCachedArtworkFilePath: string = path.join(
                fileSystemMock.object.coverArtCacheFullPath(),
                'album-4c315456-43ba-4984-8a7e-403837514638.jpg'
            );

            // Act
            const cachedArtworkFilePath: string = service.getCachedArtworkFilePathAsync('myAlbumKey');

            // Assert
            expect(cachedArtworkFilePath).toEqual(expectedCachedArtworkFilePath);
        });
    });
});
