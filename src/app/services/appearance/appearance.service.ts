import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationPaths } from '../../common/application/application-paths';
import { Constants } from '../../common/application/constants';
import { FontSize } from '../../common/application/font-size';
import { ColorConverter } from '../../common/color-converter';
import { BaseApplication } from '../../common/io/base-application';
import { BaseDesktop } from '../../common/io/base-desktop';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { DocumentProxy } from '../../common/io/document-proxy';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { Strings } from '../../common/strings';
import { BaseAppearanceService } from './base-appearance.service';
import { DefaultThemesCreator } from './default-themes-creator';
import { Palette } from './palette';
import { Theme } from './theme/theme';
import { ThemeNeutralColors } from './theme/theme-neutral-colors';

@Injectable()
export class AppearanceService implements BaseAppearanceService {
    private interval: number;
    private _themes: Theme[] = [];

    private _windowHasNativeTitleBar: boolean;
    private _selectedTheme: Theme;
    private _selectedFontSize: FontSize;
    private subscription: Subscription = new Subscription();

    private _themesDirectoryPath: string;

    constructor(
        private settings: BaseSettings,
        private logger: Logger,
        private overlayContainer: OverlayContainer,
        private application: BaseApplication,
        private fileAccess: BaseFileAccess,
        private desktop: BaseDesktop,
        private defaultThemesCreator: DefaultThemesCreator,
        private documentProxy: DocumentProxy
    ) {
        this.initialize();
    }

    public get windowHasNativeTitleBar(): boolean {
        return this._windowHasNativeTitleBar;
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
        this.safeApplyTheme();
    }

    public get useLightBackgroundTheme(): boolean {
        return this.settings.useLightBackgroundTheme;
    }

    public set useLightBackgroundTheme(v: boolean) {
        this.settings.useLightBackgroundTheme = v;
        this.safeApplyTheme();
    }

    public get followSystemColor(): boolean {
        return this.settings.followSystemColor;
    }

    public set followSystemColor(v: boolean) {
        this.settings.followSystemColor = v;
        this.safeApplyTheme();
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
        this.safeApplyTheme();
    }

    public fontSizes: FontSize[] = Constants.fontSizes;

    public get selectedFontSize(): FontSize {
        return this._selectedFontSize;
    }

    public set selectedFontSize(v: FontSize) {
        this._selectedFontSize = v;
        this.settings.fontSize = v.normalSize;
        this.applyFontSize();
    }

    public get themesDirectoryPath(): string {
        return this._themesDirectoryPath;
    }

    public refreshThemes(): void {
        this.ensureDefaultThemesExist();
        this._themes = this.getThemesFromThemesDirectory();
        this.setSelectedThemeFromSettings();
        this.safeApplyTheme();
    }

    public applyAppearance(): void {
        this.safeApplyTheme();
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
        this._windowHasNativeTitleBar = this.application.getGlobal('windowHasFrame');

        this._themesDirectoryPath = this.getThemesDirectoryPath();
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
        element.style.setProperty('--fontsize-normal', this._selectedFontSize.normalSize + 'px');
        element.style.setProperty('--fontsize-medium', this._selectedFontSize.mediumSize + 'px');
        element.style.setProperty('--fontsize-large', this._selectedFontSize.largeSize + 'px');
        element.style.setProperty('--fontsize-extra-large', this._selectedFontSize.extraLargeSize + 'px');
        element.style.setProperty('--fontsize-mega', this._selectedFontSize.megaSize + 'px');
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

        element.style.setProperty('--mat-tab-header-margin-right', totalMargin + 'px');
    }

    private addSubscriptions(): void {
        this.subscription.add(
            this.desktop.accentColorChanged$.subscribe(() => {
                this.safeApplyTheme();
            })
        );
        this.subscription.add(
            this.desktop.nativeThemeUpdated$.subscribe(() => {
                this.safeApplyTheme();
            })
        );
    }

    private safeApplyTheme(): boolean {
        const selectedThemeName: string = this.selectedTheme.name;

        try {
            this.applyTheme();
        } catch (e) {
            this.selectedTheme.isBroken = true;
            this.settings.theme = 'Dopamine';
            this.setSelectedThemeFromSettings();
            this.applyTheme();
            const fallbackThemeName: string = this.selectedTheme.name;

            this.logger.warn(
                `Could not apply theme '${selectedThemeName}'. Applying theme '${fallbackThemeName}' instead.`,
                'AppearanceService',
                'safeApplyTheme'
            );

            return false;
        }

        return true;
    }

