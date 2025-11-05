import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationPaths } from '../../common/application/application-paths';
import { Constants } from '../../common/application/constants';
import { ColorConverter } from '../../common/color-converter';
import { DocumentProxy } from '../../common/io/document-proxy';
import { Logger } from '../../common/logger';
import { SettingsBase } from '../../common/settings/settings.base';
import { StringUtils } from '../../common/utils/string-utils';
import { DefaultThemesCreator } from './default-themes-creator';
import { Palette } from './palette';
import { Theme } from './theme/theme';
import { ThemeNeutralColors } from './theme/theme-neutral-colors';
import { AppearanceServiceBase } from './appearance.service.base';
import { ApplicationBase } from '../../common/io/application.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { DesktopBase } from '../../common/io/desktop.base';
import { RgbColor } from '../../common/rgb-color';
import { PlaybackService } from '../playback/playback.service';
import { PlaybackStarted } from '../playback/playback-started';
import { AlbumAccentColorService } from '../album-accent-color/album-accent-color.service';
import { PromiseUtils } from '../../common/utils/promise-utils';

@Injectable()
export class AppearanceService implements AppearanceServiceBase {
    private interval: number;
    private _themes: Theme[] = [];

    private _windowHasNativeTitleBar: boolean;
    private _selectedTheme: Theme;
    private _selectedFontSize: number;
    private subscription: Subscription = new Subscription();

    private _themesDirectoryPath: string;

    private _accentRgbColor: RgbColor = RgbColor.default();
    private _backgroundRgbColor: RgbColor = RgbColor.default();

    private _isMacOS: boolean;
    private _isFullScreen: boolean;

    public constructor(
        private settings: SettingsBase,
        private logger: Logger,
        private overlayContainer: OverlayContainer,
        private application: ApplicationBase,
        private fileAccess: FileAccessBase,
        private desktop: DesktopBase,
        private defaultThemesCreator: DefaultThemesCreator,
        private documentProxy: DocumentProxy,
        private applicationPaths: ApplicationPaths,
        private playbackService: PlaybackService,
        private albumAccentColorService: AlbumAccentColorService,
    ) {
        this.initialize();
    }

    public get accentRgbColor(): RgbColor {
        return this._accentRgbColor;
    }

    public get backgroundRgbColor(): RgbColor {
        return this._backgroundRgbColor;
    }

    public get windowHasNativeTitleBar(): boolean {
        return this._windowHasNativeTitleBar;
    }

    public get needsTrafficLightMargin(): boolean {
        return !this.windowHasNativeTitleBar && this._isMacOS && !this._isFullScreen;
    }

    public get needsCustomWindowControls(): boolean {
        return !this.windowHasNativeTitleBar && !this._isMacOS;
    }

    public get isUsingLightTheme(): boolean {
        return (
            (!this.settings.followSystemTheme && this.settings.useLightBackgroundTheme) ||
            (this.settings.followSystemTheme && !this.isSystemUsingDarkTheme())
        );
    }

    public get followSystemTheme(): boolean {
        return this.settings.followSystemTheme;
    }

    public set followSystemTheme(v: boolean) {
        this.settings.followSystemTheme = v;
        PromiseUtils.noAwait(this.safeApplyThemeAsync());
    }

    public get useLightBackgroundTheme(): boolean {
        return this.settings.useLightBackgroundTheme;
    }

    public set useLightBackgroundTheme(v: boolean) {
        this.settings.useLightBackgroundTheme = v;
        PromiseUtils.noAwait(this.safeApplyThemeAsync());
    }

    public get followSystemColor(): boolean {
        return this.settings.followSystemColor;
    }

    public set followSystemColor(v: boolean) {
        this.settings.followSystemColor = v;
        if (v) {
            this.settings.followAlbumCoverColor = false;
        }
        PromiseUtils.noAwait(this.safeApplyThemeAsync());
    }

    public get followAlbumCoverColor(): boolean {
        return this.settings.followAlbumCoverColor;
    }

    public set followAlbumCoverColor(v: boolean) {
        this.settings.followAlbumCoverColor = v;
        if (v) {
            this.settings.followSystemColor = false;
        }
        PromiseUtils.noAwait(this.safeApplyThemeAsync());
    }

    public get themes(): Theme[] {
        return this._themes;
    }

    public set themes(v: Theme[]) {
        this._themes = v;
    }

    public get selectedTheme(): Theme {
        return this._selectedTheme;
    }

    public set selectedTheme(v: Theme) {
        this._selectedTheme = v;
        this.settings.theme = v.name;
        PromiseUtils.noAwait(this.safeApplyThemeAsync());
    }

    public fontSizes: number[] = Constants.fontSizes;

    public get selectedFontSize(): number {
        return this._selectedFontSize;
    }

