import * as assert from 'assert';
import { Times } from 'typemoq';
import { LoadingComponentMocker } from './mocking/loading-component-mocker';

describe('LoadingComponent', () => {
    describe('ngOnInit', () => {
        it('Should perform database migrations', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(false);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            mocker.databaseMigratorMock.verify(x => x.migrateAsync(), Times.exactly(1));
        });

        it('Should navigate to welcome if welcome should be shown', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(true);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            mocker.routerMock.verify(x => x.navigate(['/welcome']), Times.exactly(1));
        });

        it('Should navigate to main if welcome should not be shown', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(false);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            mocker.routerMock.verify(x => x.navigate(['/main']), Times.exactly(1));
        });

        it('Should prevent showing the welcome screen on a next start', async () => {
            // Arrange
            const mocker: LoadingComponentMocker = new LoadingComponentMocker(false);

            // Act
            await mocker.loadingComponent.ngOnInit();

            // Assert
            assert.strictEqual(mocker.settingsMock.showWelcome, false);
        });
    });
});
