import { IMock, Mock } from 'typemoq';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { WelcomeOnlineComponent } from './welcome-online.component';

describe('WelcomeOnlineComponent', () => {
    let settingsMock: IMock<SettingsBase>;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: WelcomeOnlineComponent = new WelcomeOnlineComponent(settingsMock.object);

            // Assert
            expect(component).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange
            const component: WelcomeOnlineComponent = new WelcomeOnlineComponent(settingsMock.object);

            // Act, Assert
            expect(component.settings).toBeDefined();
        });
    });
});
