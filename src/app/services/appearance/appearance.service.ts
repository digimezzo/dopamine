import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { Constants } from '../../core/base/constants';
import { FontSize } from '../../core/base/font-size';
import { ProductInformation } from '../../core/base/product-information';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { StringCompare } from '../../core/string-compare';
import { BaseAppearanceService } from './base-appearance.service';
import { ColorScheme } from './color-scheme';

@Injectable({
    providedIn: 'root'
})
export class AppearanceService implements BaseAppearanceService {
    private windowHasFrame: boolean = remote.getGlobal('windowHasFrame');
    private _selectedColorScheme: ColorScheme;
    private _selectedFontSize: FontSize;

    constructor(
        private settings: BaseSettings,
        private logger: Logger,
        private overlayContainer: OverlayContainer
    ) {
        let colorSchemeFromSettings: ColorScheme = this.colorSchemes.find(x => x.name === this.settings.colorScheme);

        if (colorSchemeFromSettings == undefined) {
            colorSchemeFromSettings = this.colorSchemes[0];
        }

        this._selectedColorScheme = colorSchemeFromSettings;
        this._selectedFontSize = this.fontSizes.find(x => x.mediumSize === this.settings.fontSize);

        if (remote.systemPreferences != undefined) {
            remote.systemPreferences.on('accent-color-changed', () => this.applyTheme());
        }

        if (remote.nativeTheme != undefined) {
            remote.nativeTheme.on('updated', () => this.applyTheme());
        }
    }

    public get windowHasNativeTitleBar(): boolean {
        return this.windowHasFrame;
    }

    public colorSchemes: ColorScheme[] = [
        new ColorScheme(ProductInformation.applicationName, '#6260e3', '#3fdcdd', '#4883e0'),
        new ColorScheme('Zune', '#f78f1e', '#ed008c', '#f0266f')
    ];

    public fontSizes: FontSize[] = Constants.fontSizes;

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

    public get selectedColorScheme(): ColorScheme {
        return this._selectedColorScheme;
    }

    public set selectedColorScheme(v: ColorScheme) {
        this._selectedColorScheme = v;
        this.settings.colorScheme = v.name;

        this.applyTheme();
    }

    public get selectedFontSize(): FontSize {
        return this._selectedFontSize;
    }

    public set selectedFontSize(v: FontSize) {
        this._selectedFontSize = v;
        this.settings.fontSize = v.mediumSize;

        this.applyFontSize();
    }

    public applyTheme(): void {
        const element = document.documentElement;

        // Color
        element.style.setProperty('--theme-primary-color', this.selectedColorScheme.primaryColor);
        element.style.setProperty('--theme-secondary-color', this.selectedColorScheme.secondaryColor);
        element.style.setProperty('--theme-accent-color', this.selectedColorScheme.accentColor);

        if (this.settings.followSystemColor) {
            const systemAccentColor: string = this.getSystemAccentColor();

            if (!StringCompare.isNullOrWhiteSpace(systemAccentColor)) {
                element.style.setProperty('--theme-primary-color', systemAccentColor);
                element.style.setProperty('--theme-secondary-color', systemAccentColor);
                element.style.setProperty('--theme-accent-color', systemAccentColor);
            }
        }

        // Theme
        let themeName: string = 'default-theme-dark';
        element.style.setProperty('--theme-window-button-foreground', '#5e5e5e');
        element.style.setProperty('--theme-item-hovered-background', 'rgba(255, 255, 255, 0.05)');
        element.style.setProperty('--theme-item-selected-background', 'rgba(255, 255, 255, 0.1)');
        element.style.setProperty('--theme-tab-text-foreground', '#666');
        element.style.setProperty('--theme-tab-selected-text-foreground', '#FFF');
        element.style.setProperty('--theme-header-background', '#111');
        element.style.setProperty('--theme-snack-bar-background', '#111');
        element.style.setProperty('--theme-snack-bar-text-foreground', '#FFF');

        if ((!this.settings.followSystemTheme && this.settings.useLightBackgroundTheme) ||
            (this.settings.followSystemTheme && !this.isSystemUsingDarkTheme())) {
            themeName = 'default-theme-light';
            element.style.setProperty('--theme-window-button-foreground', '#838383');
            element.style.setProperty('--theme-item-hovered-background', 'rgba(0, 0, 0, 0.05)');
            element.style.setProperty('--theme-item-selected-background', 'rgba(0, 0, 0, 0.1)');
            element.style.setProperty('--theme-tab-text-foreground', '#909090');
            element.style.setProperty('--theme-tab-selected-text-foreground', '#000');
            element.style.setProperty('--theme-header-background', '#fdfdfd');
            element.style.setProperty('--theme-snack-bar-background', '#fdfdfd');
            element.style.setProperty('--theme-snack-bar-text-foreground', '#000');
        }

        // Apply theme to components in the overlay container: https://gist.github.com/tomastrajan/ee29cd8e180b14ce9bc120e2f7435db7
        this.applyThemeClasses(this.overlayContainer.getContainerElement(), themeName);

        // Apply theme to body
        this.applyThemeClasses(document.body, themeName);

        this.logger.info(`Applied theme '${themeName}'`, 'AppearanceService', 'applyTheme');
    }

    public applyFontSize(): void {
        const element = document.documentElement;
        element.style.setProperty('--fontsize-medium', this._selectedFontSize.mediumSize + 'px');
        element.style.setProperty('--fontsize-large', this._selectedFontSize.largeSize + 'px');
        element.style.setProperty('--fontsize-extra-large', this._selectedFontSize.extraLargeSize + 'px');
        element.style.setProperty('--fontsize-mega', this._selectedFontSize.megaSize + 'px');
    }

    private isSystemUsingDarkTheme(): boolean {
        let systemIsUsingDarkTheme: boolean = false;

        if (this.settings.followSystemTheme) {
            try {
                systemIsUsingDarkTheme = remote.nativeTheme.shouldUseDarkColors;
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
            const systemAccentColorWithTransparency: string = remote.systemPreferences.getAccentColor();
            systemAccentColor = '#' + systemAccentColorWithTransparency.substr(0, 6);
        } catch (e) {
            this.logger.error(`Could not get system accent color. Error: ${e.message}`, 'AppearanceService', 'getSystemAccentColor');
        }

        return systemAccentColor;
    }
}
