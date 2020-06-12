import { Injectable } from '@angular/core';
import { Settings } from '../../core/settings';
import { Logger } from '../../core/logger';
import { ColorScheme } from '../../core/color-scheme';
import { MaterialCssVarsService } from 'angular-material-css-vars';
import { Appearance } from './appearance';

@Injectable({
    providedIn: 'root',
})
export class AppearanceService implements Appearance {
    private _selectedColorScheme: ColorScheme;

    constructor(private settings: Settings, private logger: Logger, public materialCssVarsService: MaterialCssVarsService) {
        this.initialize();
    }

    public colorSchemes: ColorScheme[] = [new ColorScheme('Default', '#6260e3', '#3fdcdd')];

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

    public applyTheme(): void {
        // Angular Material elements
        this.materialCssVarsService.setDarkTheme(true);
        this.materialCssVarsService.setPrimaryColor(this.selectedColorScheme.primaryColor);
        this.materialCssVarsService.setAccentColor(this.selectedColorScheme.secondaryColor);

        // Other elements
        const element = document.documentElement;
        element.style.setProperty('--primary-color', this.selectedColorScheme.primaryColor);
        element.style.setProperty('--secondary-color', this.selectedColorScheme.secondaryColor);
    }

    private initialize(): void {
        let colorSchemeFromSettings: ColorScheme = this.colorSchemes.find(x => x.name === this.settings.colorScheme);

        if (!colorSchemeFromSettings) {
            colorSchemeFromSettings = this.colorSchemes[0];
        }

        this._selectedColorScheme = colorSchemeFromSettings;
        this.applyTheme();
    }
}
