import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../app/core/logger';
import { BaseAlbumArtworkRepository } from '../app/data/repositories/base-album-artwork-repository';
import { BaseAlbumArtworkCacheService } from '../app/services/album-artwork-cache/base-album-artwork-cache.service';
import { AlbumArtworkRemover } from '../app/services/indexing/album-artwork-remover';

describe('AlbumArtworkRemover', () => {
    describe('tryRemoveAlbumArtwork', () => {
        it('Should get artworkId from the database for the given album key', () => {
            // Arrange
            const artworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const albumArtworkRemover: AlbumArtworkRemover = new AlbumArtworkRemover(
                artworkRepositoryMock.object,
                loggerMock.object,
                albumArtworkCacheServiceMock.object);

            // Act
            albumArtworkRemover.tryRemoveAlbumArtwork('Dummy AlbumKey');

            // Assert
            artworkRepositoryMock.verify(x => x.getArtworkId('Dummy AlbumKey'), Times.exactly(1));
        });
        
        it('Should remove album artwork from the database for the given album key', () => {
            // Arrange
            const artworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const albumArtworkRemover: AlbumArtworkRemover = new AlbumArtworkRemover(
                artworkRepositoryMock.object,
                loggerMock.object,
                albumArtworkCacheServiceMock.object);

            // Act
            albumArtworkRemover.tryRemoveAlbumArtwork('Dummy AlbumKey');

            // Assert
            artworkRepositoryMock.verify(x => x.deleteAlbumArtwork('Dummy AlbumKey'), Times.exactly(1));
        });

        it('Should remove album artwork from the cache for the given album key', () => {
            // Arrange
            const artworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
            const albumArtworkRemover: AlbumArtworkRemover = new AlbumArtworkRemover(
                artworkRepositoryMock.object,
                loggerMock.object,
                albumArtworkCacheServiceMock.object);

            artworkRepositoryMock.setup(x => x.getArtworkId('Dummy AlbumKey')).returns(() => 'album-4c315456-43ba-4984-8a7e-403837514638');

            // Act
            albumArtworkRemover.tryRemoveAlbumArtwork('Dummy AlbumKey');

            // Assert
            albumArtworkCacheServiceMock.verify(x => x.removeArtworkDataFromCache('album-4c315456-43ba-4984-8a7e-403837514638'), Times.exactly(1));
        });
    });
});