    public set selectedFontSize(v: number) {
        this._selectedFontSize = v;
        this.settings.fontSize = v;
        this.applyFontSize();
    }

    public get themesDirectoryPath(): string {
        return this._themesDirectoryPath;
    }

    public refreshThemes(): void {
        this.ensureDefaultThemesExist();
        this._themes = this.getThemesFromThemesDirectory();
        this.setSelectedThemeFromSettings();
        PromiseUtils.noAwait(this.safeApplyThemeAsync());
    }

    public async applyAppearanceAsync(): Promise<void> {
        await this.safeApplyThemeAsync();
        this.applyFontSize();
        this.applyMargins(true);
    }

    public startWatchingThemesDirectory(): void {
        this.interval = window.setInterval(() => {
            this.checkIfThemesDirectoryHasChanged();
        }, 2000);
    }

    public stopWatchingThemesDirectory(): void {
        clearInterval(this.interval);
    }

    private initialize(): void {
        this._windowHasNativeTitleBar = this.application.getGlobal('windowHasFrame') as boolean;
        this._isMacOS = this.application.getGlobal('isMacOS') as boolean;

        this._isFullScreen = this.application.isFullScreen();
        this._themesDirectoryPath = this.applicationPaths.themesDirectoryFullPath();
        this.ensureThemesDirectoryExists();
        this.ensureDefaultThemesExist();
        this._themes = this.getThemesFromThemesDirectory();
        this.setSelectedThemeFromSettings();

        this.setSelectedFontSizeFromSettings();

        this.addSubscriptions();
    }

    private checkIfThemesDirectoryHasChanged(): void {
        const themeFiles: string[] = this.fileAccess.getFilesInDirectory(this.themesDirectoryPath);
        if (themeFiles.length !== this.themes.length) {
            this.refreshThemes();
        }
    }

    private applyFontSize(): void {
        const element: HTMLElement = this.documentProxy.getDocumentElement();
        element.style.setProperty('--fontsize', `${this._selectedFontSize}px`);
    }

    public applyMargins(isSearchVisible: boolean): void {
        const element: HTMLElement = this.documentProxy.getDocumentElement();

        const mainMenuButtonWidth: number = 45;
        const windowControlsWidth: number = 135;
        const searchBoxWidth: number = 170;

        let totalMargin: number = mainMenuButtonWidth;

        if (!this.settings.useSystemTitleBar) {
            totalMargin = totalMargin + windowControlsWidth;
        }

        if (isSearchVisible) {
            totalMargin = totalMargin + searchBoxWidth;
        }

        element.style.setProperty('--mat-tab-header-margin-right', `${totalMargin + 4}px`);
    }

