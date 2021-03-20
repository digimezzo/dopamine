import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../core/base/constants';
import { FontSize } from '../../core/base/font-size';
import { ProductInformation } from '../../core/base/product-information';
import { BaseRemoteProxy } from '../../core/io/base-remote-proxy';
import { Desktop } from '../../core/io/desktop';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { StringCompare } from '../../core/string-compare';
import { BaseAppearanceService } from './base-appearance.service';
import { ColorScheme } from './color-scheme';
import { Palette } from './palette';

@Injectable({
    providedIn: 'root',
})
export class AppearanceService implements BaseAppearanceService {
    private windowHasFrame: boolean;
    private _selectedColorScheme: ColorScheme;
    private _selectedFontSize: FontSize;
    private subscription: Subscription = new Subscription();

    constructor(
        private settings: BaseSettings,
        private logger: Logger,
        private overlayContainer: OverlayContainer,
        private remoteProxy: BaseRemoteProxy,
        private desktop: Desktop
    ) {
        this.windowHasFrame = this.remoteProxy.getGlobal('windowHasFrame');

        let colorSchemeFromSettings: ColorScheme = this.colorSchemes.find((x) => x.name === this.settings.colorScheme);

        if (colorSchemeFromSettings == undefined) {
            colorSchemeFromSettings = this.colorSchemes[0];
        }

        this._selectedColorScheme = colorSchemeFromSettings;
        this._selectedFontSize = this.fontSizes.find((x) => x.mediumSize === this.settings.fontSize);

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

    public get windowHasNativeTitleBar(): boolean {
        return this.windowHasFrame;
    }

    public colorSchemes: ColorScheme[] = [
        new ColorScheme(ProductInformation.applicationName, '#6260e3', '#3fdcdd', '#4883e0'),
        new ColorScheme('Zune', '#f78f1e', '#ed008c', '#f0266f'),
        new ColorScheme('Beats', '#98247f', '#e21839', '#e21839'),
        new ColorScheme('Naughty', '#f5004a', '#9300ef', '#f5004a'),
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
        let primaryColorToApply: string = this.selectedColorScheme.primaryColor;
        let secondaryColorToApply: string = this.selectedColorScheme.secondaryColor;
        let accentColorToApply: string = this.selectedColorScheme.accentColor;

        if (this.settings.followSystemColor) {
            const systemAccentColor: string = this.getSystemAccentColor();

            if (!StringCompare.isNullOrWhiteSpace(systemAccentColor)) {
                primaryColorToApply = systemAccentColor;
                secondaryColorToApply = systemAccentColor;
                accentColorToApply = systemAccentColor;
            }
        }

        const palette: Palette = new Palette(accentColorToApply);

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
        element.style.setProperty('--theme-side-pane-background', '#171717');
        element.style.setProperty('--theme-text-secondary-foreground', '#5E5E5E');
        element.style.setProperty('--theme-breadcrumb-background', '#272727');
        element.style.setProperty('--theme-slider-background', '#999999');
        element.style.setProperty('--theme-slider-thumb-background', '#FFF');
        element.style.setProperty('--theme-cover-art-background', '#202020');
        element.style.setProperty('--theme-cover-art-foreground', '#5E5E5E');
        element.style.setProperty('--theme-album-info-background', '#272727');

        if (
            (!this.settings.followSystemTheme && this.settings.useLightBackgroundTheme) ||
            (this.settings.followSystemTheme && !this.isSystemUsingDarkTheme())
        ) {
            themeName = 'default-theme-light';
            element.style.setProperty('--theme-window-button-foreground', '#838383');
            element.style.setProperty('--theme-item-hovered-background', 'rgba(0, 0, 0, 0.05)');
            element.style.setProperty('--theme-item-selected-background', 'rgba(0, 0, 0, 0.1)');
            element.style.setProperty('--theme-tab-text-foreground', '#909090');
            element.style.setProperty('--theme-tab-selected-text-foreground', '#000');
            element.style.setProperty('--theme-header-background', '#fdfdfd');
            element.style.setProperty('--theme-snack-bar-background', '#fdfdfd');
            element.style.setProperty('--theme-snack-bar-text-foreground', '#000');
            element.style.setProperty('--theme-side-pane-background', '#EFEFEF');
            element.style.setProperty('--theme-text-secondary-foreground', '#838383');
            element.style.setProperty('--theme-breadcrumb-background', '#DFDFDF');
            element.style.setProperty('--theme-slider-background', '#666666');
            element.style.setProperty('--theme-slider-thumb-background', '#000');
            element.style.setProperty('--theme-cover-art-background', '#CECECE');
            element.style.setProperty('--theme-cover-art-foreground', '#838383');
            element.style.setProperty('--theme-album-info-background', '#DFDFDF');
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
}
