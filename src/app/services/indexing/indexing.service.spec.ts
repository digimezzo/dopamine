import { Subscription } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { Logger } from '../../common/logger';
import { FolderServiceMock } from '../folder/folder-service-mock';
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
    let service: IndexingService;

    beforeEach(() => {
        collectionCheckerMock = Mock.ofType<CollectionChecker>();
        trackIndexerMock = Mock.ofType<TrackIndexer>();
        albumArtworkIndexerMock = Mock.ofType<AlbumArtworkIndexer>();
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        folderServiceMock = new FolderServiceMock();
        loggerMock = Mock.ofType<Logger>();
        service = new IndexingService(
            collectionCheckerMock.object,
            trackIndexerMock.object,
            albumArtworkIndexerMock.object,
            trackRepositoryMock.object,
            folderServiceMock,
            loggerMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });

        it('should define indexingFinished$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.indexingFinished$).toBeDefined();
        });
    });

    describe('indexCollectionIfOutdatedAsync', () => {
        it('should check if the collection is out of date', async () => {
            // Arrange
            collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await service.indexCollectionIfOutdatedAsync();

            // Assert
            collectionCheckerMock.verify((x) => x.isCollectionOutdatedAsync(), Times.exactly(1));
        });

        it('should index the tracks if the collection is out of date', async () => {
            // Arrange
            collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await service.indexCollectionIfOutdatedAsync();

            // Assert
            trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.exactly(1));
        });

        it('should not index the tracks if the collection is not out of date', async () => {
            // Arrange
            collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => false);

            // Act
            await service.indexCollectionIfOutdatedAsync();

            // Assert
            trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.never());
        });

        it('should index album artwork if the collection is out of date', async () => {
            // Arrange
            collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => true);

            // Act
            await service.indexCollectionIfOutdatedAsync();

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should index album artwork if the collection is not out of date', async () => {
            // Arrange
            collectionCheckerMock.setup((x) => x.isCollectionOutdatedAsync()).returns(async () => false);

            // Act
            await service.indexCollectionIfOutdatedAsync();

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should notify that indexing is finished', async () => {
            // Arrange
            let indexingIsFinished: boolean = false;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.indexingFinished$.subscribe(() => {
                    indexingIsFinished = true;
                })
            );

            // Act
            await service.indexCollectionIfOutdatedAsync();

            // Assert
            expect(indexingIsFinished).toBeTruthy();
        });
    });

    describe('indexCollectionIfFoldersHaveChangedAsync', () => {
        it('should index the tracks if the folders have changed', async () => {
            // Arrange
            folderServiceMock.onFoldersChanged();

            // Act
            await service.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.exactly(1));
        });

        it('should index album artwork if the folders have changed', async () => {
            // Arrange
            folderServiceMock.onFoldersChanged();

            // Act
            await service.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should not index the tracks if the folders have not changed', async () => {
            // Arrange

            // Act
            await service.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.never());
        });

        it('should not index album artwork if the folders have not changed', async () => {
            // Arrange

            // Act
            await service.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.never());
        });

        it('should notify that indexing is finished if the folders have changed', async () => {
            // Arrange
            folderServiceMock.onFoldersChanged();

            let indexingIsFinished: boolean = false;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.indexingFinished$.subscribe(() => {
                    indexingIsFinished = true;
                })
            );

            // Act
            await service.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            expect(indexingIsFinished).toBeTruthy();
        });

        it('should not notify that indexing is finished if the folders have not changed', async () => {
            // Arrange
            let indexingIsFinished: boolean = false;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.indexingFinished$.subscribe(() => {
                    indexingIsFinished = true;
                })
            );

            // Act
            await service.indexCollectionIfFoldersHaveChangedAsync();

            // Assert
            expect(indexingIsFinished).toBeFalsy();
        });
    });

    describe('indexCollectionAlwaysAsync', () => {
        it('should index the tracks', async () => {
            // Arrange

            // Act
            await service.indexCollectionAlwaysAsync();

            // Assert
            trackIndexerMock.verify((x) => x.indexTracksAsync(), Times.exactly(1));
        });

        it('should index album artwork', async () => {
            // Arrange

            // Act
            await service.indexCollectionAlwaysAsync();

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should notify that indexing is finished', async () => {
            // Arrange
            let indexingIsFinished: boolean = false;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.indexingFinished$.subscribe(() => {
                    indexingIsFinished = true;
                })
            );

            // Act
            await service.indexCollectionAlwaysAsync();

            // Assert
            expect(indexingIsFinished).toBeTruthy();
        });
    });

    describe('indexAlbumArtworkOnlyAsync', () => {
        it('should enable album artwork indexing based on onlyWhenHasNoCover when onlyWhenHasNoCover is true', async () => {
            // Arrange

            // Act
            await service.indexAlbumArtworkOnlyAsync(true);

            // Assert
            trackRepositoryMock.verify((x) => x.enableNeedsAlbumArtworkIndexingForAllTracks(true), Times.exactly(1));
        });

        it('should enable album artwork indexing based on onlyWhenHasNoCover when onlyWhenHasNoCover is false', async () => {
            // Arrange

            // Act
            await service.indexAlbumArtworkOnlyAsync(false);

            // Assert
            trackRepositoryMock.verify((x) => x.enableNeedsAlbumArtworkIndexingForAllTracks(false), Times.exactly(1));
        });

        it('should index album artwork when onlyWhenHasNoCover is true', async () => {
            // Arrange

            // Act
            await service.indexAlbumArtworkOnlyAsync(true);

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should index album artwork when onlyWhenHasNoCover is false', async () => {
            // Arrange

            // Act
            await service.indexAlbumArtworkOnlyAsync(false);

            // Assert
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should notify that indexing is finished', async () => {
            // Arrange
            let indexingIsFinished: boolean = false;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.indexingFinished$.subscribe(() => {
                    indexingIsFinished = true;
                })
            );

            // Act
            await service.indexAlbumArtworkOnlyAsync(false);

            // Assert
            expect(indexingIsFinished).toBeTruthy();
        });
    });
});
