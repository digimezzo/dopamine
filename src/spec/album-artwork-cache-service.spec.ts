import * as assert from 'assert';
import * as path from 'path';
import { Times } from 'typemoq';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkCacheServiceMock } from './mocking/album-artwork-cache-service-mock';

describe('AlbumArtworkCacheService', () => {
    describe('constructor', () => {
        it('Should create the full directory path to the artwork cache if it does not exist', async () => {
            // Arrange
            const mock: AlbumArtworkCacheServiceMock = new AlbumArtworkCacheServiceMock();

            mock.fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');

            // Act
           mock.callAlbumArtworkCacheServiceConstructor();

            // Assert
            mock.fileSystemMock.verify(
                x => x.createFullDirectoryPathIfDoesNotExist('/home/user/.config/Dopamine/Cache/CoverArt'),
                Times.exactly(1)
            );
        });
    });

    describe('addArtworkDataToCacheAsync', () => {
        it('Should return null when the data is null', async () => {
            // Arrange
            const mock: AlbumArtworkCacheServiceMock = new AlbumArtworkCacheServiceMock();

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await mock.albumArtworkCacheService.addArtworkDataToCacheAsync(null);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return null when the data is undefined', async () => {
            // Arrange
            const mock: AlbumArtworkCacheServiceMock = new AlbumArtworkCacheServiceMock();


            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await mock.albumArtworkCacheService.addArtworkDataToCacheAsync(undefined);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return null when the data is empty', async () => {
            // Arrange
            const mock: AlbumArtworkCacheServiceMock = new AlbumArtworkCacheServiceMock();

            const data = Buffer.alloc(0);

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await mock.albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return a valid AlbumArtworkCacheId when the data is not empty', async () => {
            // Arrange
            const mock: AlbumArtworkCacheServiceMock = new AlbumArtworkCacheServiceMock();

            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId();
            mock.albumArtworkCacheIdFactoryMock.setup(x => x.create()).returns(() => albumArtworkCacheIdToCreate);
            mock.fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/Dopamine/Cache/CoverArt');

            const data = Buffer.from([1, 2, 3]);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId = await mock.albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            assert.strictEqual(albumArtworkCacheIdToCreate.id, albumArtworkCacheIdToReturn.id);
        });

        it('Should save data to file when the data is not empty', async () => {
            // Arrange
            const mock: AlbumArtworkCacheServiceMock = new AlbumArtworkCacheServiceMock();

            mock.albumArtworkCacheIdFactoryMock.setup(x => x.create()).returns(() => albumArtworkCacheIdToCreate);
            mock.fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/Dopamine/Cache/CoverArt');

            const albumArtworkCacheIdToCreate: AlbumArtworkCacheId = new AlbumArtworkCacheId();

            const data = Buffer.from([1, 2, 3]);

            const imagePath = path.join(mock.fileSystemMock.object.coverArtCacheFullPath(), `${albumArtworkCacheIdToCreate.id}.jpg`);

            // Act
            const albumArtworkCacheIdToReturn: AlbumArtworkCacheId = await mock.albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            mock.imageProcessorMock.verify(x => x.saveDataToFile(data, imagePath), Times.exactly(1));
        });
    });
});
