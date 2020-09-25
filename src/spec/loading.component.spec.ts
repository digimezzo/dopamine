import * as assert from 'assert';
import { Times } from 'typemoq';
import { LoadingComponentMock } from './mocking/loading-component-mock';

describe('LoadingComponent', () => {
    describe('ngOnInit', () => {
        it('Should perform database migrations', async () => {
            // Arrange
            const mock: LoadingComponentMock = new LoadingComponentMock(false);

            // Act
            await mock.loadingComponent.ngOnInit();

            // Assert
            mock.databaseMigratorMock.verify(x => x.migrateAsync(), Times.exactly(1));
        });

        it('Should navigate to welcome if welcome should be shown', async () => {
            // Arrange
            const mock: LoadingComponentMock = new LoadingComponentMock(true);

            // Act
            await mock.loadingComponent.ngOnInit();

            // Assert
            mock.routerMock.verify(x => x.navigate(['/welcome']), Times.exactly(1));
        });

        it('Should navigate to main if welcome should not be shown', async () => {
            // Arrange
            const mock: LoadingComponentMock = new LoadingComponentMock(false);

            // Act
            await mock.loadingComponent.ngOnInit();

            // Assert
            mock.routerMock.verify(x => x.navigate(['/main']), Times.exactly(1));
        });

        it('Should prevent showing the welcome screen on a next start', async () => {
            // Arrange
            const mock: LoadingComponentMock = new LoadingComponentMock(false);

            // Act
            await mock.loadingComponent.ngOnInit();

            // Assert
            assert.strictEqual(mock.settingsMock.showWelcome, false);
        });
    });
});
