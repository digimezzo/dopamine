import { IMock, Mock, Times } from 'typemoq';
import { CollectionIndexer } from '../app/services/indexing/collection-indexer';
import { TrackRemover } from '../app/services/indexing/track-remover';
import { TrackUpdater } from '../app/services/indexing/track-updater';

describe('CollectionIndexer', () => {
    describe('indexCollectionAsync', () => {
        it('Should remove tracks which are not part of a collection folder', () => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object
            );

            // Act
            collectionIndexer.indexCollectionAsync();

            // Assert
            trackRemoverMock.verify(x => x.removeTracksThatDoNoNotBelongToFolders(), Times.exactly(1));
        });

        it('Should remove tracks which are not found on disk', () => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object
            );

            // Act
            collectionIndexer.indexCollectionAsync();

            // Assert
            trackRemoverMock.verify(x => x.removeTracksThatAreNotFoundOnDisk(), Times.exactly(1));
        });

        it('Should update tracks which are out of date', () => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object
            );

            // Act
            collectionIndexer.indexCollectionAsync();

            // Assert
            trackUpdaterMock.verify(x => x.updateTracksThatAreOutOfDate(), Times.exactly(1));
        });
    });
});
