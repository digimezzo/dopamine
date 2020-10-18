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

        it('Should wait 2 seconds before triggering indexing', async () => {
            // Arrange
            const mocker: MainComponentMocker = new MainComponentMocker();

            // Act
            await mocker.mainComponent.ngOnInit();

            // Assert
            mocker.schedulerMock.verify(x => x.sleepAsync(2000), Times.exactly(1));
        });

        it('Should trigger indexing', async () => {
            // Arrange
            const mocker: MainComponentMocker = new MainComponentMocker();

            // Act
            await mocker.mainComponent.ngOnInit();

            // Assert
            mocker.indexingServiceMock.verify(x => x.indexCollectionIfNeededAsync(), Times.exactly(1));
        });
    });
});
