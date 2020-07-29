import { IMock, Mock, Times } from 'typemoq';
import { CollectionIndexer } from '../app/services/indexing/collection-indexer';
import { TrackAdder } from '../app/services/indexing/track-adder';
import { TrackRemover } from '../app/services/indexing/track-remover';
import { TrackUpdater } from '../app/services/indexing/track-updater';

describe('CollectionIndexer', () => {
    describe('indexCollectionAsync', () => {
        it('Should remove tracks that are not part of a collection folder', async() => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object,
                trackAdderMock.object
            );

            // Act
            await collectionIndexer.indexCollectionAsync();

            // Assert
            trackRemoverMock.verify(x => x.removeTracksThatDoNoNotBelongToFolders(), Times.exactly(1));
        });

        it('Should remove tracks that are not found on disk', async() => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object,
                trackAdderMock.object
            );

            // Act
            await collectionIndexer.indexCollectionAsync();

            // Assert
            trackRemoverMock.verify(x => x.removeTracksThatAreNotFoundOnDisk(), Times.exactly(1));
        });

        it('Should remove orphaned folderTracks', async() => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object,
                trackAdderMock.object
            );

            // Act
            await collectionIndexer.indexCollectionAsync();

            // Assert
            trackRemoverMock.verify(x => x.removeOrphanedFolderTracks(), Times.exactly(1));
        });

        it('Should update tracks that are out of date', async() => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object,
                trackAdderMock.object
            );

            // Act
            await collectionIndexer.indexCollectionAsync();

            // Assert
            trackUpdaterMock.verify(x => x.updateTracksThatAreOutOfDateAsync(), Times.exactly(1));
        });

        it('Should add tracks that are not in the database', async() => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
            const collectionIndexer: CollectionIndexer = new CollectionIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object,
                trackAdderMock.object
            );

            // Act
            await collectionIndexer.indexCollectionAsync();

            // Assert
            trackAdderMock.verify(x => x.addTracksThatAreNotInTheDatabaseAsync(), Times.exactly(1));
        });
    });
});
