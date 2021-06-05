import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../common/settings/base-settings';
import { AdvancedSettingsComponent } from './advanced-settings.component';

describe('AdvancedSettingsComponent', () => {
    let settingsMock: IMock<BaseSettings>;

    let component: AdvancedSettingsComponent;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();

        component = new AdvancedSettingsComponent(settingsMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act

            // Assert
            expect(component.settings).toBeDefined();
        });
    });
});
