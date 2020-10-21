import { Times } from 'typemoq';
import { CollectionComponentMocker } from './mocking/collection-component-mocker';

describe('CollectionComponent', () => {
    describe('ngOnInit', () => {
        it('Should check for updates', async () => {
            // Arrange
            const mocker: CollectionComponentMocker = new CollectionComponentMocker();

            // Act
            await mocker.collectionComponent.ngOnInit();

            // Assert
            mocker.updateServiceMock.verify(x => x.checkForUpdatesAsync(), Times.exactly(1));
        });

        it('Should wait 2 seconds before triggering indexing', async () => {
            // Arrange
            const mocker: CollectionComponentMocker = new CollectionComponentMocker();

            // Act
            await mocker.collectionComponent.ngOnInit();

            // Assert
            mocker.schedulerMock.verify(x => x.sleepAsync(2000), Times.exactly(1));
        });

        it('Should trigger indexing', async () => {
            // Arrange
            const mocker: CollectionComponentMocker = new CollectionComponentMocker();

            // Act
            await mocker.collectionComponent.ngOnInit();

            // Assert
            mocker.indexingServiceMock.verify(x => x.indexCollectionIfNeededAsync(), Times.exactly(1));
        });
    });
});
