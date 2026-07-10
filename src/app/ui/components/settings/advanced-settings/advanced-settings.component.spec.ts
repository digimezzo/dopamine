import { IMock, Mock, Times } from 'typemoq';
import { AdvancedSettingsComponent } from './advanced-settings.component';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { LogViewer } from '../../../../common/io/log-viewer';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { RatingBackupService } from '../../../../services/rating-backup/rating-backup.service';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';

describe('AdvancedSettingsComponent', () => {
    let settingsMock: IMock<SettingsBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let logViewerMock: IMock<LogViewer>;
    let ratingBackupServiceMock: IMock<RatingBackupService>;
    let dialogServiceMock: IMock<DialogServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        logViewerMock = Mock.ofType<LogViewer>();
        ratingBackupServiceMock = Mock.ofType<RatingBackupService>();
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
    });

    function createComponent(): AdvancedSettingsComponent {
        return new AdvancedSettingsComponent(
            settingsMock.object,
            navigationServiceMock.object,
            logViewerMock.object,
            ratingBackupServiceMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object,
        );
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: AdvancedSettingsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act
            const component: AdvancedSettingsComponent = createComponent();

            // Assert
            expect(component.settings).toBeDefined();
        });
    });

    describe('viewLog', () => {
        it('should open the log file', () => {
            // Arrange
            const component: AdvancedSettingsComponent = createComponent();

            // Act
            component.viewLog();

            // Assert
            logViewerMock.verify((x) => x.viewLog(), Times.once());
        });
    });

    describe('showWelcomeScreenAsync', () => {
        it('should navigate to welcome screen', async () => {
            // Arrange
            const component: AdvancedSettingsComponent = createComponent();

            // Act
            await component.showWelcomeScreenAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToWelcomeAsync(), Times.once());
        });
    });

    describe('restoreRatingsAsync', () => {
        it('should call manual restore and show result dialog', async () => {
            // Arrange
            const component: AdvancedSettingsComponent = createComponent();
            ratingBackupServiceMock.setup((x) => x.restoreRatingsManuallyAsync()).returns(async () => 5);
            translatorServiceMock
                .setup((x) => x.get('ratings-restored-count', { count: 5 }))
                .returns(() => 'Restored ratings for 5 songs.');

            // Act
            await component.restoreRatingsAsync();

            // Assert
            ratingBackupServiceMock.verify((x) => x.restoreRatingsManuallyAsync(), Times.once());
            dialogServiceMock.verify((x) => x.showInfoDialog('Restored ratings for 5 songs.'), Times.once());
        });
    });
});
