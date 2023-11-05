import { Component, ViewEncapsulation } from '@angular/core';
import { Theme } from '../../services/appearance/theme/theme';
import { AppearanceServiceBase } from '../../services/appearance/appearance.service.base';

@Component({
    selector: 'app-theme-switcher',
    host: { style: 'display: block' },
    templateUrl: './theme-switcher.component.html',
    styleUrls: ['./theme-switcher.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ThemeSwitcherComponent {
    public constructor(public appearanceService: AppearanceServiceBase) {}

    public setTheme(theme: Theme): void {
        this.appearanceService.selectedTheme = theme;
    }
}
