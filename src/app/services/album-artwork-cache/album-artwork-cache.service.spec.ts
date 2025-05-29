import { IMock, Mock, Times } from 'typemoq';
import { Constants } from '../../common/application/constants';
import { GuidFactory } from '../../common/guid.factory';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { AlbumArtworkCacheIdFactory } from './album-artwork-cache-id-factory';
import { AlbumArtworkCacheService } from './album-artwork-cache.service';
import { FileAccessBase } from '../../common/io/file-access.base';
import { ApplicationPaths } from '../../common/application/application-paths';

describe('AlbumArtworkCacheService', () => {
    let albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let fileAccessMock: IMock<FileAccessBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let loggerMock: IMock<Logger>;
    let service: AlbumArtworkCacheService;
    let guidFactoryMock: IMock<GuidFactory>;

    beforeEach(() => {
        albumArtworkCacheIdFactoryMock = Mock.ofType<AlbumArtworkCacheIdFactory>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        loggerMock = Mock.ofType<Logger>();
        guidFactoryMock = Mock.ofType<GuidFactory>();

        service = new AlbumArtworkCacheService(
            albumArtworkCacheIdFactoryMock.object,
            imageProcessorMock.object,
            fileAccessMock.object,
            applicationPathsMock.object,
            loggerMock.object,
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            expect(service).toBeDefined();
        });

        it('should create the full directory path to the artwork cache if it does not exist', () => {
            // Arrange
            applicationPathsMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');

            // Act
            service = new AlbumArtworkCacheService(
                albumArtworkCacheIdFactoryMock.object,
                imageProcessorMock.object,
                fileAccessMock.object,
                applicationPathsMock.object,
                loggerMock.object,
            );

            // Assert
            fileAccessMock.verify(
                (x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/.config/Dopamine/Cache/CoverArt'),
                Times.exactly(1),
            );
        });
    });

    describe('addArtworkDataToCacheAsync', () => {
        it('should return undefined when the data is undefined', async () => {
            // Arrange

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId | undefined = await service.addArtworkDataToCacheAsync(undefined);

            // Assert
            expect(albumArtworkCacheId).toBeUndefined();
        });
        it('should return undefined when the data is empty', async () => {
            // Arrange
            const imageBuffer = Buffer.alloc(0);

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId | undefined = await service.addArtworkDataToCacheAsync(imageBuffer);

            // Assert
            expect(albumArtworkCacheId).toBeUndefined();
        });

        it('should return a valid AlbumArtworkCacheId when the data is not empty', async () => {
            // Arrange
            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId(guidFactoryMock.object);
            albumArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => albumArtworkCacheIdToCreate);
            applicationPathsMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/Dopamine/Cache/CoverArt');

            const imageBuffer = Buffer.from([1, 2, 3]);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId | undefined = await service.addArtworkDataToCacheAsync(imageBuffer);

            // Assert
            expect(albumArtworkCacheIdToCreate.id).toEqual(albumArtworkCacheIdToReturn!.id);
        });

        it('should save thumbnail to file when the data is not empty', async () => {
            // Arrange
            const imageBuffer = Buffer.from([1, 2, 3]);
            const resizedImageBuffer = Buffer.from([4, 5, 6]);
            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId(guidFactoryMock.object);
            const cachedArtworkFilePath: string = '/home/user/Dopamine/Cache/CoverArt/Dummy.jpg';
            albumArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => albumArtworkCacheIdToCreate);
            applicationPathsMock.setup((x) => x.coverArtFullPath(albumArtworkCacheIdToCreate.id)).returns(() => cachedArtworkFilePath);
            imageProcessorMock
                .setup((x) =>
                    x.toResizedJpegBufferAsync(
                        imageBuffer,
                        Constants.cachedCoverArtMaximumSize,
                        Constants.cachedCoverArtMaximumSize,
                        Constants.cachedCoverArtJpegQuality,
                    ),
                )
                .returns(() => Promise.resolve(resizedImageBuffer));

            // Act
            await service.addArtworkDataToCacheAsync(imageBuffer);

            // Assert
            imageProcessorMock.verify((x) => x.convertImageBufferToFileAsync(resizedImageBuffer, cachedArtworkFilePath), Times.once());
        });
    });

    describe('removeArtworkDataFromCache', () => {
        it('should delete cached artwork file if it exists', async () => {
            // Arrange
            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId(guidFactoryMock.object);
            const cachedArtworkFilePath: string = '/home/user/Dopamine/Cache/CoverArt/Dummy.jpg';
            albumArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => albumArtworkCacheIdToCreate);
            applicationPathsMock.setup((x) => x.coverArtFullPath(albumArtworkCacheIdToCreate.id)).returns(() => cachedArtworkFilePath);

            // Act
            await service.removeArtworkDataFromCacheAsync(albumArtworkCacheIdToCreate.id);

            // Assert
            fileAccessMock.verify((x) => x.deleteFileIfExistsAsync(cachedArtworkFilePath), Times.exactly(1));
        });
    });
});
