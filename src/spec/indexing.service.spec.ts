import * as assert from 'assert';
import { Times } from 'typemoq';
import { IndexingServiceMocker } from './mocking/indexing-service-mocker';

describe('IndexingService', () => {
    describe('indexCollectionIfOutdatedAsync', () => {
        it('Should not check if indexing is needed if automatic indexing is disabled', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(false);

            mocker.collectionCheckerMock.setup(x => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.collectionCheckerMock.verify(x => x.isCollectionOutdatedAsync(), Times.never());
        });

        it('Should check if indexing is needed if automatic indexing is enabled', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            mocker.collectionCheckerMock.setup(x => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.collectionCheckerMock.verify(x => x.isCollectionOutdatedAsync(), Times.exactly(1));
        });

        it('Should not index artwork if automatic indexing is disabled', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(false);

            mocker.collectionCheckerMock.setup(x => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.never());
        });

        it('Should index artwork if automatic indexing is enabled', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            mocker.collectionCheckerMock.setup(x => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should index the tracks if needed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            mocker.collectionCheckerMock.setup(x => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.trackIndexerMock.verify(x => x.indexTracksAsync(), Times.exactly(1));
        });

        it('Should not index the tracks if not needed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            mocker.collectionCheckerMock.setup(x => x.isCollectionOutdatedAsync()).returns(async () => false);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.trackIndexerMock.verify(x => x.indexTracksAsync(), Times.never());
        });

        it('Should index album artwork when tracks need indexing', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            mocker.collectionCheckerMock.setup(x => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should index album artwork even when tracks no not need indexing', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            mocker.collectionCheckerMock.setup(x => x.isCollectionOutdatedAsync()).returns(async () => false);

            // Act
            await mocker.indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });

    describe('indexCollectionIfFoldersHaveChangedAsync', () => {
        it('Should index the tracks if the folders have changed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);
            mocker.indexingService.foldersHaveChanged = true;

            // Act
            await mocker.indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            mocker.trackIndexerMock.verify(x => x.indexTracksAsync(), Times.exactly(1));
        });

        it('Should index album artwork if the folders have changed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);
            mocker.indexingService.foldersHaveChanged = true;

            // Act
            await mocker.indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should not index the tracks if the folders have not changed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);
            mocker.indexingService.foldersHaveChanged = false;

            // Act
            await mocker.indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            mocker.trackIndexerMock.verify(x => x.indexTracksAsync(), Times.never());
        });

        it('Should not index album artwork if the folders have not changed', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);
            mocker.indexingService.foldersHaveChanged = false;

            // Act
            await mocker.indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.never());
        });

        it('Should set foldersHaveChanged to false', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);
            mocker.indexingService.foldersHaveChanged = true;

            // Act
            await mocker.indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            assert.strictEqual(mocker.indexingService.foldersHaveChanged, false);
        });
    });

    describe('indexCollectionAlwaysAsync', () => {
        it('Should index the tracks', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            // Act
            await mocker.indexingService.indexCollectionAlwaysAsync();

            // Assert
            mocker.trackIndexerMock.verify(x => x.indexTracksAsync(), Times.exactly(1));
        });

        it('Should index album artwork', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            // Act
            await mocker.indexingService.indexCollectionAlwaysAsync();

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });

    describe('indexAlbumArtworkOnlyAsync', () => {
        it('Should enable album artwork indexing based on onlyWhenHasNoCover when onlyWhenHasNoCover is true', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            // Act
            await mocker.indexingService.indexAlbumArtworkOnlyAsync(true);

            // Assert
            mocker.trackRepositoryMock.verify(x => x.enableNeedsAlbumArtworkIndexingForAllTracks(true), Times.exactly(1));
        });

        it('Should enable album artwork indexing based on onlyWhenHasNoCover when onlyWhenHasNoCover is false', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            // Act
            await mocker.indexingService.indexAlbumArtworkOnlyAsync(false);

            // Assert
            mocker.trackRepositoryMock.verify(x => x.enableNeedsAlbumArtworkIndexingForAllTracks(false), Times.exactly(1));
        });

        it('Should index album artwork when onlyWhenHasNoCover is true', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            // Act
            await mocker.indexingService.indexAlbumArtworkOnlyAsync(true);

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should index album artwork when onlyWhenHasNoCover is false', async () => {
            // Arrange
            const mocker: IndexingServiceMocker = new IndexingServiceMocker(true);

            // Act
            await mocker.indexingService.indexAlbumArtworkOnlyAsync(false);

            // Assert
            mocker.albumArtworkIndexerMock.verify(x => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });
});
