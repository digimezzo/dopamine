import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseTrayService } from '../../../services/tray/base-tray.service';
import { BehaviorSettingsComponent } from './behavior-settings.component';

describe('BehaviorSettingsComponent', () => {
    let component: BehaviorSettingsComponent;
    let trayServiceMock: IMock<BaseTrayService>;
    let settingsMock: IMock<BaseSettings>;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        trayServiceMock = Mock.ofType<BaseTrayService>();
        component = new BehaviorSettingsComponent(trayServiceMock.object, settingsMock.object);
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
