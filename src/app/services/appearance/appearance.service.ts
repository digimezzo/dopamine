import { Injectable } from '@angular/core';
import { Settings } from '../../core/settings';
import { Logger } from '../../core/logger';
import { ColorTheme } from '../../core/colorTheme';
import { Constants } from '../../core/constants';
import { MaterialCssVarsService } from 'angular-material-css-vars';

@Injectable({
    providedIn: 'root',
})
export class AppearanceService {
    private _selectedColorTheme: ColorTheme;

    constructor(private settings: Settings, private logger: Logger, public materialCssVarsService: MaterialCssVarsService) {
        this.initialize();
    }

    public colorThemes: ColorTheme[] = Constants.colorThemes;

    public get useLightBackgroundTheme(): boolean {
        return this.settings.useLightBackgroundTheme;
    }

    public set useLightBackgroundTheme(v: boolean) {
        this.settings.useLightBackgroundTheme = v;
        this.applyTheme();
    }

    public get selectedColorTheme(): ColorTheme {
        return this._selectedColorTheme;
    }

    public set selectedColorTheme(v: ColorTheme) {
        this._selectedColorTheme = v;
        this.settings.colorTheme = v.name;

        this.applyTheme();
    }

    public applyTheme(): void {
        const primaryColor = '#d65db1';
        const secondaryColor = '#ff6f91';

        // Angular Material elements
        this.materialCssVarsService.setDarkTheme(true);
        this.materialCssVarsService.setPrimaryColor(primaryColor);
        this.materialCssVarsService.setAccentColor(secondaryColor);

        // Other elements
        const element = document.documentElement;
        element.style.setProperty('--primary-color', primaryColor);
        element.style.setProperty('--secondary-color', secondaryColor);
    }

    private initialize(): void {
        this._selectedColorTheme = this.colorThemes.find(x => x.name === this.settings.colorTheme);
        this.applyTheme();
    }
}
