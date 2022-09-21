import { IMock, Mock, Times } from 'typemoq';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AppearanceSettingsComponent } from './appearance-settings.component';

describe('AppearanceSettingsComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let settingsMock: IMock<BaseSettings>;
    let desktopMock: IMock<BaseDesktop>;

    let component: AppearanceSettingsComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        settingsMock = Mock.ofType<BaseSettings>();
        desktopMock = Mock.ofType<BaseDesktop>();

        appearanceServiceMock.setup((x) => x.themesDirectoryPath).returns(() => '/my/path');

        component = new AppearanceSettingsComponent(
            appearanceServiceMock.object,
            translatorServiceMock.object,
            settingsMock.object,
            desktopMock.object
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
        it('should open the themes directory', () => {
            // Arrange

            // Act
            component.openThemesDirectory();

            // Assert
            desktopMock.verify((x) => x.openPath('/my/path'), Times.once());
        });
    });
});
