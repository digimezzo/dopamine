import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BehaviorSettingsComponent } from './behavior-settings.component';

describe('BehaviorSettingsComponent', () => {
    let component: BehaviorSettingsComponent;
    let settingsMock: IMock<BaseSettings>;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        component = new BehaviorSettingsComponent(settingsMock.object);
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
