import { IMock, Mock } from 'typemoq';
import { LogViewer } from '../../../common/io/log-viewer';
import { BaseSettings } from '../../../common/settings/base-settings';
import { AdvancedSettingsComponent } from './advanced-settings.component';

describe('AdvancedSettingsComponent', () => {
    let settingsMock: IMock<BaseSettings>;
    let logViewerMock: IMock<LogViewer>;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        logViewerMock = Mock.ofType<LogViewer>();
    });

    function createComponent(): AdvancedSettingsComponent {
        return new AdvancedSettingsComponent(settingsMock.object, logViewerMock.object);
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

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: AdvancedSettingsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });
    });
});
