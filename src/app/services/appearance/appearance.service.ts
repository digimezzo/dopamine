import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { Constants } from '../../core/base/constants';
import { FontSize } from '../../core/base/font-size';
import { ProductInformation } from '../../core/base/product-information';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
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
            remote.systemPreferences.on('accent-color-changed', (event: Electron.Event, newColor: string) => {
                this.applyTheme();
            });
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

    private applyThemeClasses(element: HTMLElement, themeName: string): void {
        const classesToRemove: string[] = Array.from(element.classList).filter((item: string) => item.includes('-theme-'));

        if (classesToRemove != undefined && classesToRemove.length > 0) {
            element.classList.remove(...classesToRemove);
        }

        element.classList.add(themeName);
    }

    public applyTheme(): void {
        const element = document.documentElement;

        let primaryColor: string = this.selectedColorScheme.primaryColor;
        let secondaryColor: string = this.selectedColorScheme.secondaryColor;
        let accentColor: string = this.selectedColorScheme.accentColor;

        if (this.settings.followSystemColor) {
            try {
                const systemAccentColor: string = remote.systemPreferences.getAccentColor();
                const systemAccentColorWithoutTransparency: string = '#' + systemAccentColor.substr(0, 6);

                primaryColor = systemAccentColorWithoutTransparency;
                secondaryColor = systemAccentColorWithoutTransparency;
                accentColor = systemAccentColorWithoutTransparency;
            } catch (e) {
                this.logger.error(`Could not get system accent color. Error: ${e.message}`, 'AppearanceService', 'applyTheme');
            }
        }

        element.style.setProperty('--theme-primary-color', primaryColor);
        element.style.setProperty('--theme-secondary-color', secondaryColor);
        element.style.setProperty('--theme-accent-color', accentColor);

        let themeName: string = 'default-theme-dark';
        element.style.setProperty('--theme-window-button-foreground', '#5e5e5e');
        element.style.setProperty('--theme-item-hovered-background', 'rgba(255, 255, 255, 0.05)');
        element.style.setProperty('--theme-item-selected-background', 'rgba(255, 255, 255, 0.1)');
        element.style.setProperty('--theme-tab-text-foreground', '#666');
        element.style.setProperty('--theme-tab-selected-text-foreground', '#FFF');
        element.style.setProperty('--theme-header-background', '#111');

        let systemIsUsingDarkMode: boolean = false;

        try {
            systemIsUsingDarkMode = remote.systemPreferences.isDarkMode();
        } catch (e) {
            this.logger.error(`Could not get system dark mode. Error: ${e.message}`, 'AppearanceService', 'applyTheme');
        }

        if (this.settings.useLightBackgroundTheme && !systemIsUsingDarkMode) {
            themeName = 'default-theme-light';
            element.style.setProperty('--theme-window-button-foreground', '#838383');
            element.style.setProperty('--theme-item-hovered-background', 'rgba(0, 0, 0, 0.05)');
            element.style.setProperty('--theme-item-selected-background', 'rgba(0, 0, 0, 0.1)');
            element.style.setProperty('--theme-tab-text-foreground', '#909090');
            element.style.setProperty('--theme-tab-selected-text-foreground', '#000');
            element.style.setProperty('--theme-header-background', '#fdfdfd');
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
}
