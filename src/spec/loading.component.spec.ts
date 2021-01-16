import * as assert from 'assert';
import { Times } from 'typemoq';
import { LoadingComponentMocker } from './mocking/loading-component-mocker';

describe('LoadingComponent', () => {
    describe('ngOnInit', () => {
        it('should perform database migrations', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(false, false);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            mocker.databaseMigratorMock.verify((x) => x.migrateAsync(), Times.exactly(1));
        });

        it('should navigate to welcome if welcome should be shown', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(true, false);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            mocker.navigationServiceMock.verify((x) => x.navigateToWelcome(), Times.exactly(1));
        });

        it('should navigate to collection if welcome should not be shown', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(false, false);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            mocker.navigationServiceMock.verify((x) => x.navigateToCollection(), Times.exactly(1));
        });

        it('should prevent showing the welcome screen on a next start', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(false, false);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            assert.strictEqual(mocker.settingsStub.showWelcome, false);
        });

        it('should check for updates when navigating to collection', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(false, false);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            mocker.updateServiceMock.verify((x) => x.checkForUpdatesAsync(), Times.exactly(1));
        });

        it('should wait 2 seconds before triggering indexing when navigating to collection', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(false, false);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            mocker.schedulerMock.verify((x) => x.sleepAsync(2000), Times.exactly(1));
        });

        it('should trigger indexing when navigating to collection and refresh collection automatically is enabled', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(false, true);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            mocker.indexingServiceMock.verify((x) => x.indexCollectionIfOutdatedAsync(), Times.exactly(1));
        });

        it('should not trigger indexing when navigating to collection and refresh collection automatically is disabled', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(false, false);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            mocker.indexingServiceMock.verify((x) => x.indexCollectionIfOutdatedAsync(), Times.never());
        });
    });
});