    private applyTheme(): void {
        const element: HTMLElement = this.documentProxy.getDocumentElement();

        // Color
        let primaryColorToApply: string = this.selectedTheme.coreColors.primaryColor;
        let secondaryColorToApply: string = this.selectedTheme.coreColors.secondaryColor;
        let accentColorToApply: string = this.selectedTheme.coreColors.accentColor;
        let scrollBarColorToApply: string = this.selectedTheme.darkColors.scrollBars;

        if (this.isUsingLightTheme) {
            scrollBarColorToApply = this.selectedTheme.lightColors.scrollBars;
        }

        if (this.settings.followSystemColor) {
            const systemAccentColor: string = this.getSystemAccentColor();

            if (!Strings.isNullOrWhiteSpace(systemAccentColor)) {
                primaryColorToApply = systemAccentColor;
                secondaryColorToApply = systemAccentColor;
                accentColorToApply = systemAccentColor;
                scrollBarColorToApply = systemAccentColor;
            }
        }

        const palette: Palette = new Palette(accentColorToApply);

        // Core colors
        element.style.setProperty('--theme-primary-color', primaryColorToApply);
        element.style.setProperty('--theme-secondary-color', secondaryColorToApply);
        element.style.setProperty('--theme-accent-color', accentColorToApply);

        const accentRgbArray: number[] = ColorConverter.stringToRgb(accentColorToApply);
        element.style.setProperty('--theme-rgb-accent', accentRgbArray.join(','));

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

        if (this.isUsingLightTheme) {
            themeName = 'default-theme-light';
            this.applyNeutralColors(element, this.selectedTheme.lightColors, scrollBarColorToApply);
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
            'applyTheme'
        );
    }

    private applyNeutralColors(element: HTMLElement, neutralColors: ThemeNeutralColors, scrollBarColor: string): void {
        const primaryTextRgbArray: number[] = ColorConverter.stringToRgb(neutralColors.primaryText);

        element.style.setProperty('--theme-rgb-base', primaryTextRgbArray.join(','));
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
        element.style.setProperty('--theme-breadcrumb-background', neutralColors.breadcrumbBackground);
        element.style.setProperty('--theme-slider-background', neutralColors.sliderBackground);
        element.style.setProperty('--theme-slider-thumb-background', neutralColors.sliderThumbBackground);
        element.style.setProperty('--theme-album-cover-logo', neutralColors.albumCoverLogo);
        element.style.setProperty('--theme-album-cover-background', neutralColors.albumCoverBackground);
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
    }

    private setSelectedThemeFromSettings(): void {
        let themeFromSettings: Theme = this.themes.find((x) => x.name === this.settings.theme);

        if (themeFromSettings == undefined) {
            themeFromSettings = this.themes.find((x) => x.name === 'Dopamine');

            if (themeFromSettings == undefined) {
                themeFromSettings = this.themes[0];
            }

            this.logger.info(
                `Theme '${this.settings.theme}' from settings was not found. Applied theme '${themeFromSettings.name}' instead.`,
                'AppearanceService',
                'setSelectedThemeFromSettings'
            );
        }

        this._selectedTheme = themeFromSettings;
    }

    private setSelectedFontSizeFromSettings(): void {
        this._selectedFontSize = this.fontSizes.find((x) => x.normalSize === this.settings.fontSize);
    }

    private isSystemUsingDarkTheme(): boolean {
        let systemIsUsingDarkTheme: boolean = false;

        if (this.settings.followSystemTheme) {
            try {
                systemIsUsingDarkTheme = this.desktop.shouldUseDarkColors();
            } catch (e) {
                this.logger.error(`Could not get system dark mode. Error: ${e.message}`, 'AppearanceService', 'isSystemUsingDarkTheme');
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
        } catch (e) {
            this.logger.error(`Could not get system accent color. Error: ${e.message}`, 'AppearanceService', 'getSystemAccentColor');
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
                const theme: Theme = JSON.parse(themeFileContent);
                themes.push(theme);
            } catch (e) {
                this.logger.error(`Could not parse theme file. Error: ${e.message}`, 'AppearanceService', 'getThemesFromThemesDirectory');
            }
        }

        return themes;
    }

    private getThemesDirectoryPath(): string {
        const applicationDirectory: string = this.fileAccess.applicationDataDirectory();
        const themesDirectoryPath: string = this.fileAccess.combinePath([applicationDirectory, ApplicationPaths.themesFolder]);

        return themesDirectoryPath;
    }
}
