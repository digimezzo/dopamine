import { Component, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { Theme } from '../../services/appearance/theme/theme';

@Component({
    selector: 'app-theme-switcher',
    host: { style: 'display: block' },
    templateUrl: './theme-switcher.component.html',
    styleUrls: ['./theme-switcher.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ThemeSwitcherComponent {
    constructor(public appearanceService: BaseAppearanceService) {}

    public setTheme(theme: Theme): void {
        this.appearanceService.selectedTheme = theme;
    }
}
