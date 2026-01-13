import { IMock, Mock, Times } from 'typemoq';
import { LoadingComponent } from './loading.component';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { UpdateServiceBase } from '../../../services/update/update.service.base';
import { IndexingService } from '../../../services/indexing/indexing.service';
import { FileServiceBase } from '../../../services/file/file.service.base';
import { SchedulerBase } from '../../../common/scheduling/scheduler.base';
import { PlaybackService } from '../../../services/playback/playback.service';

describe('LoadingComponent', () => {
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let playbackServiceMock: IMock<PlaybackService>;
    let settingsStub: any;
    let updateServiceMock: IMock<UpdateServiceBase>;
    let indexingServiceMock: IMock<IndexingService>;
    let fileServiceMock: IMock<FileServiceBase>;
    let schedulerMock: IMock<SchedulerBase>;

    function createComponent(): LoadingComponent {
        return new LoadingComponent(
            navigationServiceMock.object,
            appearanceServiceMock.object,
            playbackServiceMock.object,
            settingsStub,
            updateServiceMock.object,
            indexingServiceMock.object,
            fileServiceMock.object,
            schedulerMock.object,
        );
    }

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        playbackServiceMock = Mock.ofType<PlaybackService>();
        settingsStub = { showWelcome: false, refreshCollectionAutomatically: false };
        updateServiceMock = Mock.ofType<UpdateServiceBase>();
        indexingServiceMock = Mock.ofType<IndexingService>();
        fileServiceMock = Mock.ofType<FileServiceBase>();
        schedulerMock = Mock.ofType<SchedulerBase>();
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
        it('should navigate to welcome if welcome should be shown', async () => {
            // Arrange
            settingsStub.showWelcome = true;
            settingsStub.refreshCollectionAutomatically = false;
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToWelcomeAsync(), Times.exactly(1));
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
            navigationServiceMock.verify((x) => x.navigateToCollectionAsync(), Times.exactly(1));
        });

        it('should restore playback queue if there are no playable files as parameters', async () => {
            // Arrange
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => false);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackServiceMock.verify((x) => x.RestoreQueueIfNeededAsync(), Times.exactly(1));
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
            navigationServiceMock.verify((x) => x.navigateToNowPlayingAsync(), Times.exactly(1));
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

        it('should not restore playback queue if there are playable files as parameters', async () => {
            // Arrange
            fileServiceMock.setup((x) => x.hasPlayableFilesAsParameters()).returns(() => true);

            const component: LoadingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackServiceMock.verify((x) => x.RestoreQueueIfNeededAsync(), Times.never());
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
            indexingServiceMock.verify((x) => x.indexCollectionIfOutdated(), Times.exactly(1));
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
            indexingServiceMock.verify((x) => x.indexCollectionIfOutdated(), Times.never());
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
            indexingServiceMock.verify((x) => x.indexCollectionIfOutdated(), Times.never());
        });
    });
});
