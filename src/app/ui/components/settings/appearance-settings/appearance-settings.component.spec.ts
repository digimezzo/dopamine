import { IMock, Mock, Times } from 'typemoq';
import { AppearanceSettingsComponent } from './appearance-settings.component';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { DesktopBase } from '../../../../common/io/desktop.base';

describe('AppearanceSettingsComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: IMock<SettingsBase>;
    let desktopMock: IMock<DesktopBase>;

    let component: AppearanceSettingsComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        settingsMock = Mock.ofType<SettingsBase>();
        desktopMock = Mock.ofType<DesktopBase>();

        appearanceServiceMock.setup((x) => x.themesDirectoryPath).returns(() => '/my/path');

        component = new AppearanceSettingsComponent(
            appearanceServiceMock.object,
            translatorServiceMock.object,
            settingsMock.object,
            desktopMock.object,
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should define translatorService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.translatorService).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act

            // Assert
            expect(component.settings).toBeDefined();
        });
    });

    describe('ngOnDestroy', () => {
        it('should stop watching of the themes directory', () => {
            // Arrange

            // Act
            component.ngOnDestroy();

            // Assert
            appearanceServiceMock.verify((x) => x.stopWatchingThemesDirectory(), Times.once());
        });
    });

    describe('ngOnInit', () => {
        it('should start watching of the themes directory', () => {
            // Arrange

            // Act
            component.ngOnInit();

            // Assert
            appearanceServiceMock.verify((x) => x.startWatchingThemesDirectory(), Times.once());
        });
    });

    describe('openThemesDirectory', () => {
        it('should open the themes directory', async () => {
            // Arrange

            // Act
            await component.openThemesDirectoryAsync();

            // Assert
            desktopMock.verify((x) => x.openPathAsync('/my/path'), Times.once());
        });
    });
});
