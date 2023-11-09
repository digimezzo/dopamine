import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { SettingsBase } from '../../common/settings/settings.base';
import { TrayService } from './tray.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';

describe('TrayService', () => {
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: IMock<SettingsBase>;
    let ipcProxyMock: IMock<IpcProxyBase>;

    let translateServiceProxyLanguageChanged: Subject<void>;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        settingsMock = Mock.ofType<SettingsBase>();
        ipcProxyMock = Mock.ofType<IpcProxyBase>();

        translateServiceProxyLanguageChanged = new Subject();
        const translateServiceProxyLanguageChanged$: Observable<void> = translateServiceProxyLanguageChanged.asObservable();

        translatorServiceMock.setup((x) => x.get('show-dopamine')).returns(() => 'Show Dopamine');
        translatorServiceMock.setup((x) => x.get('exit')).returns(() => 'Exit');
        translatorServiceMock.setup((x) => x.languageChanged$).returns(() => translateServiceProxyLanguageChanged$);
    });

    function createService(): TrayService {
        return new TrayService(translatorServiceMock.object, settingsMock.object, ipcProxyMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: TrayService = createService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should update the tray context menu', () => {
            // Arrange
            const arg: any = {
                showDopamineLabel: 'Show Dopamine',
                exitLabel: 'Exit',
            };

            // Act
            createService();

            // Assert
            ipcProxyMock.verify((x) => x.sendToMainProcess('update-tray-context-menu', arg), Times.once());
        });

        it('should trigger update the tray context menu on language changed', () => {
            // Arrange
            const arg: any = {
                showDopamineLabel: 'Show Dopamine',
                exitLabel: 'Exit',
            };

            createService();
            ipcProxyMock.reset();

            // Act
            translateServiceProxyLanguageChanged.next();

            // Assert
            ipcProxyMock.verify((x) => x.sendToMainProcess('update-tray-context-menu', arg), Times.once());
        });
    });

    describe('updateTrayContextMenu', () => {
        it('should update the tray context menu', () => {
            // Arrange
            const arg: any = {
                showDopamineLabel: 'Show Dopamine',
                exitLabel: 'Exit',
            };

            const service: TrayService = createService();
            ipcProxyMock.reset();

            // Act
            service.updateTrayContextMenu();

            // Assert
            ipcProxyMock.verify((x) => x.sendToMainProcess('update-tray-context-menu', arg), Times.once());
        });
    });
});
