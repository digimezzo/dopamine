import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { FileSystem } from '../app/core/io/file-system';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkCacheService } from '../app/services/album-artwork-cache/album-artwork-cache.service';

describe('AlbumArtworkCacheService', () => {
    describe('constructor', () => {
        it('Should create the full directory path to the artwork cache if it does not exist', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');

            // Act
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                fileSystemMock.object
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
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                fileSystemMock.object
            );

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(null);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return null when the data is undefined', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                fileSystemMock.object
            );

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(undefined);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return null when the data is empty', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                fileSystemMock.object
            );

            const data = Buffer.alloc(0);

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return a valid AlbumArtworkCacheId when the data is not empty', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService(
                fileSystemMock.object
            );

            const data = Buffer.from([1, 2, 3]);

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            assert.notStrictEqual(albumArtworkCacheId, null);
        });
    });
});
