import * as assert from 'assert';
import * as path from 'path';
import { Times } from 'typemoq';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkCacheServiceMocker } from './mocking/album-artwork-cache-service-mocker';

describe('AlbumArtworkCacheService', () => {
    describe('constructor', () => {
        it('Should create the full directory path to the artwork cache if it does not exist', async () => {
            // Arrange
            const mocker: AlbumArtworkCacheServiceMocker = new AlbumArtworkCacheServiceMocker();

            mocker.fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');

            // Act
            mocker.callAlbumArtworkCacheServiceConstructor();

            // Assert
            mocker.fileSystemMock.verify(
                (x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/.config/Dopamine/Cache/CoverArt'),
                Times.exactly(1)
            );
        });
    });

    describe('addArtworkDataToCacheAsync', () => {
        it('Should return undefined when the data is undefined', async () => {
            // Arrange
            const mocker: AlbumArtworkCacheServiceMocker = new AlbumArtworkCacheServiceMocker();

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await mocker.albumArtworkCacheService.addArtworkDataToCacheAsync(undefined);

            // Assert
            assert.strictEqual(albumArtworkCacheId, undefined);
        });
        it('Should return undefined when the data is empty', async () => {
            // Arrange
            const mocker: AlbumArtworkCacheServiceMocker = new AlbumArtworkCacheServiceMocker();

            const data = Buffer.alloc(0);

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await mocker.albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            assert.strictEqual(albumArtworkCacheId, undefined);
        });

        it('Should return a valid AlbumArtworkCacheId when the data is not empty', async () => {
            // Arrange
            const mocker: AlbumArtworkCacheServiceMocker = new AlbumArtworkCacheServiceMocker();

            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId();
            mocker.albumArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => albumArtworkCacheIdToCreate);
            mocker.fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/Dopamine/Cache/CoverArt');

            const data = Buffer.from([1, 2, 3]);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId = await mocker.albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            assert.strictEqual(albumArtworkCacheIdToCreate.id, albumArtworkCacheIdToReturn.id);
        });

        it('Should save data to file when the data is not empty', async () => {
            // Arrange
            const mocker: AlbumArtworkCacheServiceMocker = new AlbumArtworkCacheServiceMocker();

            mocker.albumArtworkCacheIdFactoryMock.setup((x) => x.create()).returns(() => albumArtworkCacheIdToCreate);
            mocker.fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/Dopamine/Cache/CoverArt');

            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId();

            const data = Buffer.from([1, 2, 3]);

            const imagePath = path.join(mocker.fileSystemMock.object.coverArtCacheFullPath(), `${albumArtworkCacheIdToCreate.id}.jpg`);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId = await mocker.albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            mocker.imageProcessorMock.verify((x) => x.convertImageBufferToFileAsync(data, imagePath), Times.exactly(1));
        });
    });

    describe('removeArtworkDataFromCache', () => {
        it('Should delete cached artwork file if it exists', async () => {
            // Arrange
            const mocker: AlbumArtworkCacheServiceMocker = new AlbumArtworkCacheServiceMocker();

            mocker.fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            const cachedArtworkFilePath: string = path.join(
                mocker.fileSystemMock.object.coverArtCacheFullPath(),
                'album-4c315456-43ba-4984-8a7e-403837514638.jpg'
            );

            // Act
            await mocker.albumArtworkCacheService.removeArtworkDataFromCacheAsync('album-4c315456-43ba-4984-8a7e-403837514638');

            // Assert
            mocker.fileSystemMock.verify((x) => x.deleteFileIfExistsAsync(cachedArtworkFilePath), Times.exactly(1));
        });
    });
});