    private addSubscriptions(): void {
        this.subscription.add(
            this.desktop.accentColorChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.safeApplyThemeAsync());
            }),
        );
        this.subscription.add(
            this.desktop.nativeThemeUpdated$.subscribe(() => {
                PromiseUtils.noAwait(this.safeApplyThemeAsync());
            }),
        );

        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                if (this.settings.followAlbumCoverColor) {
                    PromiseUtils.noAwait(this.safeApplyThemeAsync());
                }
            }),
        );

        this.subscription.add(
            this.application.fullScreenChanged$.subscribe((isFullScreen) => {
                this._isFullScreen = isFullScreen;
            }),
        );
    }

    private async safeApplyThemeAsync(): Promise<boolean> {
        const selectedThemeName: string = this.selectedTheme.name;

        try {
            await this.applyThemeAsync();
        } catch (e: unknown) {
            this.selectedTheme.isBroken = true;
            this.settings.theme = 'Dopamine';
            this.setSelectedThemeFromSettings();
            await this.applyThemeAsync();

            this.logger.warn(
                `Could not apply theme '${selectedThemeName}'. Applying theme '${this.selectedTheme.name}' instead.`,
                'AppearanceService',
                'safeApplyTheme',
            );

            return false;
        }

        return true;
    }

    private async applyThemeAsync(): Promise<void> {
        const element: HTMLElement = this.documentProxy.getDocumentElement();

        // Color
        let primaryColorToApply: string = this.selectedTheme.coreColors.primaryColor;
        let secondaryColorToApply: string = this.selectedTheme.coreColors.secondaryColor;
        let accentColorToApply: string = this.selectedTheme.coreColors.accentColor;
        let scrollBarColorToApply: string = this.selectedTheme.darkColors.scrollBars;

        if (this.isUsingLightTheme) {
            scrollBarColorToApply = this.selectedTheme.lightColors.scrollBars;
        }

        if (this.settings.followSystemColor || this.settings.followAlbumCoverColor) {
            let customAccentColor: string = '';

            if (this.settings.followSystemColor) {
                customAccentColor = this.getSystemAccentColor();
            } else if (this.settings.followAlbumCoverColor) {
                customAccentColor = await this.albumAccentColorService.getAlbumAccentColorAsync(
                    this.playbackService.currentTrack?.albumKey ?? '',
                );
            }

            if (!StringUtils.isNullOrWhiteSpace(customAccentColor)) {
                primaryColorToApply = customAccentColor;
                secondaryColorToApply = customAccentColor;
                accentColorToApply = customAccentColor;
                scrollBarColorToApply = customAccentColor;
            }
        }

        this._accentRgbColor = ColorConverter.stringToRgbColor(accentColorToApply);

        const palette: Palette = new Palette(accentColorToApply);

        // Core colors
        element.style.setProperty('--theme-primary-color', primaryColorToApply);
        element.style.setProperty('--theme-secondary-color', secondaryColorToApply);
        element.style.setProperty('--theme-accent-color', accentColorToApply);

        element.style.setProperty('--theme-rgb-accent', this._accentRgbColor.toString());

        element.style.setProperty('--theme-accent-color-50', palette.color50);
        element.style.setProperty('--theme-accent-color-100', palette.color100);
        element.style.setProperty('--theme-accent-color-200', palette.color200);
        element.style.setProperty('--theme-accent-color-300', palette.color300);
        element.style.setProperty('--theme-accent-color-400', palette.color400);
        element.style.setProperty('--theme-accent-color-500', palette.color500);
        element.style.setProperty('--theme-accent-color-600', palette.color600);
        element.style.setProperty('--theme-accent-color-700', palette.color700);
        element.style.setProperty('--theme-accent-color-800', palette.color800);
        element.style.setProperty('--theme-accent-color-900', palette.color900);
        element.style.setProperty('--theme-accent-color-A100', palette.colorA100);
        element.style.setProperty('--theme-accent-color-A200', palette.colorA200);
        element.style.setProperty('--theme-accent-color-A400', palette.colorA400);
        element.style.setProperty('--theme-accent-color-A700', palette.colorA700);

        // Neutral colors
        let themeName: string = 'default-theme-dark';
        this.applyNeutralColors(element, this.selectedTheme.darkColors, scrollBarColorToApply);
        this._backgroundRgbColor = ColorConverter.stringToRgbColor(this.selectedTheme.darkColors.mainBackground);

        if (this.isUsingLightTheme) {
            themeName = 'default-theme-light';
            this.applyNeutralColors(element, this.selectedTheme.lightColors, scrollBarColorToApply);
            this._backgroundRgbColor = ColorConverter.stringToRgbColor(this.selectedTheme.lightColors.mainBackground);
        }

        // Options
        element.style.setProperty('--theme-album-info-text-align', this.selectedTheme.options.centerAlbumInfoText ? 'center' : 'left');

        // Apply theme to components in the overlay container: https://gist.github.com/tomastrajan/ee29cd8e180b14ce9bc120e2f7435db7
        this.applyThemeClasses(this.overlayContainer.getContainerElement(), themeName);

        // Apply theme to body
        this.applyThemeClasses(this.documentProxy.getBody(), themeName);

        this.logger.info(
            `Applied theme name=${this.selectedTheme.name}' and theme classes='${themeName}'`,
            'AppearanceService',
            'applyTheme',
        );
    }

    private applyNeutralColors(element: HTMLElement, neutralColors: ThemeNeutralColors, scrollBarColor: string): void {
        const primaryTextRgbColor: RgbColor = ColorConverter.stringToRgbColor(neutralColors.primaryText);

        element.style.setProperty('--theme-rgb-base', primaryTextRgbColor.toString());
        element.style.setProperty('--theme-window-button-icon', neutralColors.windowButtonIcon);
        element.style.setProperty('--theme-hovered-item-background', neutralColors.hoveredItemBackground);
        element.style.setProperty('--theme-selected-item-background', neutralColors.selectedItemBackground);
        element.style.setProperty('--theme-tab-text', neutralColors.tabText);
        element.style.setProperty('--theme-selected-tab-text', neutralColors.selectedTabText);
        element.style.setProperty('--theme-main-background', neutralColors.mainBackground);
        element.style.setProperty('--theme-header-background', neutralColors.headerBackground);
        element.style.setProperty('--theme-footer-background', neutralColors.footerBackground);
        element.style.setProperty('--theme-side-pane-background', neutralColors.sidePaneBackground);
        element.style.setProperty('--theme-primary-text', neutralColors.primaryText);
        element.style.setProperty('--theme-secondary-text', neutralColors.secondaryText);
        element.style.setProperty('--theme-slider-background', neutralColors.sliderBackground);
        element.style.setProperty('--theme-slider-thumb-background', neutralColors.sliderThumbBackground);
        element.style.setProperty('--theme-album-cover-background', neutralColors.albumCoverBackground);
        element.style.setProperty('--theme-header-separator', neutralColors.headerSeparator);
        element.style.setProperty('--theme-pane-separators', neutralColors.paneSeparators);
        element.style.setProperty('--theme-settings-separators', neutralColors.settingsSeparators);
        element.style.setProperty('--theme-context-menu-separators', neutralColors.contextMenuSeparators);
        element.style.setProperty('--theme-scroll-bars', scrollBarColor);
        element.style.setProperty('--theme-search-box', neutralColors.searchBox);
        element.style.setProperty('--theme-search-box-text', neutralColors.searchBoxText);
        element.style.setProperty('--theme-search-box-icon', neutralColors.searchBoxIcon);
        element.style.setProperty('--theme-dialog-background', neutralColors.dialogBackground);
        element.style.setProperty('--theme-primary-button-text', neutralColors.primaryButtonText);
        element.style.setProperty('--theme-secondary-button-background', neutralColors.secondaryButtonBackground);
        element.style.setProperty('--theme-secondary-button-text', neutralColors.secondaryButtonText);
        element.style.setProperty('--theme-tooltip-text', neutralColors.tooltipText);
        element.style.setProperty('--theme-button-border', neutralColors.buttonBorder);
        element.style.setProperty('--theme-highlight-foreground', neutralColors.highlightForeground);
    }

    private setSelectedThemeFromSettings(): void {
        let themeFromSettings: Theme | undefined = this.themes.find((x) => x.name === this.settings.theme);

        if (themeFromSettings == undefined) {
            themeFromSettings = this.themes.find((x) => x.name === 'Dopamine');

            if (themeFromSettings == undefined) {
                themeFromSettings = this.themes[0];
            }

            this.logger.info(
                `Theme '${this.settings.theme}' from settings was not found. Applied theme '${themeFromSettings.name}' instead.`,
                'AppearanceService',
                'setSelectedThemeFromSettings',
            );
        }

        this._selectedTheme = themeFromSettings;
    }

    private setSelectedFontSizeFromSettings(): void {
        this._selectedFontSize = this.fontSizes.find((x) => x === this.settings.fontSize)!;
    }

    private isSystemUsingDarkTheme(): boolean {
        let systemIsUsingDarkTheme: boolean = false;

        if (this.settings.followSystemTheme) {
            try {
                systemIsUsingDarkTheme = this.desktop.shouldUseDarkColors();
            } catch (e: unknown) {
                this.logger.error(e, 'Could not get system dark mode', 'AppearanceService', 'isSystemUsingDarkTheme');
            }
        }

        return systemIsUsingDarkTheme;
    }

    private applyThemeClasses(element: HTMLElement, themeName: string): void {
        const classesToRemove: string[] = Array.from(element.classList).filter((item: string) => item.includes('-theme-'));

        if (classesToRemove != undefined && classesToRemove.length > 0) {
            element.classList.remove(...classesToRemove);
        }

        element.classList.add(themeName);
    }

    private getSystemAccentColor(): string {
        let systemAccentColor: string = '';

        try {
            const systemAccentColorWithTransparency: string = this.desktop.getAccentColor();
            systemAccentColor = '#' + systemAccentColorWithTransparency.substr(0, 6);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not get system accent color', 'AppearanceService', 'getSystemAccentColor');
        }

        return systemAccentColor;
    }

    private ensureThemesDirectoryExists(): void {
        this.fileAccess.createFullDirectoryPathIfDoesNotExist(this.themesDirectoryPath);
    }

    private ensureDefaultThemesExist(): void {
        const defaultThemes: Theme[] = this.defaultThemesCreator.createAllThemes();

        for (const defaultTheme of defaultThemes) {
            const themeFilePath: string = this.fileAccess.combinePath([this.themesDirectoryPath, `${defaultTheme.name}.theme`]);

            // We don't want the isBroken property in the theme files
            const defaultThemeWithoutIsBroken = { ...defaultTheme, isBroken: undefined };
            const stringifiedDefaultTheme: string = JSON.stringify(defaultThemeWithoutIsBroken, undefined, 2);
            this.fileAccess.writeToFile(themeFilePath, stringifiedDefaultTheme);
        }
    }

    private getThemesFromThemesDirectory(): Theme[] {
        const themeFiles: string[] = this.fileAccess.getFilesInDirectory(this.themesDirectoryPath);
        const themes: Theme[] = [];

        for (const themeFile of themeFiles) {
            const themeFileContent: string = this.fileAccess.getFileContentAsString(themeFile);

            try {
                const theme: Theme = JSON.parse(themeFileContent) as Theme;
                themes.push(theme);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not parse theme file', 'AppearanceService', 'getThemesFromThemesDirectory');
            }
        }

        return themes;
    }
}
