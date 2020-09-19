import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../app/core/logger';
import { BaseAlbumArtworkRepository } from '../app/data/repositories/base-album-artwork-repository';
import { AlbumArtworkRemover } from '../app/services/indexing/album-artwork-remover';

describe('AlbumArtworkRemover', () => {
    describe('removeAlbumArtworkForAlbumKey', () => {
        it('Should remove album artwork from the database for the geiven album key', () => {
            // Arrange
            const artworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkRemover: AlbumArtworkRemover = new AlbumArtworkRemover(artworkRepositoryMock.object, loggerMock.object);

            // Act
            albumArtworkRemover.tryRemoveAlbumArtwork('Dummy AlbumKey');

            // Assert
            artworkRepositoryMock.verify(x => x.deleteAlbumArtwork('Dummy AlbumKey'), Times.exactly(1));
        });
    });
});
