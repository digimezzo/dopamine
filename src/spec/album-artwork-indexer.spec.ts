import { IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../app/core/logger';
import { AlbumData } from '../app/data/album-data';
import { TrackRepository } from '../app/data/repositories/track-repository';
import { AlbumArtworkAdder } from '../app/services/indexing/album-artwork-adder';
import { AlbumArtworkIndexer } from '../app/services/indexing/album-artwork-indexer';
import { AlbumArtworkRemover } from '../app/services/indexing/album-artwork-remover';

describe('AlbumArtworkIndexer', () => {
    describe('indexAlbumArtworkAsync', () => {
        it('Should get the album data that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRemoverMock: IMock<AlbumArtworkRemover> = Mock.ofType<AlbumArtworkRemover>();
            const albumArtworkAdderMock: IMock<AlbumArtworkAdder> = Mock.ofType<AlbumArtworkAdder>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRemoverMock.object,
                albumArtworkAdderMock.object,
                loggerMock.object
            );

            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            trackRepositoryMock.verify(x => x.getAlbumDataThatNeedsIndexing(), Times.exactly(1));
        });

        it('Should not remove album artwork if there is no album data that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRemoverMock: IMock<AlbumArtworkRemover> = Mock.ofType<AlbumArtworkRemover>();
            const albumArtworkAdderMock: IMock<AlbumArtworkAdder> = Mock.ofType<AlbumArtworkAdder>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRemoverMock.object,
                albumArtworkAdderMock.object,
                loggerMock.object
            );

            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRemoverMock.verify(x => x.removeAlbumArtwork(It.isAnyString()), Times.never());
        });

        it('Should not add album artwork if there is no album data that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRemoverMock: IMock<AlbumArtworkRemover> = Mock.ofType<AlbumArtworkRemover>();
            const albumArtworkAdderMock: IMock<AlbumArtworkAdder> = Mock.ofType<AlbumArtworkAdder>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRemoverMock.object,
                albumArtworkAdderMock.object,
                loggerMock.object
            );

            trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkAdderMock.verify(x => x.addAlbumArtworkAsync(It.isAnyString()), Times.never());
        });

        it('Should remove album artwork if there is album data that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRemoverMock: IMock<AlbumArtworkRemover> = Mock.ofType<AlbumArtworkRemover>();
            const albumArtworkAdderMock: IMock<AlbumArtworkAdder> = Mock.ofType<AlbumArtworkAdder>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRemoverMock.object,
                albumArtworkAdderMock.object,
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
            albumArtworkRemoverMock.verify(x => x.removeAlbumArtwork(It.isAnyString()), Times.exactly(2));
            albumArtworkRemoverMock.verify(x => x.removeAlbumArtwork(albumData1.albumKey), Times.exactly(1));
            albumArtworkRemoverMock.verify(x => x.removeAlbumArtwork(albumData2.albumKey), Times.exactly(1));
        });

        it('Should add album artwork if there is album data that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const albumArtworkRemoverMock: IMock<AlbumArtworkRemover> = Mock.ofType<AlbumArtworkRemover>();
            const albumArtworkAdderMock: IMock<AlbumArtworkAdder> = Mock.ofType<AlbumArtworkAdder>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const albumArtworkIndexer: AlbumArtworkIndexer = new AlbumArtworkIndexer(
                trackRepositoryMock.object,
                albumArtworkRemoverMock.object,
                albumArtworkAdderMock.object,
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
            albumArtworkAdderMock.verify(x => x.addAlbumArtworkAsync(It.isAnyString()), Times.exactly(2));
            albumArtworkAdderMock.verify(x => x.addAlbumArtworkAsync(albumData1.albumKey), Times.exactly(1));
            albumArtworkAdderMock.verify(x => x.addAlbumArtworkAsync(albumData2.albumKey), Times.exactly(1));
        });
    });
});
