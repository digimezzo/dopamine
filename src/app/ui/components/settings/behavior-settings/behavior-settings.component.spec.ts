import { IMock, Mock } from 'typemoq';
import { SettingsBase } from '../../../common/settings/settings.base';
import { BaseMediaSessionService } from '../../../services/media-session/base-media-session.service';
import { BaseTrayService } from '../../../services/tray/base-tray.service';
import { BehaviorSettingsComponent } from './behavior-settings.component';

describe('BehaviorSettingsComponent', () => {
    let component: BehaviorSettingsComponent;
    let trayServiceMock: IMock<BaseTrayService>;
    let mediaSessionServiceMock: IMock<BaseMediaSessionService>;
    let settingsMock: IMock<SettingsBase>;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        trayServiceMock = Mock.ofType<BaseTrayService>();
        mediaSessionServiceMock = Mock.ofType<BaseMediaSessionService>();
        component = new BehaviorSettingsComponent(trayServiceMock.object, mediaSessionServiceMock.object, settingsMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define trayService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.trayService).toBeDefined();
        });

        it('should define mediaSessionService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.mediaSessionService).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act

            // Assert
            expect(component.settings).toBeDefined();
        });
    });
});
