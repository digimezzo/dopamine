import { Times } from 'typemoq';
import { AlbumArtworkIndexerMocker } from './mocking/album-artwork-indexer-mocker';

describe('AlbumArtworkIndexer', () => {
    describe('indexAlbumArtworkAsync', () => {
        it('Should remove artwork that has no track', async () => {
            // Arrange
            const mocker: AlbumArtworkIndexerMocker = new AlbumArtworkIndexerMocker();

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await mocker.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mocker.albumArtworkRemoverMock.verify((x) => x.removeAlbumArtworkThatHasNoTrack(), Times.exactly(1));
        });

        it('Should remove artwork for tracks that need album artwork indexing', async () => {
            // Arrange
            const mocker: AlbumArtworkIndexerMocker = new AlbumArtworkIndexerMocker();

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await mocker.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mocker.albumArtworkRemoverMock.verify((x) => x.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(), Times.exactly(1));
        });

        it('Should add artwork for tracks that need album artwork indexing', async () => {
            // Arrange
            const mocker: AlbumArtworkIndexerMocker = new AlbumArtworkIndexerMocker();

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await mocker.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mocker.albumArtworkAdderMock.verify((x) => x.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(), Times.exactly(1));
        });

        it('Should remove artwork that is not in the database from disk', async () => {
            // Arrange
            const mocker: AlbumArtworkIndexerMocker = new AlbumArtworkIndexerMocker();

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await mocker.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mocker.albumArtworkRemoverMock.verify((x) => x.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync(), Times.exactly(1));
        });

        it('Should dismiss the indexing notification with a short delay', async () => {
            // Arrange
            const mocker: AlbumArtworkIndexerMocker = new AlbumArtworkIndexerMocker();

            mocker.trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await mocker.albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            mocker.snackBarServiceMock.verify((x) => x.dismissDelayedAsync(), Times.exactly(1));
        });
    });
});
