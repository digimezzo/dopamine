import { IMock, Mock, Times } from 'typemoq';
import { FolderServiceMock } from '../../../spec/mocking/folder-service-mock';
import { Logger } from '../../core/logger';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { CollectionChecker } from './collection-checker';
import { IndexingService } from './indexing.service';
import { TrackIndexer } from './track-indexer';

describe('IndexingService', () => {
    let collectionCheckerMock: IMock<CollectionChecker>;
    let trackIndexerMock: IMock<TrackIndexer>;
    let albumArtworkIndexerMock: IMock<AlbumArtworkIndexer>;
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let folderServiceMock: FolderServiceMock;
    let loggerMock: IMock<Logger>;
    let indexingService: IndexingService;

    beforeEach(() => {
        collectionCheckerMock = Mock.ofType<CollectionChecker>();
        trackIndexerMock = Mock.ofType<TrackIndexer>();
        albumArtworkIndexerMock = Mock.ofType<AlbumArtworkIndexer>();
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        folderServiceMock = new FolderServiceMock();
        loggerMock = Mock.ofType<Logger>();
        indexingService = new IndexingService(
            collectionCheckerMock.object,
            trackIndexerMock.object,
            albumArtworkIndexerMock.object,
            trackRepositoryMock.object,
            folderServiceMock,
            loggerMock.object
        );
    });

    describe('indexCollectionIfOutdatedAsync', () => {
        it('should check if the collection is out of date', async () => {
            // Arrange
            collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            collectionCheckerMock.verify((x) => x.isCollectionOutdatedAsync(), Times.exactly(1));
        });

        it('should index the tracks if the collection is out of date', async () => {
            // Arrange
            collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.exactly(1));
        });

        it('should not index the tracks if the collection is not out of date', async () => {
            // Arrange
            collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => false);

            // Act
            await indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.never());
        });

        it('should index album artwork if the collection is out of date', async () => {
            // Arrange
            collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should index album artwork if the collection is not out of date', async () => {
            // Arrange
            collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => false);

            // Act
            await indexingService.indexCollectionIfOutdatedAsync();

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });

    describe('indexCollectionIfFoldersHaveChangedAsync', () => {
        it('should index the tracks if the folders have changed', async () => {
            // Arrange
            folderServiceMock.onFoldersChanged();

            // Act
            await indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.exactly(1));
        });

        it('should index album artwork if the folders have changed', async () => {
            // Arrange
            folderServiceMock.onFoldersChanged();

            // Act
            await indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should not index the tracks if the folders have not changed', async () => {
            // Arrange

            // Act
            await indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.never());
        });

        it('should not index album artwork if the folders have not changed', async () => {
            // Arrange

            // Act
            await indexingService.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.never());
        });
    });

    describe('indexCollectionAlwaysAsync', () => {
        it('should index the tracks', async () => {
            // Arrange

            // Act
            await indexingService.indexCollectionAlwaysAsync();

            // Assert
            trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.exactly(1));
        });

        it('should index album artwork', async () => {
            // Arrange

            // Act
            await indexingService.indexCollectionAlwaysAsync();

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });

    describe('indexAlbumArtworkOnlyAsync', () => {
        it('should enable album artwork indexing based on onlyWhenHasNoCover when onlyWhenHasNoCover is true', async () => {
            // Arrange

            // Act
            await indexingService.indexAlbumArtworkOnlyAsync(true);

            // Assert
            trackRepositoryMock.verify((x) => x.enableNeedsAlbumArtworkIndexingForAllTracks(true), Times.exactly(1));
        });

        it('should enable album artwork indexing based on onlyWhenHasNoCover when onlyWhenHasNoCover is false', async () => {
            // Arrange

            // Act
            await indexingService.indexAlbumArtworkOnlyAsync(false);

            // Assert
            trackRepositoryMock.verify((x) => x.enableNeedsAlbumArtworkIndexingForAllTracks(false), Times.exactly(1));
        });

        it('should index album artwork when onlyWhenHasNoCover is true', async () => {
            // Arrange

            // Act
            await indexingService.indexAlbumArtworkOnlyAsync(true);

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should index album artwork when onlyWhenHasNoCover is false', async () => {
            // Arrange

            // Act
            await indexingService.indexAlbumArtworkOnlyAsync(false);

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });
    });
});
