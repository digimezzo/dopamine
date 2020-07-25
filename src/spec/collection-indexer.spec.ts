import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { TrackRemover } from '../app/services/indexing/track-remover';
import { CollectionIndexer } from '../app/services/indexing/collection-indexer';

describe('CollectionIndexer', () => {
    describe('indexCollectionAsync', () => {
        it('Should remove tracks which are not part of a collection folder', () => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(trackRemoverMock.object);

            // Act
            collectionIndexer.indexCollectionAsync();

            // Assert
            trackRemoverMock.verify(x => x.removeTracksThatDoNoNotBelongToFolders(), Times.exactly(1));
        });

        it('Should remove tracks which are not found on disk', () => {
             // Arrange
             const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
             const collectionIndexer: CollectionIndexer = new CollectionIndexer(trackRemoverMock.object);

             // Act
             collectionIndexer.indexCollectionAsync();

             // Assert
             trackRemoverMock.verify(x => x.removeTracksThatAreNotFoundOnDisk(), Times.exactly(1));
        });
    });
});
