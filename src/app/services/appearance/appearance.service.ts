import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationPaths } from '../../common/application/application-paths';
import { Constants } from '../../common/application/constants';
import { FontSize } from '../../common/application/font-size';
import { BaseRemoteProxy } from '../../common/io/base-remote-proxy';
import { Desktop } from '../../common/io/desktop';
import { DocumentProxy } from '../../common/io/document-proxy';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { Strings } from '../../common/strings';
import { BaseAppearanceService } from './base-appearance.service';
import { DefaultThemesCreator } from './default-themes-creator';
import { Palette } from './palette';
import { Theme } from './theme/theme';

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
        private remoteProxy: BaseRemoteProxy,
        private fileSystem: FileSystem,
        private desktop: Desktop,
        private defaultThemesCreator: DefaultThemesCreator,
        private documentProxy: DocumentProxy
    ) {
        this.initialize();
    }

    public shouldOverrideSelectedItemText: boolean = false;

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
        this.applyTheme();
    }

    public get useLightBackgroundTheme(): boolean {
        return this.settings.useLightBackgroundTheme;
    }

    public set useLightBackgroundTheme(v: boolean) {
        this.settings.useLightBackgroundTheme = v;
        this.applyTheme();
    }

    public get followSystemColor(): boolean {
        return this.settings.followSystemColor;
    }

    public set followSystemColor(v: boolean) {
        this.settings.followSystemColor = v;
        this.applyTheme();
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
        this.applyTheme();
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
        this.applyTheme();
    }

    public applyAppearance(): void {
        this.applyTheme();
        this.applyFontSize();
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
        this._windowHasNativeTitleBar = this.remoteProxy.getGlobal('windowHasFrame');

        this._themesDirectoryPath = this.getThemesDirectoryPath();
        this.ensureThemesDirectoryExists();
        this.ensureDefaultThemesExist();
        this._themes = this.getThemesFromThemesDirectory();
        this.setSelectedThemeFromSettings();

        this.setSelectedFontSizeFromSettings();

        this.addSubscriptions();
    }

    private checkIfThemesDirectoryHasChanged(): void {
        const themeFiles: string[] = this.fileSystem.getFilesInDirectory(this.themesDirectoryPath);
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

    private addSubscriptions(): void {
        this.subscription.add(
            this.desktop.accentColorChanged$.subscribe(() => {
                this.applyTheme();
            })
        );
        this.subscription.add(
            this.desktop.nativeThemeUpdated$.subscribe(() => {
                this.applyTheme();
            })
        );
    }

    private setShouldOverrideSelectedItemText(selectedItemText: string): void {
        this.shouldOverrideSelectedItemText = false;

        if (!Strings.isNullOrWhiteSpace(selectedItemText)) {
            this.shouldOverrideSelectedItemText = true;
        }
    }

    private applyTheme(): void {
        const element: HTMLElement = this.documentProxy.getDocumentElement();

        // Color
        let primaryColorToApply: string = this.selectedTheme.coreColors.primaryColor;
        let secondaryColorToApply: string = this.selectedTheme.coreColors.secondaryColor;
        let accentColorToApply: string = this.selectedTheme.coreColors.accentColor;

        if (this.settings.followSystemColor) {
            const systemAccentColor: string = this.getSystemAccentColor();

            if (!Strings.isNullOrWhiteSpace(systemAccentColor)) {
                primaryColorToApply = systemAccentColor;
                secondaryColorToApply = systemAccentColor;
                accentColorToApply = systemAccentColor;
            }
        }

        const palette: Palette = new Palette(accentColorToApply);

        // Core colors
        element.style.setProperty('--theme-primary-color', primaryColorToApply);
        element.style.setProperty('--theme-secondary-color', secondaryColorToApply);
        element.style.setProperty('--theme-accent-color', accentColorToApply);

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
        element.style.setProperty('--theme-window-button-icon', this.selectedTheme.darkColors.windowButtonIcon);
        element.style.setProperty('--theme-hovered-item-background', this.selectedTheme.darkColors.hoveredItemBackground);
        element.style.setProperty('--theme-selected-item-background', this.selectedTheme.darkColors.selectedItemBackground);
        element.style.setProperty('--theme-selected-item-text', this.selectedTheme.darkColors.selectedItemText);
        element.style.setProperty('--theme-tab-text', this.selectedTheme.darkColors.tabText);
        element.style.setProperty('--theme-selected-tab-text', this.selectedTheme.darkColors.selectedTabText);
        element.style.setProperty('--theme-main-background', this.selectedTheme.darkColors.mainBackground);
        element.style.setProperty('--theme-header-background', this.selectedTheme.darkColors.headerBackground);
        element.style.setProperty('--theme-footer-background', this.selectedTheme.darkColors.footerBackground);
        element.style.setProperty('--theme-side-pane-background', this.selectedTheme.darkColors.sidePaneBackground);
        element.style.setProperty('--theme-primary-text', this.selectedTheme.darkColors.primaryText);
        element.style.setProperty('--theme-secondary-text', this.selectedTheme.darkColors.secondaryText);
        element.style.setProperty('--theme-breadcrumb-background', this.selectedTheme.darkColors.breadcrumbBackground);
        element.style.setProperty('--theme-slider-background', this.selectedTheme.darkColors.sliderBackground);
        element.style.setProperty('--theme-slider-thumb-background', this.selectedTheme.darkColors.sliderThumbBackground);
        element.style.setProperty('--theme-album-cover-logo', this.selectedTheme.darkColors.albumCoverLogo);
        element.style.setProperty('--theme-album-cover-background', this.selectedTheme.darkColors.albumCoverBackground);
        element.style.setProperty('--theme-pane-separators', this.selectedTheme.darkColors.paneSeparators);
        element.style.setProperty('--theme-settings-separators', this.selectedTheme.darkColors.settingsSeparators);
        element.style.setProperty('--theme-scroll-bars', this.selectedTheme.darkColors.scrollBars);
        this.setShouldOverrideSelectedItemText(this.selectedTheme.darkColors.selectedItemText);

        if (this.isUsingLightTheme) {
            themeName = 'default-theme-light';
            element.style.setProperty('--theme-window-button-icon', this.selectedTheme.lightColors.windowButtonIcon);
            element.style.setProperty('--theme-hovered-item-background', this.selectedTheme.lightColors.hoveredItemBackground);
            element.style.setProperty('--theme-selected-item-background', this.selectedTheme.lightColors.selectedItemBackground);
            element.style.setProperty('--theme-selected-item-text', this.selectedTheme.lightColors.selectedItemText);
            element.style.setProperty('--theme-tab-text', this.selectedTheme.lightColors.tabText);
            element.style.setProperty('--theme-selected-tab-text', this.selectedTheme.lightColors.selectedTabText);
            element.style.setProperty('--theme-main-background', this.selectedTheme.lightColors.mainBackground);
            element.style.setProperty('--theme-header-background', this.selectedTheme.lightColors.headerBackground);
            element.style.setProperty('--theme-footer-background', this.selectedTheme.lightColors.footerBackground);
            element.style.setProperty('--theme-side-pane-background', this.selectedTheme.lightColors.sidePaneBackground);
            element.style.setProperty('--theme-primary-text', this.selectedTheme.lightColors.primaryText);
            element.style.setProperty('--theme-secondary-text', this.selectedTheme.lightColors.secondaryText);
            element.style.setProperty('--theme-breadcrumb-background', this.selectedTheme.lightColors.breadcrumbBackground);
            element.style.setProperty('--theme-slider-background', this.selectedTheme.lightColors.sliderBackground);
            element.style.setProperty('--theme-slider-thumb-background', this.selectedTheme.lightColors.sliderThumbBackground);
            element.style.setProperty('--theme-album-cover-logo', this.selectedTheme.lightColors.albumCoverLogo);
            element.style.setProperty('--theme-album-cover-background', this.selectedTheme.lightColors.albumCoverBackground);
            element.style.setProperty('--theme-pane-separators', this.selectedTheme.lightColors.paneSeparators);
            element.style.setProperty('--theme-settings-separators', this.selectedTheme.lightColors.settingsSeparators);
            element.style.setProperty('--theme-scroll-bars', this.selectedTheme.lightColors.scrollBars);
            this.setShouldOverrideSelectedItemText(this.selectedTheme.lightColors.selectedItemText);
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
        this.fileSystem.createFullDirectoryPathIfDoesNotExist(this.themesDirectoryPath);
    }

    private ensureDefaultThemesExist(): void {
        const defaultThemes: Theme[] = this.defaultThemesCreator.createAllThemes();

        for (const defaultTheme of defaultThemes) {
            const themeFilePath: string = this.fileSystem.combinePath([this.themesDirectoryPath, `${defaultTheme.name}.theme`]);
            const stringifiedTheme: string = JSON.stringify(defaultTheme, undefined, 2);
            this.fileSystem.writeToFile(themeFilePath, stringifiedTheme);
        }
    }

    private getThemesFromThemesDirectory(): Theme[] {
        const themeFiles: string[] = this.fileSystem.getFilesInDirectory(this.themesDirectoryPath);
        const themes: Theme[] = [];

        for (const themeFile of themeFiles) {
            const themeFileContent: string = this.fileSystem.getFileContent(themeFile);
            const theme: Theme = JSON.parse(themeFileContent);
            themes.push(theme);
        }

        return themes;
    }

    private getThemesDirectoryPath(): string {
        const applicationDirectory: string = this.fileSystem.applicationDataDirectory();
        const themesDirectoryPath: string = this.fileSystem.combinePath([applicationDirectory, ApplicationPaths.themesFolder]);

        return themesDirectoryPath;
    }
}
