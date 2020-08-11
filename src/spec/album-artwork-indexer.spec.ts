import { IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../app/core/logger';
import { AlbumData } from '../app/data/album-data';
import { AlbumArtworkRepository } from '../app/data/repositories/album-artwork-repository';
import { TrackRepository } from '../app/data/repositories/track-repository';
import { AlbumArtworkIndexer } from '../app/services/indexing/album-artwork-indexer';

describe('AlbumArtworkIndexer', () => {
    describe('indexAlbumArtworkAsync', () => {
        it('Should get the albumData that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                loggerMock.object
            );

            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            trackRepositoryMock.verify(x => x.getAlbumDataThatNeedsIndexing(), Times.exactly(1));
        });

        it('Should not delete any artwork if there is no albumData that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                loggerMock.object
            );

            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtwork(It.isAnyString()), Times.never());
        });

        it('Should delete artwork for all albumData that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRepositoryMock: IMock<AlbumArtworkRepository> = Mock.ofType<AlbumArtworkRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRepositoryMock.object,
                loggerMock.object
            );

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = ';AlbumTitle1;;AlbumArtist1;';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = ';AlbumTitle2;;AlbumArtist2;';

            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtwork(It.isAnyString()), Times.exactly(2));
            albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtwork(albumData1.albumKey), Times.exactly(1));
            albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtwork(albumData2.albumKey), Times.exactly(1));
        });
    });
});
