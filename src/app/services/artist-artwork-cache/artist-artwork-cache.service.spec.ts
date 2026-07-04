import { IMock, Mock, Times } from 'typemoq';
import { Constants } from '../../common/application/constants';
import { GuidFactory } from '../../common/guid.factory';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { ArtistArtworkCacheId } from './artist-artwork-cache-id';
import { ArtistArtworkCacheIdFactory } from './artist-artwork-cache-id-factory';
import { ArtistArtworkCacheService } from './artist-artwork-cache.service';
import { FileAccessBase } from '../../common/io/file-access.base';
import { ApplicationPaths } from '../../common/application/application-paths';

const cachePath: string = '/home/user/.config/Dopamine/Cache/ArtistArt';
const cachedArtworkFilePath: string = `${cachePath}/Dummy.jpg`;

describe('ArtistArtworkCacheService', () => {
    let artistArtworkCacheIdFactoryMock: IMock<ArtistArtworkCacheIdFactory>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let fileAccessMock: IMock<FileAccessBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let loggerMock: IMock<Logger>;
    let service: ArtistArtworkCacheService;
    let guidFactoryMock: IMock<GuidFactory>;

    beforeEach(() => {
        artistArtworkCacheIdFactoryMock = Mock.ofType<ArtistArtworkCacheIdFactory>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        loggerMock = Mock.ofType<Logger>();
        guidFactoryMock = Mock.ofType<GuidFactory>();

        service = new ArtistArtworkCacheService(
            artistArtworkCacheIdFactoryMock.object,
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
            applicationPathsMock.setup((x) => x.artistArtCacheFullPath()).returns(() => cachePath);

            // Act
            service = new ArtistArtworkCacheService(
                artistArtworkCacheIdFactoryMock.object,
                imageProcessorMock.object,
                fileAccessMock.object,
                applicationPathsMock.object,
                loggerMock.object,
            );

            // Assert
            fileAccessMock.verify(
                (x) => x.createFullDirectoryPathIfDoesNotExist(cachePath),
                Times.exactly(1),
            );
        });
    });

    describe('addArtworkDataToCacheAsync', () => {
        it('should return undefined when the data is undefined', async () => {
            // Arrange

            // Act
            const artistArtworkCacheId: ArtistArtworkCacheId | undefined = await service.addArtworkDataToCacheAsync(undefined);

            // Assert
            expect(artistArtworkCacheId).toBeUndefined();
        });
        it('should return undefined when the data is empty', async () => {
            // Arrange
            const imageBuffer = Buffer.alloc(0);

            // Act
            const artistArtworkCacheId: ArtistArtworkCacheId | undefined = await service.addArtworkDataToCacheAsync(imageBuffer);

            // Assert
            expect(artistArtworkCacheId).toBeUndefined();
        });

        it('should return a valid ArtistArtworkCacheId when the data is not empty', async () => {
            // Arrange
            const artistArtworkCacheIdToCreate: ArtistArtworkCacheId = new ArtistArtworkCacheId(guidFactoryMock.object);
            artistArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => artistArtworkCacheIdToCreate);
            applicationPathsMock.setup((x) => x.artistArtCacheFullPath()).returns(() => '/home/user/Dopamine/Cache/ArtistArt');

            const imageBuffer = Buffer.from([1, 2, 3]);

            // Act
            const artistArtworkCacheIdToReturn: ArtistArtworkCacheId | undefined = await service.addArtworkDataToCacheAsync(imageBuffer);

            // Assert
            expect(artistArtworkCacheIdToCreate.id).toEqual(artistArtworkCacheIdToReturn!.id);
        });

        it('should save thumbnail to file when the data is not empty', async () => {
            // Arrange
            const imageBuffer = Buffer.from([1, 2, 3]);
            const resizedImageBuffer = Buffer.from([4, 5, 6]);
            const artistArtworkCacheIdToCreate: ArtistArtworkCacheId = new ArtistArtworkCacheId(guidFactoryMock.object);
            artistArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => artistArtworkCacheIdToCreate);
            applicationPathsMock.setup((x) => x.artistArtFullPath(artistArtworkCacheIdToCreate.id)).returns(() => cachedArtworkFilePath);
            imageProcessorMock
                .setup((x) =>
                    x.toResizedJpegBufferAsync(
                        imageBuffer,
                        Constants.cachedArtworkMaximumSize,
                        Constants.cachedArtworkMaximumSize,
                        Constants.cachedArtworkJpegQuality,
                    ),
                )
                .returns(() => Promise.resolve(resizedImageBuffer));

            // Act
            await service.addArtworkDataToCacheAsync(imageBuffer);

            // Assert
            imageProcessorMock.verify((x) => x.convertImageBufferToFileAsync(resizedImageBuffer, cachedArtworkFilePath), Times.once());
        });

        it('should not save an empty image on disk', async () => {
            // Arrange
            const imageBuffer = Constants.emptyImageBuffer;
            const artistArtworkCacheIdToCreate: ArtistArtworkCacheId = new ArtistArtworkCacheId();
            artistArtworkCacheIdFactoryMock
                .setup((x) => x.createDefault())
                .returns(() => artistArtworkCacheIdToCreate);

            // Act
            await service.addArtworkDataToCacheAsync(imageBuffer);

            // Assert
            imageProcessorMock.verify((x) => x.convertImageBufferToFileAsync(imageBuffer, cachedArtworkFilePath), Times.never());
        });

        it('should return the default id for an empty image', async () => {
            // Arrange
            const imageBuffer = Constants.emptyImageBuffer;
            const expectedArtworkId: ArtistArtworkCacheId = new ArtistArtworkCacheId();
            artistArtworkCacheIdFactoryMock.setup((x) => x.createDefault()).returns(() => expectedArtworkId);

            // Act
            const actualArtworkId = await service.addArtworkDataToCacheAsync(imageBuffer);

            // Assert
            expect(actualArtworkId).toEqual(expectedArtworkId);
            artistArtworkCacheIdFactoryMock.verify((x) => x.createDefault(), Times.once());
        });
    });

    describe('removeArtworkDataFromCache', () => {
        it('should delete cached artwork file if it exists', async () => {
            // Arrange
            const artistArtworkCacheIdToCreate: ArtistArtworkCacheId = new ArtistArtworkCacheId(guidFactoryMock.object);
            artistArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => artistArtworkCacheIdToCreate);
            applicationPathsMock.setup((x) => x.artistArtFullPath(artistArtworkCacheIdToCreate.id)).returns(() => cachedArtworkFilePath);

            // Act
            await service.removeArtworkDataFromCacheAsync(artistArtworkCacheIdToCreate.id);

            // Assert
            fileAccessMock.verify((x) => x.deleteFileIfExistsAsync(cachedArtworkFilePath), Times.exactly(1));
        });
    });
});
