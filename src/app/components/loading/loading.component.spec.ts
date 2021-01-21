import { IMock, Mock, Times } from 'typemoq';
import { BaseScheduler } from '../../core/scheduler/base-scheduler';
import { BaseSettings } from '../../core/settings/base-settings';
import { SettingsStub } from '../../core/settings/settings-stub';
import { BaseDatabaseMigrator } from '../../data/base-database-migrator';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BaseUpdateService } from '../../services/update/base-update.service';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let databaseMigratorMock: IMock<BaseDatabaseMigrator>;
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let settingsMock: BaseSettings;
    let updateServiceMock: IMock<BaseUpdateService>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let schedulerMock: IMock<BaseScheduler>;

    let component: LoadingComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        databaseMigratorMock = Mock.ofType<BaseDatabaseMigrator>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        settingsMock = new SettingsStub();
        updateServiceMock = Mock.ofType<BaseUpdateService>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        schedulerMock = Mock.ofType<BaseScheduler>();

        component = new LoadingComponent(
            navigationServiceMock.object,
            databaseMigratorMock.object,
            appearanceServiceMock.object,
            settingsMock,
            updateServiceMock.object,
            indexingServiceMock.object,
            schedulerMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeTruthy();
        });
    });

    describe('ngOnInit', () => {
        it('should perform database migrations', async () => {
            // Arrange
            settingsMock.showWelcome = false;
            settingsMock.refreshCollectionAutomatically = false;

            // Act
            await component.ngOnInit();

            // Assert
            databaseMigratorMock.verify((x) => x.migrateAsync(), Times.exactly(1));
        });

        it('should navigate to welcome if welcome should be shown', async () => {
            // Arrange
            settingsMock.showWelcome = true;
            settingsMock.refreshCollectionAutomatically = false;

            // Act
            await component.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToWelcome(), Times.exactly(1));
        });

        it('should navigate to collection if welcome should not be shown', async () => {
            // Arrange
            settingsMock.showWelcome = false;
            settingsMock.refreshCollectionAutomatically = false;

            // Act
            await component.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToCollection(), Times.exactly(1));
        });

        it('should prevent showing the welcome screen on a next start', async () => {
            // Arrange
            settingsMock.showWelcome = false;
            settingsMock.refreshCollectionAutomatically = false;

            // Act
            await component.ngOnInit();

            // Assert
            expect(settingsMock.showWelcome).toBeFalsy();
        });

        it('should check for updates when navigating to collection', async () => {
            // Arrange
            settingsMock.showWelcome = false;
            settingsMock.refreshCollectionAutomatically = false;

            // Act
            await component.ngOnInit();

            // Assert
            updateServiceMock.verify((x) => x.checkForUpdatesAsync(), Times.exactly(1));
        });

        it('should wait 2 seconds before triggering indexing when navigating to collection', async () => {
            // Arrange
            settingsMock.showWelcome = false;
            settingsMock.refreshCollectionAutomatically = false;

            // Act
            await component.ngOnInit();

            // Assert
            schedulerMock.verify((x) => x.sleepAsync(2000), Times.exactly(1));
        });

        it('should trigger indexing when navigating to collection and refresh collection automatically is enabled', async () => {
            // Arrange
            settingsMock.showWelcome = false;
            settingsMock.refreshCollectionAutomatically = true;

            // Act
            await component.ngOnInit();

            // Assert
            indexingServiceMock.verify((x) => x.indexCollectionIfOutdatedAsync(), Times.exactly(1));
        });

        it('should not trigger indexing when navigating to collection and refresh collection automatically is disabled', async () => {
            // Arrange
            settingsMock.showWelcome = false;
            settingsMock.refreshCollectionAutomatically = false;

            // Act
            await component.ngOnInit();

            // Assert
            indexingServiceMock.verify((x) => x.indexCollectionIfOutdatedAsync(), Times.never());
        });
    });
});
