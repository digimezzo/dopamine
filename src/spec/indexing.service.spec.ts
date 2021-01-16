import { Times } from 'typemoq';
import { IndexingServiceMocker } from './mocking/indexing-service-mocker';

describe('IndexingService', () => {
    describe('indexCollectionIfOutdatedAsync', () => {
        it('should check if the collection is out of date', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();
            mocker.collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.collectionCheckerMock.verify((x) => x.isCollectionOutdatedAsync(), Times.exactly(1));
        });

        it('should index the tracks if the collection is out of date', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            mocker.collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.exactly(1));
        });

        it('should not index the tracks if the collection is not out of date', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            mocker.collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => false);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.never());
        });

        it('should index album artwork if the collection is out of date', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            mocker.collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should index album artwork if the collection is not out of date', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            mocker.collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => false);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });

    describe('indexCollectionIfFoldersHaveChangedAsync', () => {
        it('should index the tracks if the folders have changed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();
            mocker.folderServiceMock.onFoldersChanged();

            // Act
            await mocker.indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            mocker.trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.exactly(1));
        });

        it('should index album artwork if the folders have changed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();
            mocker.folderServiceMock.onFoldersChanged();

            // Act
            await mocker.indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should not index the tracks if the folders have not changed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            // Act
            await mocker.indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            mocker.trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.never());
        });

        it('should not index album artwork if the folders have not changed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            // Act
            await mocker.indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.never());
        });
    });

    describe('indexCollectionAlwaysAsync', () => {
        it('should index the tracks', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            // Act
            await mocker.indexingService.indexCollectionAlwaysAsync();

            // Assert
            mocker.trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.exactly(1));
        });

        it('should index album artwork', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            // Act
            await mocker.indexingService.indexCollectionAlwaysAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });

    describe('indexAlbumArtworkOnlyAsync', () => {
        it('should enable album artwork indexing based on onlyWhenHasNoCover when onlyWhenHasNoCover is true', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            // Act
            await mocker.indexingService.indexAlbumArtworkOnlyAsync(true);

            // Assert
            mocker.trackRepositoryMock.verify((x) => x.enableNeedsAlbumArtworkIndexingForAllTracks(true), Times.exactly(1));
        });

        it('should enable album artwork indexing based on onlyWhenHasNoCover when onlyWhenHasNoCover is false', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            // Act
            await mocker.indexingService.indexAlbumArtworkOnlyAsync(false);

            // Assert
            mocker.trackRepositoryMock.verify((x) => x.enableNeedsAlbumArtworkIndexingForAllTracks(false), Times.exactly(1));
        });

        it('should index album artwork when onlyWhenHasNoCover is true', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            // Act
            await mocker.indexingService.indexAlbumArtworkOnlyAsync(true);

            // Assert
            mocker.albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should index album artwork when onlyWhenHasNoCover is false', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker();

            // Act
            await mocker.indexingService.indexAlbumArtworkOnlyAsync(false);

            // Assert
            mocker.albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });
});
