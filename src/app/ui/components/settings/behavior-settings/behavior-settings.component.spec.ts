import { IMock, Mock } from 'typemoq';
import { BehaviorSettingsComponent } from './behavior-settings.component';
import { MediaSessionService } from '../../../../services/media-session/media-session.service';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { TrayServiceBase } from '../../../../services/tray/tray.service.base';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { Logger } from '../../../../common/logger';

describe('BehaviorSettingsComponent', () => {
    let component: BehaviorSettingsComponent;
    let trayServiceMock: IMock<TrayServiceBase>;
    let mediaSessionServiceMock: IMock<MediaSessionService>;
    let dialogServiceMock: IMock<DialogServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: IMock<SettingsBase>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        trayServiceMock = Mock.ofType<TrayServiceBase>();
        mediaSessionServiceMock = Mock.ofType<MediaSessionService>();
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        loggerMock = Mock.ofType<Logger>();

        component = new BehaviorSettingsComponent(
            trayServiceMock.object,
            mediaSessionServiceMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object,
            settingsMock.object,
            loggerMock.object,
        );
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
