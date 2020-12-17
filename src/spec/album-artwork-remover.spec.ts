// import { IMock, Mock, Times } from 'typemoq';
// import { Logger } from '../app/core/logger';
// import { BaseAlbumArtworkRepository } from '../app/data/repositories/base-album-artwork-repository';
// import { AlbumArtworkRemover } from '../app/services/indexing/album-artwork-remover';

import { Times } from 'typemoq';
import { AlbumArtworkRemoverMocker } from './mocking/album-artwork-remover-mocker';

describe('AlbumArtworkRemover', () => {
    describe('removeAlbumArtworkThatHasNoTrack', () => {
        it('Should delete album artwork that has no track from the database', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            mocker.albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtworkThatHasNoTrack(), Times.exactly(1));
        });
    });

    describe('removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing', () => {
        it('Should delete album artwork for tracks that need album artwork indexing from the database', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            // Assert
            mocker.albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(), Times.exactly(1));
        });
    });
    //         it('Should get artworkId from the database for the given album key', () => {
    //             // Arrange
    //             const artworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
    //             const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    //             const albumArtworkRemover: AlbumArtworkRemover = new AlbumArtworkRemover(
    //                 artworkRepositoryMock.object,
    //                 loggerMock.object);

    //             // Act
    //             albumArtworkRemover.tryRemoveAlbumArtwork('Dummy AlbumKey');

    //             // Assert
    //             artworkRepositoryMock.verify(x => x.getArtworkId('Dummy AlbumKey'), Times.exactly(1));
    //         });

    //         it('Should remove album artwork from the database for the given album key', () => {
    //             // Arrange
    //             const artworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
    //             const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    //             const albumArtworkRemover: AlbumArtworkRemover = new AlbumArtworkRemover(
    //                 artworkRepositoryMock.object,
    //                 loggerMock.object);

    //             // Act
    //             albumArtworkRemover.tryRemoveAlbumArtwork('Dummy AlbumKey');

    //             // Assert
    //             artworkRepositoryMock.verify(x => x.deleteAlbumArtwork('Dummy AlbumKey'), Times.exactly(1));
    //         });
});
