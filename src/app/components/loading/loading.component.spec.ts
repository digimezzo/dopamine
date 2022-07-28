import { IMock, Mock, Times } from 'typemoq';
import { BaseDatabaseMigrator } from '../../common/data/base-database-migrator';
import { BaseScheduler } from '../../common/scheduling/base-scheduler';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseFileService } from '../../services/file/base-file.service';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BaseUpdateService } from '../../services/update/base-update.service';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let databaseMigratorMock: IMock<BaseDatabaseMigrator>;
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let settingsStub: any;
    let updateServiceMock: IMock<BaseUpdateService>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let fileServiceMock: IMock<BaseFileService>;
    let schedulerMock: IMock<BaseScheduler>;

    function createComponent(): LoadingComponent {
        return new LoadingComponent(
            navigationServiceMock.object,
            databaseMigratorMock.object,
            appearanceServiceMock.object,
            settingsStub,
            updateServiceMock.object,
            indexingServiceMock.object,
            fileServiceMock.object,
            schedulerMock.object
        );
    }

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        databaseMigratorMock = Mock.ofType<BaseDatabaseMigrator>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        settingsStub = { showWelcome: false, refreshCollectionAutomatically: false };
        updateServiceMock = Mock.ofType<BaseUpdateService>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        fileServiceMock = Mock.ofType<BaseFileService>();
        schedulerMock = Mock.ofType<BaseScheduler>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: LoadingComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should perform database migrations if welcome should be shown', async () => {
            // Arrange
            settingsStub.showWelcome = true;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            databaseMigratorMock.verify((x) => x.migrateAsync(), Times.exactly(1));
        });

        it('should perform database migrations if welcome should not be shown', async () => {
            // Arrange
            settingsStub.showWelcome = false;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            databaseMigratorMock.verify((x) => x.migrateAsync(), Times.exactly(1));
        });

        it('should navigate to welcome if welcome should be shown', async () => {
            // Arrange
            settingsStub.showWelcome = true;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToWelcome(), Times.exactly(1));
        });

        it('should prevent showing the welcome screen on a next start if welcome should be shown', async () => {
            // Arrange
            settingsStub.showWelcome = true;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(settingsStub.showWelcome).toBeFalsy();
        });

        it('should navigate to collection if welcome should not be shown and there are no playable files as parameters', async () => {
            // Arrange
            settingsStub.showWelcome = false;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToCollection(), Times.exactly(1));
        });

        it('should navigate to now playing if welcome should not be shown and there are playable files as parameters', async () => {
            // Arrange
            settingsStub.showWelcome = false;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => true);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToNowPlaying(), Times.exactly(1));
        });

        it('should enqueue parameter files if welcome should not be shown and there are playable files as parameters', async () => {
            // Arrange
            settingsStub.showWelcome = false;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => true);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            fileServiceMock.verify((x) => x.enqueueParameterFilesAsync(), Times.exactly(1));
        });

        it('should check for updates when navigating to collection', async () => {
            // Arrange
            settingsStub.showWelcome = false;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            updateServiceMock.verify((x) => x.checkForUpdatesAsync(), Times.exactly(1));
        });

        it('should not check for updates when navigating to now playing', async () => {
            // Arrange
            settingsStub.showWelcome = false;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => true);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            updateServiceMock.verify((x) => x.checkForUpdatesAsync(), Times.never());
        });

        it('should wait 2 seconds before triggering indexing when navigating to collection', async () => {
            // Arrange
            settingsStub.showWelcome = false;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            schedulerMock.verify((x) => x.sleepAsync(2000), Times.exactly(1));
        });

        it('should trigger indexing when navigating to collection and refresh collection automatically is enabled', async () => {
            // Arrange
            settingsStub.showWelcome = false;
            settingsStub.refreshCollectionAutomatically = true;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            indexingServiceMock.verify((x) => x.indexCollectionIfOutdatedAsync(), Times.exactly(1));
        });

        it('should trigger indexing when navigating to now playing and refresh collection automatically is enabled', async () => {
            // Arrange
            settingsStub.showWelcome = false;
            settingsStub.refreshCollectionAutomatically = true;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => true);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            indexingServiceMock.verify((x) => x.indexCollectionIfOutdatedAsync(), Times.never());
        });

        it('should not trigger indexing when navigating to collection and refresh collection automatically is disabled', async () => {
            // Arrange
            settingsStub.showWelcome = false;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            indexingServiceMock.verify((x) => x.indexCollectionIfOutdatedAsync(), Times.never());
        });
    });
});
