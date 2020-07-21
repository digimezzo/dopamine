import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { Router } from '@angular/router';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';
import { LoadingComponent } from '../../app/components/loading/loading.component';
import { BaseDatabaseMigrator } from '../../app/data/base-database-migrator';
import { SettingsMock } from '../mocking/settings-mock';

describe('LoadingComponent', () => {
    describe('ngOnInit', () => {
        it('Should perform database migrations', async () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const databaseMigratorMock: IMock<BaseDatabaseMigrator> = Mock.ofType<BaseDatabaseMigrator>();
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const settingsMock: SettingsMock = new SettingsMock(false);

            const loadingComponent: LoadingComponent = new LoadingComponent(
                routerMock.object,
                databaseMigratorMock.object,
                appearanceServiceMock.object,
                settingsMock);

            // Act
            await loadingComponent.ngOnInit();

            // Assert
            databaseMigratorMock.verify(x => x.migrateAsync(), Times.exactly(1));
        });

        it('Should navigate to welcome if welcome should be shown', async () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const databaseMigratorMock: IMock<BaseDatabaseMigrator> = Mock.ofType<BaseDatabaseMigrator>();
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const settingsMock: SettingsMock = new SettingsMock(true);

            const loadingComponent: LoadingComponent = new LoadingComponent(
                routerMock.object,
                databaseMigratorMock.object,
                appearanceServiceMock.object,
                settingsMock);

            // Act
            await loadingComponent.ngOnInit();

            // Assert
            routerMock.verify(x => x.navigate(['/welcome']), Times.exactly(1));
        });

        it('Should navigate to main if welcome should not be shown', async () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const databaseMigratorMock: IMock<BaseDatabaseMigrator> = Mock.ofType<BaseDatabaseMigrator>();
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const settingsMock: SettingsMock = new SettingsMock(false);

            const loadingComponent: LoadingComponent = new LoadingComponent(
                routerMock.object,
                databaseMigratorMock.object,
                appearanceServiceMock.object,
                settingsMock);

            // Act
            await loadingComponent.ngOnInit();

            // Assert
            routerMock.verify(x => x.navigate(['/main']), Times.exactly(1));
        });

        it('Should prevent showing the welcome screen on a next start', async () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const databaseMigratorMock: IMock<BaseDatabaseMigrator> = Mock.ofType<BaseDatabaseMigrator>();
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const settingsMock: SettingsMock = new SettingsMock(true);

            const loadingComponent: LoadingComponent = new LoadingComponent(
                routerMock.object,
                databaseMigratorMock.object,
                appearanceServiceMock.object,
                settingsMock);

            // Act
            await loadingComponent.ngOnInit();

            // Assert
            assert.strictEqual(settingsMock.showWelcome, false);
        });
    });
});
