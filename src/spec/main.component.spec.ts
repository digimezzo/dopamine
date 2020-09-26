import { Times } from 'typemoq';
import { MainComponentMocker } from './mocking/main-component-mocker';

describe('MainComponent', () => {
    describe('ngOnInit', () => {
        it('Should check for updates', async () => {
            // Arrange
            const mocker: MainComponentMocker = new MainComponentMocker();

            // Act
            await mocker.mainComponent.ngOnInit();

            // Assert
            mocker.updateServiceMock.verify(x => x.checkForUpdatesAsync(), Times.exactly(1));
        });

        it('Should start indexing', async () => {
            // Arrange
            const mocker: MainComponentMocker = new MainComponentMocker();

            // Act
            await mocker.mainComponent.ngOnInit();

            // Assert
            mocker.indexingServiceMock.verify(x => x.indexCollectionIfNeededAsync(), Times.exactly(1));
        });
    });
});
