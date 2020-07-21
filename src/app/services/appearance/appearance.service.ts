import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { Logger } from '../../core/logger';
import { ColorScheme } from './color-scheme';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BaseAppearanceService } from './base-appearance.service';
import { ProductInformation } from '../../core/base/product-information';
import { FontSize } from '../../core/base/font-size';
import { Constants } from '../../core/base/constants';
import { BaseSettings } from '../../core/settings/base-settings';

@Injectable({
    providedIn: 'root',
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

        if (!colorSchemeFromSettings) {
            colorSchemeFromSettings = this.colorSchemes[0];
        }

        this._selectedColorScheme = colorSchemeFromSettings;
        this._selectedFontSize = this.fontSizes.find(x => x.normalSize === this.settings.fontSize);
    }

    public get windowHasNativeTitleBar(): boolean {
        return this.windowHasFrame;
    }

    public colorSchemes: ColorScheme[] = [
        new ColorScheme(ProductInformation.applicationName, '#6260e3', '#3fdcdd', '#4883e0'),
        new ColorScheme('Zune', '#f78f1e', '#ed008c', '#f0266f')
    ];

    public fontSizes: FontSize[] = Constants.fontSizes;

    public get useLightBackgroundTheme(): boolean {
        return this.settings.useLightBackgroundTheme;
    }

    public set useLightBackgroundTheme(v: boolean) {
        this.settings.useLightBackgroundTheme = v;
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
        this.settings.fontSize = v.normalSize;

        this.applyFontSize();
    }

    private applyThemeClasses(element: HTMLElement, themeName: string): void {
        const classesToRemove: string[] = Array.from(element.classList).filter((item: string) => item.includes('-theme-'));

        if (classesToRemove.length) {
            element.classList.remove(...classesToRemove);
        }

        element.classList.add(themeName);
    }

    public applyTheme(): void {
        const element = document.documentElement;
        element.style.setProperty('--primary-color', this.selectedColorScheme.primaryColor);
        element.style.setProperty('--secondary-color', this.selectedColorScheme.secondaryColor);
        element.style.setProperty('--accent-color', this.selectedColorScheme.accentColor);

        let themeName: string = 'default-theme-dark';
        element.style.setProperty('--button-foreground-color', '#FFF');
        element.style.setProperty('--button-hover-color', 'rgba(255, 255, 255, 0.05)');
        element.style.setProperty('--button-select-color', 'rgba(255, 255, 255, 0.1)');

        if (this.settings.useLightBackgroundTheme) {
            themeName = 'default-theme-light';
            element.style.setProperty('--button-foreground-color', '#000');
            element.style.setProperty('--button-hover-color', 'rgba(0, 0, 0, 0.05)');
            element.style.setProperty('--button-select-color', 'rgba(0, 0, 0, 0.1)');
        }

        // Apply theme to components in the overlay container: https://gist.github.com/tomastrajan/ee29cd8e180b14ce9bc120e2f7435db7
        this.applyThemeClasses(this.overlayContainer.getContainerElement(), themeName);

        // Apply theme to body
        this.applyThemeClasses(document.body, themeName);

        this.logger.info(`Applied theme '${themeName}'`, 'AppearanceService', 'applyTheme');
    }

    public applyFontSize(): void {
        const element = document.documentElement;
        element.style.setProperty('--fontsize-normal', this._selectedFontSize.normalSize + 'px');
        element.style.setProperty('--fontsize-larger', this._selectedFontSize.largerSize + 'px');
        element.style.setProperty('--fontsize-largest', this._selectedFontSize.largestSize + 'px');
    }
}
