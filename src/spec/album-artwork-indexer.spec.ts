import { It, Times } from 'typemoq';
import { AlbumData } from '../app/data/album-data';
import { AlbumArtworkIndexerMock } from './mocking/album-artwork-indexer-mock';

describe('AlbumArtworkIndexer', () => {
    describe('indexAlbumArtworkAsync', () => {
        it('Should get the album data that needs indexing', async () => {
            // Arrange
            const mock: AlbumArtworkIndexerMock = new AlbumArtworkIndexerMock();

            mock.trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await mock.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mock.trackRepositoryMock.verify(x => x.getAlbumDataThatNeedsIndexing(), Times.exactly(1));
        });

        it('Should not remove album artwork if there is no album data that needs indexing', async () => {
            // Arrange
            const mock: AlbumArtworkIndexerMock = new AlbumArtworkIndexerMock();

            mock.trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await mock.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mock.albumArtworkRemoverMock.verify(x => x.tryRemoveAlbumArtwork(It.isAnyString()), Times.never());
        });

        it('Should not add album artwork if there is no album data that needs indexing', async () => {
            // Arrange
            const mock: AlbumArtworkIndexerMock = new AlbumArtworkIndexerMock();

            mock.trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await mock.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mock.albumArtworkAdderMock.verify(x => x.addAlbumArtworkAsync(It.isAnyString()), Times.never());
        });

        it('Should remove album artwork if there is album data that needs indexing', async () => {
            // Arrange
            const mock: AlbumArtworkIndexerMock = new AlbumArtworkIndexerMock();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = ';AlbumTitle1;;AlbumArtist1;';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = ';AlbumTitle2;;AlbumArtist2;';

            mock.trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);

            // Act
            await mock.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mock.albumArtworkRemoverMock.verify(x => x.tryRemoveAlbumArtwork(It.isAnyString()), Times.exactly(2));
            mock.albumArtworkRemoverMock.verify(x => x.tryRemoveAlbumArtwork(albumData1.albumKey), Times.exactly(1));
            mock.albumArtworkRemoverMock.verify(x => x.tryRemoveAlbumArtwork(albumData2.albumKey), Times.exactly(1));
        });

        it('Should not add album artwork if removing album artwork failed', async () => {
            // Arrange
            const mock: AlbumArtworkIndexerMock = new AlbumArtworkIndexerMock();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = ';AlbumTitle1;;AlbumArtist1;';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = ';AlbumTitle2;;AlbumArtist2;';

            mock.trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);
            mock.albumArtworkRemoverMock.setup(x => x.tryRemoveAlbumArtwork(It.isAnyString())).returns(() => false);

            // Act
            await mock.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mock.albumArtworkAdderMock.verify(x => x.addAlbumArtworkAsync(It.isAnyString()), Times.never());
        });

        it('Should add album artwork if removing album artwork succeeded', async () => {
            // Arrange
            const mock: AlbumArtworkIndexerMock = new AlbumArtworkIndexerMock();

            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = ';AlbumTitle1;;AlbumArtist1;';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = ';AlbumTitle2;;AlbumArtist2;';

            mock.trackRepositoryMock.setup(x => x.getAlbumDataThatNeedsIndexing()).returns(() => [albumData1, albumData2]);
            mock.albumArtworkRemoverMock.setup(x => x.tryRemoveAlbumArtwork(It.isAnyString())).returns(() => true);

            // Act
            await mock.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mock.albumArtworkAdderMock.verify(x => x.addAlbumArtworkAsync(It.isAnyString()), Times.exactly(2));
            mock.albumArtworkAdderMock.verify(x => x.addAlbumArtworkAsync(albumData1.albumKey), Times.exactly(1));
            mock.albumArtworkAdderMock.verify(x => x.addAlbumArtworkAsync(albumData2.albumKey), Times.exactly(1));
        });
    });
});
