import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { Constants } from '../../common/application/constants';
import { DocumentProxy } from '../../common/io/document-proxy';
import { Logger } from '../../common/logger';
import { SettingsBase } from '../../common/settings/settings.base';
import { AppearanceService } from './appearance.service';
import { DefaultThemesCreator } from './default-themes-creator';
import { Theme } from './theme/theme';
import { ThemeCoreColors } from './theme/theme-core-colors';
import { ThemeCreator } from './theme/theme-creator';
import { ThemeNeutralColors } from './theme/theme-neutral-colors';
import { ThemeOptions } from './theme/theme-options';
import { DesktopBase } from '../../common/io/desktop.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { ApplicationBase } from '../../common/io/application.base';
import { AppearanceServiceBase } from './appearance.service.base';
import { RgbColor } from '../../common/rgb-color';
import { ApplicationPaths } from '../../common/application/application-paths';
import { PlaybackService } from '../playback/playback.service';
import { AlbumAccentColorService } from '../album-accent-color/album-accent-color.service';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';
import { MockCreator } from '../../testing/mock-creator';

describe('AppearanceService', () => {
    let settingsMock: IMock<SettingsBase>;
    let loggerMock: IMock<Logger>;
    let overlayContainerMock: IMock<OverlayContainer>;
    let applicationMock: IMock<ApplicationBase>;
    let fileAccessMock: IMock<FileAccessBase>;
    let desktopMock: IMock<DesktopBase>;
    let defaultThemesCreatorMock: IMock<DefaultThemesCreator>;
    let documentProxyMock: IMock<DocumentProxy>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let playbackServiceMock: IMock<PlaybackService>;
    let albumAccentColorServiceMock: IMock<AlbumAccentColorService>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;

    let containerElementMock: HTMLElement;
    let documentElementMock: HTMLElement;
    let bodyMock: HTMLElement;

    let theme1: Theme;
    let theme2: Theme;

    let desktopAccentColorChangedMock: Subject<void>;
    let desktopNativeThemeUpdatedMock: Subject<void>;

    let applicationFullScreenChangedMock: Subject<boolean>;
    let applicationFullScreenChangedMock$: Observable<boolean>;

    const flushPromises = () => new Promise(process.nextTick);

    function createService(): AppearanceServiceBase {
        return new AppearanceService(
            settingsMock.object,
            loggerMock.object,
            overlayContainerMock.object,
            applicationMock.object,
            fileAccessMock.object,
            desktopMock.object,
            defaultThemesCreatorMock.object,
            documentProxyMock.object,
            applicationPathsMock.object,
            playbackServiceMock.object,
            albumAccentColorServiceMock.object,
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
            '#0ccccc',
            '#0ddddd',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
            '#0fffff',
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
            '#1ccccc',
            '#1ddddd',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
            '#1fffff',
        );
    }

    function createTheme(name: string): Theme {
        const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
        const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
        const darkColors: ThemeNeutralColors = createDarkColors();
        const lightColors: ThemeNeutralColors = createLightColors();
        const options: ThemeOptions = new ThemeOptions(false);

        return new Theme(name, creator, coreColors, darkColors, lightColors, options);
    }

    function createServiceWithSettingsStub(settingsStub: any): AppearanceServiceBase {
        return new AppearanceService(
            settingsStub,
            loggerMock.object,
            overlayContainerMock.object,
            applicationMock.object,
            fileAccessMock.object,
            desktopMock.object,
            defaultThemesCreatorMock.object,
            documentProxyMock.object,
            applicationPathsMock.object,
            playbackServiceMock.object,
            albumAccentColorServiceMock.object,
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

    function assertAlbumCoverAccentColorCssProperties(): void {
        expect(documentElementMock.style.getPropertyValue('--theme-primary-color')).toEqual('#001122');
        expect(documentElementMock.style.getPropertyValue('--theme-secondary-color')).toEqual('#001122');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color')).toEqual('#001122');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-50')).toEqual('#2c96ff');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-100')).toEqual('#006fdf');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-200')).toEqual('#0053a7');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-300')).toEqual('#00305f');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-400')).toEqual('#002041');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-500')).toEqual('#001122');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-600')).toEqual('#000203');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-700')).toEqual('#000000');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-800')).toEqual('#000000');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-900')).toEqual('#000000');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A100')).toEqual('#2290ff');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A200')).toEqual('#005dbb');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A400')).toEqual('#002a55');
        expect(documentElementMock.style.getPropertyValue('--theme-accent-color-A700')).toEqual('#001e3b');
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
        expect(documentElementMock.style.getPropertyValue('--theme-slider-background')).toEqual('#0ccccc');
        expect(documentElementMock.style.getPropertyValue('--theme-slider-thumb-background')).toEqual('#0ddddd');
        expect(documentElementMock.style.getPropertyValue('--theme-album-cover-background')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-header-separator')).toEqual('#0fffff');
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
        expect(documentElementMock.style.getPropertyValue('--theme-button-border')).toEqual('#0fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-highlight-foreground')).toEqual('#0fffff');
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
        expect(documentElementMock.style.getPropertyValue('--theme-slider-background')).toEqual('#1ccccc');
        expect(documentElementMock.style.getPropertyValue('--theme-slider-thumb-background')).toEqual('#1ddddd');
        expect(documentElementMock.style.getPropertyValue('--theme-album-cover-background')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-header-separator')).toEqual('#1fffff');
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
        expect(documentElementMock.style.getPropertyValue('--theme-button-border')).toEqual('#1fffff');
        expect(documentElementMock.style.getPropertyValue('--theme-highlight-foreground')).toEqual('#1fffff');
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
        settingsMock = Mock.ofType<SettingsBase>();
        loggerMock = Mock.ofType<Logger>();
        overlayContainerMock = Mock.ofType<OverlayContainer>();
        applicationMock = Mock.ofType<ApplicationBase>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        desktopMock = Mock.ofType<DesktopBase>();
        defaultThemesCreatorMock = Mock.ofType<DefaultThemesCreator>();
        documentProxyMock = Mock.ofType<DocumentProxy>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        playbackServiceMock = Mock.ofType<PlaybackService>();
        albumAccentColorServiceMock = Mock.ofType<AlbumAccentColorService>();

        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStartedMock$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStartedMock$);

        theme1 = createTheme('Theme 1');
        theme2 = createTheme('Theme 2');

        resetDefaultThemesCreatorMock();
        resetFileAccessMock();

        applicationPathsMock.setup((x) => x.themesDirectoryFullPath()).returns(() => '/home/user/.config/Dopamine/Themes');

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

        applicationFullScreenChangedMock = new Subject();
        applicationFullScreenChangedMock$ = applicationFullScreenChangedMock.asObservable();
        applicationMock.setup((x) => x.fullScreenChanged$).returns(() => applicationFullScreenChangedMock$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: AppearanceServiceBase = createService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should set default accentRgbColor', () => {
            // Arrange

            // Act
            const service: AppearanceServiceBase = createService();

            // Assert
            expect(service.accentRgbColor.red).toEqual(RgbColor.default().red);
            expect(service.accentRgbColor.green).toEqual(RgbColor.default().green);
            expect(service.accentRgbColor.blue).toEqual(RgbColor.default().blue);
        });

        it('should set default backgroundRgbColor', () => {
            // Arrange

            // Act
            const service: AppearanceServiceBase = createService();

            // Assert
            expect(service.backgroundRgbColor.red).toEqual(RgbColor.default().red);
            expect(service.backgroundRgbColor.green).toEqual(RgbColor.default().green);
            expect(service.backgroundRgbColor.blue).toEqual(RgbColor.default().blue);
        });

        it('should set windowHasNativeTitleBar to true if the window has a frame', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getGlobal('windowHasFrame')).returns(() => true);
            applicationMock.setup((x) => x.fullScreenChanged$).returns(() => applicationFullScreenChangedMock$);

            // Act
            const service: AppearanceServiceBase = createService();

            // Assert
            expect(service.windowHasNativeTitleBar).toBeTruthy();
        });

        it('should set windowHasNativeTitleBar to false if the window has no frame', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getGlobal('windowHasFrame')).returns(() => false);
            applicationMock.setup((x) => x.fullScreenChanged$).returns(() => applicationFullScreenChangedMock$);

            // Act
            const service: AppearanceServiceBase = createService();

            // Assert
            expect(service.windowHasNativeTitleBar).toBeFalsy();
        });

        it('should set the themes directory path', () => {
            // Arrange, Act
            const service: AppearanceServiceBase = createService();

            // Assert
            expect(service.themesDirectoryPath).toEqual('/home/user/.config/Dopamine/Themes');
        });

        it('should ensure that the themes directory exists', () => {
            // Arrange, Act
            createService();

            // Assert
            fileAccessMock.verify((x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/.config/Dopamine/Themes'), Times.once());
        });

        it('should ensure that the default themes exist', () => {
            // Arrange, Act
            createService();

            // Assert
            defaultThemesCreatorMock.verify((x) => x.createAllThemes(), Times.once());

            const theme1WithoutIsBroken = { ...theme1, isBroken: undefined };
            const theme2WithoutIsBroken = { ...theme2, isBroken: undefined };

            fileAccessMock.verify(
                (x) =>
                    x.writeToFile('/home/user/.config/Dopamine/Themes/Theme 1.theme', JSON.stringify(theme1WithoutIsBroken, undefined, 2)),
                Times.once(),
            );
            fileAccessMock.verify(
                (x) =>
                    x.writeToFile('/home/user/.config/Dopamine/Themes/Theme 2.theme', JSON.stringify(theme2WithoutIsBroken, undefined, 2)),
                Times.once(),
            );
        });

        it('should get themes from the themes directory', () => {
            // Arrange, Act
            createService();

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
            const service: AppearanceServiceBase = createService();

            // Assert
            expect(service.selectedTheme).toEqual(theme2);
        });

        it('should set the selected font size from the settings', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.fontSize).returns(() => 14);

            // Act
            const service: AppearanceServiceBase = createService();

            // Assert
            expect(service.selectedFontSize).toEqual(14);
        });

        it('should listen to accent color changes of the OS and apply the theme', () => {
            // Arrange
            const settingsStub: any = { theme: 'Theme 2' };

            // Act
            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            desktopAccentColorChangedMock.next();

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
        });

        it('should listen to native theme updates of the OS and apply the theme', () => {
            // Arrange
            const settingsStub: any = { theme: 'Theme 2' };

            // Act
            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            desktopNativeThemeUpdatedMock.next();

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
        });
    });

    describe('windowHasNativeTitleBar', () => {
        it('should return true if the window has a frame', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getGlobal('windowHasFrame')).returns(() => true);
            applicationMock.setup((x) => x.fullScreenChanged$).returns(() => applicationFullScreenChangedMock$);
            const service: AppearanceServiceBase = createService();

            // Act
            const windowHasNativeTitleBar: boolean = service.windowHasNativeTitleBar;

            // Assert
            expect(windowHasNativeTitleBar).toBeTruthy();
        });

        it('should return true if the window has no frame', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getGlobal('windowHasFrame')).returns(() => false);
            applicationMock.setup((x) => x.fullScreenChanged$).returns(() => applicationFullScreenChangedMock$);
            const service: AppearanceServiceBase = createService();

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

            const service: AppearanceServiceBase = createService();

            // Act
            const isUsingLightTheme: boolean = service.isUsingLightTheme;

            // Assert
            expect(isUsingLightTheme).toBeTruthy();
        });

        it('should return false when not following the system theme and settings do not request to use a light theme', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);

            const service: AppearanceServiceBase = createService();

            // Act
            const isUsingLightTheme: boolean = service.isUsingLightTheme;

            // Assert
            expect(isUsingLightTheme).toBeFalsy();
        });

        it('should return true when following the system theme and the system is not using a dark theme', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemTheme).returns(() => true);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);

            const service: AppearanceServiceBase = createService();

            // Act
            const isUsingLightTheme: boolean = service.isUsingLightTheme;

            // Assert
            expect(isUsingLightTheme).toBeTruthy();
        });

        it('should return false when following the system theme and the system is using a dark theme', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemTheme).returns(() => true);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => true);

            const service: AppearanceServiceBase = createService();

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

            const service: AppearanceServiceBase = createService();

            // Act
            const followSystemTheme: boolean = service.followSystemTheme;

            // Assert
            expect(followSystemTheme).toBeFalsy();
        });

        it('should return true if the settings contain true', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemTheme).returns(() => true);

            const service: AppearanceServiceBase = createService();

            // Act
            const followSystemTheme: boolean = service.followSystemTheme;

            // Assert
            expect(followSystemTheme).toBeTruthy();
        });

        it('should save followSystemTheme to settings', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');

            // Act
            service.followSystemTheme = true;

            // Assert
            expect(settingsStub.followSystemTheme).toBeTruthy();
        });

        it('should apply the light theme if using the light theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: true };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');
            resetElements();

            // Act
            service.followSystemTheme = false;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
            assertLightColorCssProperties('#1fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(21, 85, 85))).toBeTruthy();
            expect(containerElementMock.classList).toContain('default-theme-light');
            expect(bodyMock.classList).toContain('default-theme-light');
        });

        it('should apply the dark theme if using the dark theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: false };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');
            resetElements();

            // Act
            service.followSystemTheme = false;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
            assertDarkColorCssProperties('#0fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(5, 85, 85))).toBeTruthy();
            expect(containerElementMock.classList).toContain('default-theme-dark');
            expect(bodyMock.classList).toContain('default-theme-dark');
        });
    });

    describe('useLightBackgroundTheme', () => {
        it('should return false if the settings contain false', () => {
            // Arrange
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);

            const service: AppearanceServiceBase = createService();

            // Act
            const useLightBackgroundTheme: boolean = service.useLightBackgroundTheme;

            // Assert
            expect(useLightBackgroundTheme).toBeFalsy();
        });

        it('should return true if the settings contain true', () => {
            // Arrange
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => true);

            const service: AppearanceServiceBase = createService();

            // Act
            const useLightBackgroundTheme: boolean = service.useLightBackgroundTheme;

            // Assert
            expect(useLightBackgroundTheme).toBeTruthy();
        });

        it('should save useLightBackgroundTheme to settings', () => {
            // Arrange
            const settingsStub: any = { useLightBackgroundTheme: false };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');

            // Act
            service.useLightBackgroundTheme = true;

            // Assert
            expect(settingsStub.useLightBackgroundTheme).toBeTruthy();
        });

        it('should apply the light theme if using the light theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: true };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');
            resetElements();

            // Act
            service.useLightBackgroundTheme = true;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
            assertLightColorCssProperties('#1fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(21, 85, 85))).toBeTruthy();
            expect(containerElementMock.classList).toContain('default-theme-light');
            expect(bodyMock.classList).toContain('default-theme-light');
        });

        it('should apply the dark theme if using the dark theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: false };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');
            resetElements();

            // Act
            service.useLightBackgroundTheme = false;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
            assertDarkColorCssProperties('#0fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(5, 85, 85))).toBeTruthy();
            expect(containerElementMock.classList).toContain('default-theme-dark');
            expect(bodyMock.classList).toContain('default-theme-dark');
        });
    });

    describe('followSystemColor', () => {
        it('should return false if the settings contain false', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);

            const service: AppearanceServiceBase = createService();

            // Act
            const followSystemColor: boolean = service.followSystemColor;

            // Assert
            expect(followSystemColor).toBeFalsy();
        });

        it('should return true if the settings contain true', () => {
            // Arrange
            settingsMock.setup((x) => x.followSystemColor).returns(() => true);

            const service: AppearanceServiceBase = createService();

            // Act
            const followSystemColor: boolean = service.followSystemColor;

            // Assert
            expect(followSystemColor).toBeTruthy();
        });

        it('should save followSystemColor to settings', () => {
            // Arrange
            const settingsStub: any = { followSystemColor: false };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');

            // Act
            service.followSystemColor = true;

            // Assert
            expect(settingsStub.followSystemColor).toBeTruthy();
        });

        it('should apply the light theme if using the light theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: true };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');
            resetElements();

            // Act
            service.followSystemColor = false;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
            assertLightColorCssProperties('#1fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(21, 85, 85))).toBeTruthy();
            expect(containerElementMock.classList).toContain('default-theme-light');
            expect(bodyMock.classList).toContain('default-theme-light');
        });

        it('should apply the dark theme if using the dark theme', () => {
            // Arrange
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: false };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');
            resetElements();

            // Act
            service.followSystemColor = false;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
            assertDarkColorCssProperties('#0fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(5, 85, 85))).toBeTruthy();
            expect(containerElementMock.classList).toContain('default-theme-dark');
            expect(bodyMock.classList).toContain('default-theme-dark');
        });
    });

    describe('themes', () => {
        it('should return themes', () => {
            // Arrange
            const settingsStub: any = { theme: '' };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);

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

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);

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
            const theme: Theme = createTheme('My theme');
            const settingsStub: any = { theme: '' };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);

            service.selectedTheme = theme;

            // Act
            const selectedTheme: Theme = service.selectedTheme;

            // Assert
            expect(selectedTheme).toBe(theme);
        });

        it('should save the theme in the settings', () => {
            // Arrange
            const theme: Theme = createTheme('My theme');
            const settingsStub: any = { theme: '' };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);

            // Act
            service.selectedTheme = theme;

            // Assert
            expect(settingsStub.theme).toEqual('My theme');
        });

        it('should apply the light theme if using the light theme', () => {
            // Arrange
            const theme: Theme = createTheme('My theme');
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: true, theme: '' };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');
            resetElements();

            // Act
            service.selectedTheme = theme;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
            assertLightColorCssProperties('#1fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(21, 85, 85))).toBeTruthy();
            expect(containerElementMock.classList).toContain('default-theme-light');
            expect(bodyMock.classList).toContain('default-theme-light');
        });

        it('should apply the dark theme if using the dark theme', () => {
            // Arrange
            const theme: Theme = createTheme('My theme');
            const settingsStub: any = { followSystemTheme: false, useLightBackgroundTheme: false, theme: '' };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            service.selectedTheme = createTheme('My theme');
            resetElements();

            // Act
            service.selectedTheme = theme;

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
            assertDarkColorCssProperties('#0fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(5, 85, 85))).toBeTruthy();
            expect(containerElementMock.classList).toContain('default-theme-dark');
            expect(bodyMock.classList).toContain('default-theme-dark');
        });
    });

    describe('fontSizes', () => {
        it('should return the font sizes', () => {
            // Arrange
            const service: AppearanceServiceBase = createService();

            // Act
            const fontSizes: number[] = service.fontSizes;

            // Assert
            expect(fontSizes).toEqual(Constants.fontSizes);
        });
    });

    describe('selectedFontSize', () => {
        it('should return the selected font size', () => {
            // Arrange
            const service: AppearanceServiceBase = createService();

            // Act
            const fontSizes: number[] = service.fontSizes;

            // Assert
            expect(fontSizes).toEqual(Constants.fontSizes);
        });

        it('should save font size in the settings', () => {
            // Arrange
            const settingsStub: any = { fontSize: 15 };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);

            // Act
            service.selectedFontSize = 13;

            // Assert
            expect(settingsStub.fontSize).toEqual(13);
        });

        it('should apply the font size', () => {
            // Arrange
            const settingsStub: any = { fontSize: 15 };

            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);
            resetElements();

            // Act
            service.selectedFontSize = 13;

            // Assert
            expect(documentElementMock.style.getPropertyValue('--fontsize')).toEqual('13px');
        });
    });

    describe('themesDirectoryPath', () => {
        it('should return the themes directory path', () => {
            // Arrange
            const service: AppearanceServiceBase = createService();

            // Act
            const themesDirectoryPath: string = service.themesDirectoryPath;

            // Assert
            expect(themesDirectoryPath).toEqual('/home/user/.config/Dopamine/Themes');
        });
    });

    describe('refreshThemes', () => {
        it('should ensure that the default themes exist', () => {
            // Arrange
            const service: AppearanceServiceBase = createService();
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
                Times.once(),
            );
            fileAccessMock.verify(
                (x) =>
                    x.writeToFile('/home/user/.config/Dopamine/Themes/Theme 2.theme', JSON.stringify(theme2WithoutIsBroken, undefined, 2)),
                Times.once(),
            );
        });

        it('should get themes from the themes directory', () => {
            // Arrange
            const service: AppearanceServiceBase = createService();
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
            const service: AppearanceServiceBase = createServiceWithSettingsStub(settingsStub);

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

            const service: AppearanceServiceBase = createService();

            // Act
            service.refreshThemes();

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
        });
    });

    describe('applyAppearanceAsync', () => {
        it('should apply the selected font size', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);

            const service: AppearanceServiceBase = createService();

            resetElements();

            // Act
            await service.applyAppearanceAsync();
            await flushPromises();

            // Assert
            expect(documentElementMock.style.getPropertyValue('--fontsize')).toEqual('13px');
        });

        it('should apply the dark theme of the selected theme when follow the system theme and follow album cover color are disabled and use light background theme is disabled', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);
            settingsMock.setup((x) => x.followAlbumCoverColor).returns(() => false);

            const service: AppearanceServiceBase = createService();

            resetElements();

            // Act
            await service.applyAppearanceAsync();
            await flushPromises();

            // Assert
            assertDarkColorCssProperties('#0fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(5, 85, 85))).toBeTruthy();
        });

        it('should apply the light theme of the selected theme when follow the system theme and follow album cover color are disabled and use light background theme is enabled', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => true);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);
            settingsMock.setup((x) => x.followAlbumCoverColor).returns(() => false);

            const service: AppearanceServiceBase = createService();

            resetElements();

            // Act
            await service.applyAppearanceAsync();
            await flushPromises();

            // Assert
            assertLightColorCssProperties('#1fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(21, 85, 85))).toBeTruthy();
        });

        it('should apply the dark theme of the selected theme when follow the system theme is enabled and follow album cover color is disabled and the desktop is using a dark theme', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => true);
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => true);
            settingsMock.setup((x) => x.followAlbumCoverColor).returns(() => false);

            const service: AppearanceServiceBase = createService();

            resetElements();

            // Act
            await service.applyAppearanceAsync();
            await flushPromises();

            // Assert
            assertDarkColorCssProperties('#0fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(5, 85, 85))).toBeTruthy();
        });

        it('should apply the light theme of the selected theme when follow the system theme is enabled and follow album cover color is disabled and the desktop is using a light theme', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => true);
            settingsMock.setup((x) => x.followAlbumCoverColor).returns(() => false);

            const service: AppearanceServiceBase = createService();

            resetElements();

            // Act
            await service.applyAppearanceAsync();
            await flushPromises();

            // Assert
            assertLightColorCssProperties('#1fffff');
            expect(service.backgroundRgbColor.equals(new RgbColor(21, 85, 85))).toBeTruthy();
        });

        it('should apply the colors of the selected theme when follow the system color and follow album cover color are disabled ', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followAlbumCoverColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);
            const service: AppearanceServiceBase = createService();
            resetElements();

            // Act
            await service.applyAppearanceAsync();
            await flushPromises();

            // Assert
            assertSelectedThemeAccentColorCssProperties();
            assertDarkColorCssProperties('#0fffff');
            expect(service.accentRgbColor.equals(new RgbColor(204, 204, 204))).toBeTruthy();
            expect(service.backgroundRgbColor.equals(new RgbColor(5, 85, 85))).toBeTruthy();
        });

        it('should apply the colors of the system when follow the system color is enabled and follow album cover color is disabled', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            desktopMock.setup((x) => x.getAccentColor()).returns(() => '00ff00ff');
            settingsMock.setup((x) => x.followSystemColor).returns(() => true);
            settingsMock.setup((x) => x.followAlbumCoverColor).returns(() => false);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);
            const service: AppearanceServiceBase = createService();
            resetElements();

            // Act
            await service.applyAppearanceAsync();
            await flushPromises();

            // Assert
            assertSystemThemeAccentColorCssProperties();
            assertDarkColorCssProperties('#00ff00');
            expect(service.accentRgbColor.equals(new RgbColor(0, 255, 0))).toBeTruthy();
            expect(service.backgroundRgbColor.equals(new RgbColor(5, 85, 85))).toBeTruthy();
        });

        it('should apply the colors of the album cover when follow the system color is disabled and follow album cover color is enabled', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 2');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useLightBackgroundTheme).returns(() => false);
            desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => false);
            desktopMock.setup((x) => x.getAccentColor()).returns(() => '00ff00ff');
            settingsMock.setup((x) => x.followSystemColor).returns(() => false);
            settingsMock.setup((x) => x.followAlbumCoverColor).returns(() => true);
            settingsMock.setup((x) => x.followSystemTheme).returns(() => false);

            const currentTrack: TrackModel = MockCreator.createTrackModelWithAlbumKey('path1', 'albumKey1');
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => currentTrack);
            albumAccentColorServiceMock.setup((x) => x.getAlbumAccentColorAsync('albumKey1')).returns(() => Promise.resolve('#001122'));

            const service: AppearanceServiceBase = createService();
            resetElements();

            // Act
            await service.applyAppearanceAsync();
            await flushPromises();

            // Assert
            assertAlbumCoverAccentColorCssProperties();
            assertDarkColorCssProperties('#001122');
            expect(service.accentRgbColor.equals(new RgbColor(0, 17, 34))).toBeTruthy();
            expect(service.backgroundRgbColor.equals(new RgbColor(5, 85, 85))).toBeTruthy();
        });

        it('should apply a correct margin when not using system title bar search is visible', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 1');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => false);
            const service: AppearanceServiceBase = createService();
            resetElements();

            // Act
            await service.applyAppearanceAsync();
            await flushPromises();

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('354px');
        });

        it('should apply a correct margin when using system title bar search is visible', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.theme).returns(() => 'Theme 1');
            settingsMock.setup((x) => x.fontSize).returns(() => 13);
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => true);
            const service: AppearanceServiceBase = createService();
            resetElements();

            // Act
            await service.applyAppearanceAsync();
            await flushPromises();

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('219px');
        });
    });

    describe('applyMargins', () => {
        it('should apply a correct margin when not using system title bar search is visible', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => false);
            const service: AppearanceServiceBase = createService();
            resetElements();

            // Act
            service.applyMargins(true);

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('354px');
        });

        it('should apply a correct margin when not using system title bar search is not visible', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => false);
            const service: AppearanceServiceBase = createService();
            resetElements();

            // Act
            service.applyMargins(false);

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('184px');
        });

        it('should apply a correct margin when using system title bar search is visible', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => true);
            const service: AppearanceServiceBase = createService();
            resetElements();

            // Act
            service.applyMargins(true);

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('219px');
        });

        it('should apply a correct margin when using system title bar search is not visible', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.useSystemTitleBar).returns(() => true);
            const service: AppearanceServiceBase = createService();
            resetElements();

            // Act
            service.applyMargins(false);

            // Assert
            expect(documentElementMock.style.getPropertyValue('--mat-tab-header-margin-right')).toEqual('49px');
        });
    });
});
