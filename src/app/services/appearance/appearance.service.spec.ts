import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { Constants } from '../../common/application/constants';
import { FontSize } from '../../common/application/font-size';
import { BaseApplication } from '../../common/io/base-application';
import { BaseDesktop } from '../../common/io/base-desktop';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { DocumentProxy } from '../../common/io/document-proxy';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { AppearanceService } from './appearance.service';
import { BaseAppearanceService } from './base-appearance.service';
import { DefaultThemesCreator } from './default-themes-creator';
import { Theme } from './theme/theme';
import { ThemeCoreColors } from './theme/theme-core-colors';
import { ThemeCreator } from './theme/theme-creator';
import { ThemeNeutralColors } from './theme/theme-neutral-colors';
import { ThemeOptions } from './theme/theme-options';

describe('AppearanceService', () => {
    let settingsMock: IMock<BaseSettings>;
    let loggerMock: IMock<Logger>;
    let overlayContainerMock: IMock<OverlayContainer>;
    let applicationMock: IMock<BaseApplication>;
    let fileAccessMock: IMock<BaseFileAccess>;
    let desktopMock: IMock<BaseDesktop>;
    let defaultThemesCreatorMock: IMock<DefaultThemesCreator>;
    let documentProxyMock: IMock<DocumentProxy>;

    let containerElementMock: HTMLElement;
    let documentElementMock: HTMLElement;
    let bodyMock: HTMLElement;

    let theme1: Theme;
    let theme2: Theme;

    let desktopAccentColorChangedMock: Subject<void>;
    let desktopNativeThemeUpdatedMock: Subject<void>;

    function createService(): BaseAppearanceService {
        return new AppearanceService(
            settingsMock.object,
            loggerMock.object,
            overlayContainerMock.object,
            applicationMock.object,
            fileAccessMock.object,
            desktopMock.object,
            defaultThemesCreatorMock.object,
            documentProxyMock.object
        );
    }

    function createDarkColors(): ThemeNeutralColors {
        return new ThemeNeutralColors(
            '#000000', // windowButtonIcon
            '#011111', // hoveredItemBackground
            '#022222', // selectedItemBackground
            '#033333', // tabText
            '#044444', // selectedTabText
            '#055555', // mainBackground
            '#066666', // headerBackground
            '#077777', // footerBackground
            '#088888', // sidePaneBackground
            '#099999', // primaryText
            '#0aaaaa', // secondaryText
            '#0bbbbb', // breadcrumbBackground
            '#0ccccc', // sliderBackground
            '#0ddddd', // sliderThumbBackground
            '#0eeeee', // albumCoverLogo
            '#0fffff', // albumCoverBackground
            '#0fffff', // paneSeparators
            '#0fffff', // settingsSeparators
            '#0fffff', // contextMenuSeparators
            '#0fffff', // scrollBars
            '#0fffff', // searchBox
            '#0fffff', // searchBoxText
            '#0fffff', // searchBoxIcon
            '#0fffff', // dialogBackground
            '#0fffff', // primaryButtonText
            '#0fffff', // secondaryButtonBackground
            '#0fffff', // secondaryButtonText
            '#0fffff' // tooltipText
        );
    }

    function createLightColors(): ThemeNeutralColors {
        return new ThemeNeutralColors(
            '#100000', // windowButtonIcon
            '#111111', // hoveredItemBackground
            '#122222', // selectedItemBackground
            '#133333', // tabText
            '#144444', // selectedTabText
            '#155555', // mainBackground
            '#166666', // headerBackground
            '#177777', // footerBackground
            '#188888', // sidePaneBackground
            '#199999', // primaryText
            '#1aaaaa', // secondaryText
            '#1bbbbb', // breadcrumbBackground
            '#1ccccc', // sliderBackground
            '#1ddddd', // sliderThumbBackground
            '#1eeeee', // albumCoverLogo
            '#1fffff', // albumCoverBackground
            '#1fffff', // paneSeparators
            '#1fffff', // settingsSeparators
            '#1fffff', // contextMenuSeparators
            '#1fffff', // scrollBars
            '#1fffff', // searchBox
            '#1fffff', // searchBoxText
            '#1fffff', // searchBoxIcon
            '#1fffff', // dialogBackground
            '#1fffff', // primaryButtonText
            '#1fffff', // secondaryButtonBackground
            '#1fffff', // secondaryButtonText
            '#1fffff' // tooltipText
        );
    }

    function createTheme(name: string, selectedItemText: string): Theme {
        const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
        const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
        const darkColors: ThemeNeutralColors = createDarkColors();
        const lightColors: ThemeNeutralColors = createLightColors();
        const options: ThemeOptions = new ThemeOptions(false);

        const theme: Theme = new Theme(name, creator, coreColors, darkColors, lightColors, options);

        return theme;
    }

    function createServiceWithSettingsStub(settingsStub: any): BaseAppearanceService {
        return new AppearanceService(
            settingsStub,
            loggerMock.object,
            overlayContainerMock.object,
            applicationMock.object,
            fileAccessMock.object,
            desktopMock.object,
            defaultThemesCreatorMock.object,
            documentProxyMock.object
        );
    }

    function assertSelectedThemeAccentColorCssProperties(): void {
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

    function assertSystemThemeAccentColorCssProperties(): void {
        expect(documentElementMock.style.getPropertyValue('--theme-primary-color')).toEqual('#00ff00');
        expect(documentElementMock.style.getPropertyValue('--theme-secondary-color')).toEqual('#00ff00');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color')).toEqual('#00ff00');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-50')).toEqual('#ffffff');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-100')).toEqual('#bdffbd');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-200')).toEqual('#85ff85');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-300')).toEqual('#3dff3d');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-400')).toEqual('#1fff1f');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-500')).toEqual('#00ff00');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-600')).toEqual('#00e000');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-700')).toEqual('#00c200');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-800')).toEqual('#00a300');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-900')).toEqual('#008500');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A100')).toEqual('#ffffff');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A200')).toEqual('#99ff99');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A400')).toEqual('#33ff33');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A700')).toEqual('#1aff1a');
    }

    function assertDarkColorCssProperties(scrollBars: string): void {
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
        expect(documentElementMock.style.getPropertyValue('--theme-pane-separators')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-settings-separators')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-context-menu-separators')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-scroll-bars')).toEqual(scrollBars);
        expect(documentElementMock.style.getPropertyValue('--theme-search-box')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-search-box-text')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-search-box-icon')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-dialog-background')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-primary-button-text')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-secondary-button-background')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-secondary-button-text')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-tooltip-text')).toEqual('#0fffff');
    }

    function assertLightColorCssProperties(scrollBars: string): void {
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
        expect(documentElementMock.style.getPropertyValue('--theme-pane-separators')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-settings-separators')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-context-menu-separators')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-scroll-bars')).toEqual(scrollBars);
        expect(documentElementMock.style.getPropertyValue('--theme-search-box')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-search-box-text')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-search-box-icon')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-dialog-background')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-primary-button-text')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-secondary-button-background')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-secondary-button-text')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-tooltip-text')).toEqual('#1fffff');
    }

    function resetElements(): void {
        containerElementMock = document.createElement('div');
        documentElementMock = document.createElement('div');
        bodyMock = document.createElement('div');
    }

    function resetFileAccessMock(): void {
        fileAccessMock.reset();
        fileAccessMock
            .setup((x) => x.getFilesInDirectory('/home/user/.config/Dopamine/Themes'))
            .returns(() => ['/home/user/.config/Dopamine/Themes/Theme 1.theme', '/home/user/.config/Dopamine/Themes/Theme 2.theme']);
        fileAccessMock.setup((x) => x.applicationDataDirectory()).returns(() => '/home/user/.config/Dopamine');
        fileAccessMock
            .setup((x) => x.combinePath(['/home/user/.config/Dopamine', 'Themes']))
            .returns(() => '/home/user/.config/Dopamine/Themes');

        fileAccessMock
            .setup((x) => x.getFileContentAsString('/home/user/.config/Dopamine/Themes/Theme 1.theme'))
            .returns(() => JSON.stringify(theme1));

        fileAccessMock
            .setup((x) => x.getFileContentAsString('/home/user/.config/Dopamine/Themes/Theme 2.theme'))
            .returns(() => JSON.stringify(theme2));

        fileAccessMock
            .setup((x) => x.combinePath(['/home/user/.config/Dopamine/Themes', 'Theme 1.theme']))
            .returns(() => '/home/user/.config/Dopamine/Themes/Theme 1.theme');
        fileAccessMock
            .setup((x) => x.combinePath(['/home/user/.config/Dopamine/Themes', 'Theme 2.theme']))
            .returns(() => '/home/user/.config/Dopamine/Themes/Theme 2.theme');
    }

    function resetDefaultThemesCreatorMock(): void {
        defaultThemesCreatorMock.reset();
        defaultThemesCreatorMock.setup((x) => x.createAllThemes()).returns(() => [theme1, theme2]);
    }

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        loggerMock = Mock.ofType<Logger>();
        overlayContainerMock = Mock.ofType<OverlayContainer>();
        applicationMock = Mock.ofType<BaseApplication>();
        fileAccessMock = Mock.ofType<BaseFileAccess>();
        desktopMock = Mock.ofType<BaseDesktop>();
        defaultThemesCreatorMock = Mock.ofType<DefaultThemesCreator>();
        documentProxyMock = Mock.ofType<DocumentProxy>();

        theme1 = createTheme('Theme 1', '');
        theme2 = createTheme('Theme 2', '#ffffff');

        resetDefaultThemesCreatorMock();
        resetFileAccessMock();

        containerElementMock = document.createElement('div');
        overlayContainerMock.setup((x) => x.getContainerElement()).returns(() => containerElementMock);

        documentElementMock = document.createElement('div');
        documentProxyMock.setup((x) => x.getDocumentElement()).returns(() => documentElementMock);

        bodyMock = document.createElement('div');
        documentProxyMock.setup((x) => x.getBody()).returns(() => bodyMock);

        desktopAccentColorChangedMock = new Subject();
        const desktopAccentColorChangedMock$: Observable<void> = desktopAccentColorChangedMock.asObservable();
        desktopMock.setup((x) => x.accentColorChanged$).returns(() => desktopAccentColorChangedMock$);

        desktopNativeThemeUpdatedMock = new Subject();
        const desktopNativeThemeUpdatedMock$: Observable<void> = desktopNativeThemeUpdatedMock.asObservable();
        desktopMock.setup((x) => x.nativeThemeUpdated$).returns(() => desktopNativeThemeUpdatedMock$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should set windowHasNativeTitleBar to true if the window has a frame', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getGlobal('windowHasFrame')).returns(() => true);

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            expect(service.windowHasNativeTitleBar).toBeTruthy();
        });

        it('should set windowHasNativeTitleBar to false if the window has no frame', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getGlobal('windowHasFrame')).returns(() => false);

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            expect(service.windowHasNativeTitleBar).toBeFalsy();
        });

        it('should set the themes directory path', () => {
            // Arrange

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            expect(service.themesDirectoryPath).toEqual('/home/user/.config/Dopamine/Themes');
        });

        it('should ensure that the themes directory exists', () => {
            // Arrange

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            fileAccessMock.verify((x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/.config/Dopamine/Themes'), Times.once());
        });

        it('should ensure that the default themes exist', () => {
            // Arrange

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            defaultThemesCreatorMock.verify((x) => x.createAllThemes(), Times.once());

            const theme1WithoutIsBroken = { ...theme1, isBroken: undefined };
            const theme2WithoutIsBroken = { ...theme2, isBroken: undefined };

            fileAccessMock.verify(
                (x) =>
                    x.writeToFile('/home/user/.config/Dopamine/Themes/Theme 1.theme', JSON.stringify(theme1WithoutIsBroken, undefined, 2)),
                Times.once()
            );
            fileAccessMock.verify(
                (x) =>
                    x.writeToFile('/home/user/.config/Dopamine/Themes/Theme 2.theme', JSON.stringify(theme2WithoutIsBroken, undefined, 2)),
                Times.once()
            );
        });

        it('should get themes from the themes directory', () => {
            // Arrange

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            fileAccessMock.verify((x) => x.getFilesInDirectory('/home/user/.config/Dopamine/Themes'), Times.once());
            fileAccessMock.verify((x) => x.getFileContentAsString('/home/user/.config/Dopamine/Themes/Theme 1.theme'), Times.once());
            fileAccessMock.verify((x) => x.getFileContentAsString('/home/user/.config/Dopamine/Themes/Theme 2.theme'), Times.once());
        });

        it('should set the selected theme from the settings', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            expect(service.selectedTheme).toEqual(theme2);
        });

        it('should set the selected font size from the settings', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.fontSize).returns(() => 14);

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            expect(service.selectedFontSize).toEqual(new FontSize(14));
        });

        it('should listen to accent color changes of the OS and apply the theme', () => {
            // Arrange
            const settingsStub: any = { theme: 'Theme 2' };

            // Act
            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            desktopAccentColorChangedMock.next();

            // Assert
            assertSelectedThemeAccentColorCssProperties();
        });

        it('should listen to native theme updates of the OS and apply the theme', () => {
            // Arrange
            const settingsStub: any = { theme: 'Theme 2' };

            // Act
            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            desktopNativeThemeUpdatedMock.next();

            // Assert
            assertSelectedThemeAccentColorCssProperties();
        });
    });

    describe('windowHasNativeTitleBar', () => {
        it('should return true if the window has a frame', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getGlobal('windowHasFrame')).returns(() => true);
            const service: BaseAppearanceService = createService();

            // Act
            const windowHasNativeTitleBar: boolean = service.windowHasNativeTitleBar;

            // Assert
            expect(windowHasNativeTitleBar).toBeTruthy();
        });

        it('should return true if the window has no frame', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getGlobal('windowHasFrame')).returns(() => false);
            const service: BaseAppearanceService = createService();

            // Act
            const windowHasNativeTitleBar: boolean = service.windowHasNativeTitleBar;

            // Assert
            expect(windowHasNativeTitleBar).toBeFalsy();
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
            service.selectedTheme = createTheme('My theme', '');

            // Act
            service.followSystemTheme = true;

            // Assert
            expect(settingsStub.followSystemTheme).toBeTruthy();
        });

        it('should apply the light theme if using the light theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: true };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme', '');
            resetElements();

            // Act
            service.followSystemTheme = false;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            assertLightColorCssProperties('#1fffff');
            expect(containerElementMock.classList).toContain('default-theme-light');
            expect(bodyMock.classList).toContain('default-theme-light');
        });

        it('should apply the dark theme if using the dark theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: false };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme', '');
            resetElements();

            // Act
            service.followSystemTheme = false;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            assertDarkColorCssProperties('#0fffff');
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
            service.selectedTheme = createTheme('My theme', '');

            // Act
            service.useLightBackgroundTheme = true;

            // Assert
            expect(settingsStub.useLightBackgroundTheme).toBeTruthy();
        });

        it('should apply the light theme if using the light theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: true };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme', '');
            resetElements();

            // Act
            service.useLightBackgroundTheme = true;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            assertLightColorCssProperties('#1fffff');
            expect(containerElementMock.classList).toContain('default-theme-light');
            expect(bodyMock.classList).toContain('default-theme-light');
        });

        it('should apply the dark theme if using the dark theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: false };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme', '');
            resetElements();

            // Act
            service.useLightBackgroundTheme = false;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            assertDarkColorCssProperties('#0fffff');
            expect(containerElementMock.classList).toContain('default-theme-dark');
            expect(bodyMock.classList).toContain('default-theme-dark');
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
            service.selectedTheme = createTheme('My theme', '');

            // Act
            service.followSystemColor = true;

            // Assert
            expect(settingsStub.followSystemColor).toBeTruthy();
        });

        it('should apply the light theme if using the light theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: true };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme', '');
            resetElements();

            // Act
            service.followSystemColor = false;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            assertLightColorCssProperties('#1fffff');
            expect(containerElementMock.classList).toContain('default-theme-light');
            expect(bodyMock.classList).toContain('default-theme-light');
        });

        it('should apply the dark theme if using the dark theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: false };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme', '');
            resetElements();

            // Act
            service.followSystemColor = false;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            assertDarkColorCssProperties('#0fffff');
            expect(containerElementMock.classList).toContain('default-theme-dark');
            expect(bodyMock.classList).toContain('default-theme-dark');
        });
    });

    describe('themes', () => {
        it('should return themes', () => {
            // Arrange
            const settingsStub: any = { theme: '' };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);

            // Act
            const themes: Theme[] = service.themes;

            // Assert
            expect(themes.length).toEqual(2);
            expect(themes[0].name).toBe('Theme 1');
            expect(themes[1].name).toBe('Theme 2');
        });

        it('should set themes', () => {
            // Arrange
            const settingsStub: any = { theme: '' };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);

            // Act
            service.themes = [theme1, theme2];

            // Assert
            expect(service.themes.length).toEqual(2);
            expect(service.themes[0]).toBe(theme1);
            expect(service.themes[1]).toBe(theme2);
        });
    });

    describe('selectedTheme', () => {
        it('should return the selected theme', () => {
            // Arrange
            const theme: Theme = createTheme('My theme', '');
            const settingsStub: any = { theme: '' };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);

            service.selectedTheme = theme;

            // Act
            const selectedTheme: Theme = service.selectedTheme;

            // Assert
            expect(selectedTheme).toBe(theme);
        });

        it('should save the theme in the settings', () => {
            // Arrange
            const theme: Theme = createTheme('My theme', '');
            const settingsStub: any = { theme: '' };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);

            // Act
            service.selectedTheme = theme;

            // Assert
            expect(settingsStub.theme).toEqual('My theme');
        });

        it('should apply the light theme if using the light theme', () => {
            // Arrange
            const theme: Theme = createTheme('My theme', '');
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: true, theme: '' };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme', '');
            resetElements();

            // Act
            service.selectedTheme = theme;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            assertLightColorCssProperties('#1fffff');
            expect(containerElementMock.classList).toContain('default-theme-light');
            expect(bodyMock.classList).toContain('default-theme-light');
        });

        it('should apply the dark theme if using the dark theme', () => {
            // Arrange
            const theme: Theme = createTheme('My theme', '');
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: false, theme: '' };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme', '');
            resetElements();

            // Act
            service.selectedTheme = theme;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            assertDarkColorCssProperties('#0fffff');
            expect(containerElementMock.classList).toContain('default-theme-dark');
            expect(bodyMock.classList).toContain('default-theme-dark');
        });
    });

    describe('fontSizes', () => {
        it('should return the font sizes', () => {
            // Arrange
            const service: BaseAppearanceService = createService();

            // Act
            const fontSizes: FontSize[] = service.fontSizes;

            // Assert
            expect(fontSizes).toEqual(Constants.fontSizes);
        });
    });

    describe('selectedFontSize', () => {
        it('should return the selected font size', () => {
            // Arrange
            const service: BaseAppearanceService = createService();

            // Act
            const fontSizes: FontSize[] = service.fontSizes;

            // Assert
            expect(fontSizes).toEqual(Constants.fontSizes);
        });

        it('should save font size in the settings', () => {
            // Arrange
            const settingsStub: any = { fontSize: 15 };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);

            // Act
            service.selectedFontSize = new FontSize(13);

            // Assert
            expect(settingsStub.fontSize).toEqual(13);
        });

        it('should apply the font size', () => {
            // Arrange
            const settingsStub: any = { fontSize: 15 };

            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);
            resetElements();

            // Act
            service.selectedFontSize = new FontSize(13);

            // Assert
            expect(documentElementMock.style.getPropertyValue('--fontsize-normal')).toEqual('13px');
            expect(documentElementMock.style.getPropertyValue('--fontsize-medium')).toEqual('14.859px');
            expect(documentElementMock.style.getPropertyValue('--fontsize-large')).toEqual('20.423px');
            expect(documentElementMock.style.getPropertyValue('--fontsize-extra-large')).toEqual('24.141px');
            expect(documentElementMock.style.getPropertyValue('--fontsize-mega')).toEqual('33.423px');
        });
    });

    describe('themesDirectoryPath', () => {
        it('should return the themes directory path', () => {
            // Arrange
            const service: BaseAppearanceService = createService();

            // Act
            const themesDirectoryPath: string = service.themesDirectoryPath;

            // Assert
            expect(themesDirectoryPath).toEqual('/home/user/.config/Dopamine/Themes');
        });
    });

    describe('refreshThemes', () => {
        it('should ensure that the default themes exist', () => {
            // Arrange
            const service: BaseAppearanceService = createService();
            resetDefaultThemesCreatorMock();
            resetFileAccessMock();

            // Act
            service.refreshThemes();

            // Assert
            defaultThemesCreatorMock.verify((x) => x.createAllThemes(), Times.once());
            const theme1WithoutIsBroken = { ...theme1, isBroken: undefined };
            const theme2WithoutIsBroken = { ...theme2, isBroken: undefined };

            fileAccessMock.verify(
                (x) =>
                    x.writeToFile('/home/user/.config/Dopamine/Themes/Theme 1.theme', JSON.stringify(theme1WithoutIsBroken, undefined, 2)),
                Times.once()
            );
            fileAccessMock.verify(
                (x) =>
                    x.writeToFile('/home/user/.config/Dopamine/Themes/Theme 2.theme', JSON.stringify(theme2WithoutIsBroken, undefined, 2)),
                Times.once()
            );
        });

        it('should get themes from the themes directory', () => {
            // Arrange
            const service: BaseAppearanceService = createService();
            resetFileAccessMock();

            // Act
            service.refreshThemes();

            // Assert
            fileAccessMock.verify((x) => x.getFilesInDirectory('/home/user/.config/Dopamine/Themes'), Times.once());
            fileAccessMock.verify((x) => x.getFileContentAsString('/home/user/.config/Dopamine/Themes/Theme 1.theme'), Times.once());
            fileAccessMock.verify((x) => x.getFileContentAsString('/home/user/.config/Dopamine/Themes/Theme 2.theme'), Times.once());
        });

        it('should set the selected theme from the settings', () => {
            // Arrange
            const settingsStub: any = { theme: 'Theme 2' };
            const service: BaseAppearanceService = createServiceWithSettingsStub(settingsStub);

            service.selectedTheme = theme1;
            settingsStub.theme = 'Theme 2';

            // Act
            service.refreshThemes();

            // Assert
            expect(service.selectedTheme).toEqual(theme2);
        });

        it('should apply the selected theme', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');

            const service: BaseAppearanceService = createService();

            // Act
            service.refreshThemes();

            // Assert
            assertSelectedThemeAccentColorCssProperties();
        });
    });

    describe('applyAppearance', () => {
        it('should apply the selected font size', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);

            const service: BaseAppearanceService = createService();

            resetElements();

            // Act
            service.applyAppearance();

            // Assert
            expect(documentElementMock.style.getPropertyValue('--fontsize-normal')).toEqual('13px');
            expect(documentElementMock.style.getPropertyValue('--fontsize-medium')).toEqual('14.859px');
            expect(documentElementMock.style.getPropertyValue('--fontsize-large')).toEqual('20.423px');
            expect(documentElementMock.style.getPropertyValue('--fontsize-extra-large')).toEqual('24.141px');
            expect(documentElementMock.style.getPropertyValue('--fontsize-mega')).toEqual('33.423px');
        });

        it('should apply the dark theme of the selected theme when follow the system theme is disabled and use light background theme is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);

            const service: BaseAppearanceService = createService();

            resetElements();

            // Act
            service.applyAppearance();

            // Assert
            assertDarkColorCssProperties('#0fffff');
        });

        it('should apply the light theme of the selected theme when follow the system theme is disabled and use light background theme is enabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => true);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);

            const service: BaseAppearanceService = createService();

            resetElements();

            // Act
            service.applyAppearance();

            // Assert
            assertLightColorCssProperties('#1fffff');
        });

        it('should apply the dark theme of the selected theme when follow the system theme is enabled and the desktop is using a dark theme', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => true);
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => true);

            const service: BaseAppearanceService = createService();

            resetElements();

            // Act
            service.applyAppearance();

            // Assert
            assertDarkColorCssProperties('#0fffff');
        });

        it('should apply the light theme of the selected theme when follow the system theme is enabled and the desktop is using a light theme', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => true);

            const service: BaseAppearanceService = createService();

            resetElements();

            // Act
            service.applyAppearance();

            // Assert
            assertLightColorCssProperties('#1fffff');
        });

        it('should apply the colors of the selected theme when follow the system color is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);
            const service: BaseAppearanceService = createService();
            resetElements();

            // Act
            service.applyAppearance();

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            assertDarkColorCssProperties('#0fffff');
        });

        it('should apply the colors of the system when follow the system color is enabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            desktopMock.setup((x) => x.getAccentColor()).returns(() => '00ff00ff');
            settingsMock.setup((x) => x.followSystemColor).returns(() => true);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);
            const service: BaseAppearanceService = createService();
            resetElements();

            // Act
            service.applyAppearance();

            // Assert
            assertSystemThemeAccentColorCssProperties();
            assertDarkColorCssProperties('#00ff00');
        });

        it('should apply a correct margin when not using system title bar search is visible', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 1');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => false);
            const service: BaseAppearanceService = createService();
            resetElements();

            // Act
            service.applyAppearance();

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('350px');
        });

        it('should apply a correct margin when using system title bar search is visible', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 1');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => true);
            const service: BaseAppearanceService = createService();
            resetElements();

            // Act
            service.applyAppearance();

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('215px');
        });
    });

    describe('applyMargins', () => {
        it('should apply a correct margin when not using system title bar search is visible', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => false);
            const service: BaseAppearanceService = createService();
            resetElements();

            // Act
            service.applyMargins(true);

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('350px');
        });

        it('should apply a correct margin when not using system title bar search is not visible', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => false);
            const service: BaseAppearanceService = createService();
            resetElements();

            // Act
            service.applyMargins(false);

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('180px');
        });

        it('should apply a correct margin when using system title bar search is visible', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => true);
            const service: BaseAppearanceService = createService();
            resetElements();

            // Act
            service.applyMargins(true);

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('215px');
        });

        it('should apply a correct margin when using system title bar search is not visible', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => true);
            const service: BaseAppearanceService = createService();
            resetElements();

            // Act
            service.applyMargins(false);

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('45px');
        });
    });
});
