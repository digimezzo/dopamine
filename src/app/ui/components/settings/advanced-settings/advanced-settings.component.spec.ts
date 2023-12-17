import { IMock, Mock, Times } from 'typemoq';
import { AdvancedSettingsComponent } from './advanced-settings.component';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { LogViewer } from '../../../../common/io/log-viewer';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';

describe('AdvancedSettingsComponent', () => {
    let settingsMock: IMock<SettingsBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let logViewerMock: IMock<LogViewer>;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        logViewerMock = Mock.ofType<LogViewer>();
    });

    function createComponent(): AdvancedSettingsComponent {
        return new AdvancedSettingsComponent(settingsMock.object, navigationServiceMock.object, logViewerMock.object);
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
});
