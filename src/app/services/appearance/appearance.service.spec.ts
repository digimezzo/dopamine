import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { BaseRemoteProxy } from '../../common/io/base-remote-proxy';
import { Desktop } from '../../common/io/desktop';
import { DocumentProxy } from '../../common/io/document-proxy';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { AppearanceService } from './appearance.service';
import { BaseAppearanceService } from './base-appearance.service';
import { DefaultThemesCreator } from './default-themes-creator';
import { Theme } from './theme/theme';
import { ThemeCoreColors } from './theme/theme-core-colors';
import { ThemeCreator } from './theme/theme-creator';
import { ThemeNeutralColors } from './theme/theme-neutral-colors';

describe('AppearanceService', () => {
    let settingsMock: IMock<BaseSettings>;
    let loggerMock: IMock<Logger>;
    let overlayContainerMock: IMock<OverlayContainer>;
    let remoteProxyMock: IMock<BaseRemoteProxy>;
    let fileSystemMock: IMock<FileSystem>;
    let desktopMock: IMock<Desktop>;
    let defaultThemesCreator: IMock<DefaultThemesCreator>;
    let documentProxyMock: IMock<DocumentProxy>;

    var containerElementMock: HTMLElement;
    let documentElementMock: HTMLElement;
    let bodyMock: HTMLElement;

    function createService(): BaseAppearanceService {
        return new AppearanceService(
            settingsMock.object,
            loggerMock.object,
            overlayContainerMock.object,
            remoteProxyMock.object,
            fileSystemMock.object,
            desktopMock.object,
            defaultThemesCreator.object,
            documentProxyMock.object
        );
    }

    function createDarkColors(): ThemeNeutralColors {
        return new ThemeNeutralColors(
            '#000000',
            '#011111',
            '#022222',
            '#033333',
            '#044444',
            '#055555',
            '#066666',
            '#077777',
            '#088888',
            '#099999',
            '#0aaaaa',
            '#0bbbbb',
            '#0ccccc',
            '#0ddddd',
            '#0eeeee',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff'
        );
    }

    function createLightColors(): ThemeNeutralColors {
        return new ThemeNeutralColors(
            '#100000',
            '#111111',
            '#122222',
            '#133333',
            '#144444',
            '#155555',
            '#166666',
            '#177777',
            '#188888',
            '#199999',
            '#1aaaaa',
            '#1bbbbb',
            '#1ccccc',
            '#1ddddd',
            '#1eeeee',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff'
        );
    }

    function createTheme(): Theme {
        const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
        const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
        const darkColors: ThemeNeutralColors = createDarkColors();
        const lightColors: ThemeNeutralColors = createLightColors();

        const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors);

        return theme;
    }

    function createServiceWithSettingsStub(settingsStub: any): BaseAppearanceService {
        return new AppearanceService(
            settingsStub,
            loggerMock.object,
            overlayContainerMock.object,
            remoteProxyMock.object,
            fileSystemMock.object,
            desktopMock.object,
            defaultThemesCreator.object,
            documentProxyMock.object
        );
    }

    function assertAccentColorCssProperties(): void {
        expect(documentElementMock.style.getPropertyValue('--theme-primary-color')).toEqual('#fff');
        expect(documentElementMock.style.getPropertyValue('--theme-secondary-color')).toEqual('#000');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color')).toEqual('#ccc');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-50')).toEqual('#ffffff');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-100')).toEqual('#ffffff');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-200')).toEqual('#ffffff');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-300')).toEqual('#ebebeb');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-400')).toEqual('#dbdbdb');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-500')).toEqual('#cccccc');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-600')).toEqual('#bdbdbd');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-700')).toEqual('#adadad');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-800')).toEqual('#9e9e9e');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-900')).toEqual('#8f8f8f');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A100')).toEqual('#ffffff');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A200')).toEqual('#ffffff');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A400')).toEqual('#e9e2e2');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A700')).toEqual('#dbd7d7');
    }

    function assertDarkColorCssProperties(): void {
        expect(documentElementMock.style.getPropertyValue('--theme-window-button-icon')).toEqual('#000000');
        expect(documentElementMock.style.getPropertyValue('--theme-hovered-item-background')).toEqual('#011111');
        expect(documentElementMock.style.getPropertyValue('--theme-selected-item-background')).toEqual('#022222');
        expect(documentElementMock.style.getPropertyValue('--theme-tab-text')).toEqual('#033333');
        expect(documentElementMock.style.getPropertyValue('--theme-selected-tab-text')).toEqual('#044444');
        expect(documentElementMock.style.getPropertyValue('--theme-main-background')).toEqual('#055555');
        expect(documentElementMock.style.getPropertyValue('--theme-header-background')).toEqual('#066666');
        expect(documentElementMock.style.getPropertyValue('--theme-footer-background')).toEqual('#077777');
        expect(documentElementMock.style.getPropertyValue('--theme-side-pane-background')).toEqual('#088888');
        expect(documentElementMock.style.getPropertyValue('--theme-primary-text')).toEqual('#099999');
        expect(documentElementMock.style.getPropertyValue('--theme-secondary-text')).toEqual('#0aaaaa');
        expect(documentElementMock.style.getPropertyValue('--theme-breadcrumb-background')).toEqual('#0bbbbb');
        expect(documentElementMock.style.getPropertyValue('--theme-slider-background')).toEqual('#0ccccc');
        expect(documentElementMock.style.getPropertyValue('--theme-slider-thumb-background')).toEqual('#0ddddd');
        expect(documentElementMock.style.getPropertyValue('--theme-album-cover-logo')).toEqual('#0eeeee');
        expect(documentElementMock.style.getPropertyValue('--theme-album-cover-background')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-album-info-background')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-pane-separators')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-settings-separators')).toEqual('#0fffff');
    }

    function assertLightColorCssProperties(): void {
        expect(documentElementMock.style.getPropertyValue('--theme-window-button-icon')).toEqual('#100000');
        expect(documentElementMock.style.getPropertyValue('--theme-hovered-item-background')).toEqual('#111111');
        expect(documentElementMock.style.getPropertyValue('--theme-selected-item-background')).toEqual('#122222');
        expect(documentElementMock.style.getPropertyValue('--theme-tab-text')).toEqual('#133333');
        expect(documentElementMock.style.getPropertyValue('--theme-selected-tab-text')).toEqual('#144444');
        expect(documentElementMock.style.getPropertyValue('--theme-main-background')).toEqual('#155555');
        expect(documentElementMock.style.getPropertyValue('--theme-header-background')).toEqual('#166666');
        expect(documentElementMock.style.getPropertyValue('--theme-footer-background')).toEqual('#177777');
        expect(documentElementMock.style.getPropertyValue('--theme-side-pane-background')).toEqual('#188888');
        expect(documentElementMock.style.getPropertyValue('--theme-primary-text')).toEqual('#199999');
        expect(documentElementMock.style.getPropertyValue('--theme-secondary-text')).toEqual('#1aaaaa');
        expect(documentElementMock.style.getPropertyValue('--theme-breadcrumb-background')).toEqual('#1bbbbb');
        expect(documentElementMock.style.getPropertyValue('--theme-slider-background')).toEqual('#1ccccc');
        expect(documentElementMock.style.getPropertyValue('--theme-slider-thumb-background')).toEqual('#1ddddd');
        expect(documentElementMock.style.getPropertyValue('--theme-album-cover-logo')).toEqual('#1eeeee');
        expect(documentElementMock.style.getPropertyValue('--theme-album-cover-background')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-album-info-background')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-pane-separators')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-settings-separators')).toEqual('#1fffff');
    }

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        loggerMock = Mock.ofType<Logger>();
        overlayContainerMock = Mock.ofType<OverlayContainer>();
        remoteProxyMock = Mock.ofType<BaseRemoteProxy>();
        fileSystemMock = Mock.ofType<FileSystem>();
        desktopMock = Mock.ofType<Desktop>();
        defaultThemesCreator = Mock.ofType<DefaultThemesCreator>();
        documentProxyMock = Mock.ofType<DocumentProxy>();

        desktopMock.setup((x) => x.accentColorChanged$).returns(() => new Observable());
        desktopMock.setup((x) => x.nativeThemeUpdated$).returns(() => new Observable());

        fileSystemMock
            .setup((x) => x.getFilesInDirectory('/home/user/.config/Dopamine/Themes'))
            .returns(() => ['/home/user/.config/Dopamine/Themes/Dopamine.theme']);
        fileSystemMock.setup((x) => x.applicationDataDirectory()).returns(() => '/home/user/.config/Dopamine');
        fileSystemMock
            .setup((x) => x.combinePath(['/home/user/.config/Dopamine', 'Themes']))
            .returns(() => '/home/user/.config/Dopamine/Themes');

        const dummyTheme: Theme = createTheme();

        fileSystemMock
            .setup((x) => x.getFileContent('/home/user/.config/Dopamine/Themes/Dopamine.theme'))
            .returns(() => JSON.stringify(dummyTheme));

        containerElementMock = document.createElement('div');
        overlayContainerMock.setup((x) => x.getContainerElement()).returns(() => containerElementMock);

        documentElementMock = document.createElement('div');
        documentProxyMock.setup((x) => x.getDocumentElement()).returns(() => documentElementMock);

        bodyMock = document.createElement('div');
        documentProxyMock.setup((x) => x.getBody()).returns(() => bodyMock);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('windowHasNativeTitleBar', () => {
        it('should return true if the window has a frame', () => {
            // Arrange
            remoteProxyMock.setup((x) => x.getGlobal('windowHasFrame')).returns(() => true);
            const service: BaseAppearanceService = createService();

            // Act
            const windowHasNativeTitleBar: boolean = service.windowHasNativeTitleBar;

            // Assert
            expect(windowHasNativeTitleBar).toBeTruthy();
        });
    });

    describe('isUsingLightTheme', () => {
        it('should return true when not following the system theme and settings request to use a light theme', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => true);

            const service: BaseAppearanceService = createService();

            // Act
            const isUsingLightTheme: boolean = service.isUsingLightTheme;

            // Assert
            expect(isUsingLightTheme).toBeTruthy();
        });

        it('should return false when not following the system theme and settings do not request to use a light theme', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);

            const service: BaseAppearanceService = createService();

            // Act
            const isUsingLightTheme: boolean = service.isUsingLightTheme;

            // Assert
            expect(isUsingLightTheme).toBeFalsy();
        });

        it('should return true when following the system theme and the system is not using a dark theme', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemTheme).returns(() => true);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);

            const service: BaseAppearanceService = createService();

            // Act
            const isUsingLightTheme: boolean = service.isUsingLightTheme;

            // Assert
            expect(isUsingLightTheme).toBeTruthy();
        });

        it('should return false when following the system theme and the system is using a dark theme', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemTheme).returns(() => true);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => true);

            const service: BaseAppearanceService = createService();

            // Act
            const isUsingLightTheme: boolean = service.isUsingLightTheme;

            // Assert
            expect(isUsingLightTheme).toBeFalsy();
        });
    });

    describe('followSystemTheme', () => {
        it('should return false if the settings contain false', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);

            const service: BaseAppearanceService = createService();

            // Act
            const followSystemTheme: boolean = service.followSystemTheme;

            // Assert
            expect(followSystemTheme).toBeFalsy();
        });

        it('should return true if the settings contain true', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemTheme).returns(() => true);

            const service: BaseAppearanceService = createService();

            // Act
            const followSystemTheme: boolean = service.followSystemTheme;

            // Assert
            expect(followSystemTheme).toBeTruthy();
        });

        it('should save followSystemTheme to settings', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme();

            // Act
            service.followSystemTheme = true;

            // Assert
            expect(settingsStub.followSystemTheme).toBeTruthy();
        });

        it('should apply the light theme if using the light theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: true };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme();

            // Act
            service.followSystemTheme = false;

            // Assert
            assertAccentColorCssProperties();
            assertLightColorCssProperties();
            expect(containerElementMock.classList).toContain('default-theme-light');
            expect(bodyMock.classList).toContain('default-theme-light');
        });

        it('should apply the dark theme if using the dark theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: false };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme();

            // Act
            service.followSystemTheme = false;

            // Assert
            assertAccentColorCssProperties();
            assertDarkColorCssProperties();
            expect(containerElementMock.classList).toContain('default-theme-dark');
            expect(bodyMock.classList).toContain('default-theme-dark');
        });
    });

    describe('useLightBackgroundTheme', () => {
        it('should return false if the settings contain false', () => {
            // Arrange
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);

            const service: BaseAppearanceService = createService();

            // Act
            const useLightBackgroundTheme: boolean = service.useLightBackgroundTheme;

            // Assert
            expect(useLightBackgroundTheme).toBeFalsy();
        });

        it('should return true if the settings contain true', () => {
            // Arrange
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => true);

            const service: BaseAppearanceService = createService();

            // Act
            const useLightBackgroundTheme: boolean = service.useLightBackgroundTheme;

            // Assert
            expect(useLightBackgroundTheme).toBeTruthy();
        });

        it('should save useLightBackgroundTheme to settings', () => {
            // Arrange
            const settingsStub: any = { useLightBackgroundTheme: false };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme();

            // Act
            service.useLightBackgroundTheme = true;

            // Assert
            expect(settingsStub.useLightBackgroundTheme).toBeTruthy();
        });

        it('should apply the theme', () => {
            throw new Error();
        });
    });

    describe('followSystemColor', () => {
        it('should return false if the settings contain false', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);

            const service: BaseAppearanceService = createService();

            // Act
            const followSystemColor: boolean = service.followSystemColor;

            // Assert
            expect(followSystemColor).toBeFalsy();
        });

        it('should return true if the settings contain true', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemColor).returns(() => true);

            const service: BaseAppearanceService = createService();

            // Act
            const followSystemColor: boolean = service.followSystemColor;

            // Assert
            expect(followSystemColor).toBeTruthy();
        });

        it('should save followSystemColor to settings', () => {
            // Arrange
            const settingsStub: any = { followSystemColor: false };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme();

            // Act
            service.followSystemColor = true;

            // Assert
            expect(settingsStub.followSystemColor).toBeTruthy();
        });

        it('should apply the theme', () => {
            throw new Error();
        });
    });
});
