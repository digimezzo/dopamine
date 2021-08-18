import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { Theme } from '../../services/appearance/theme/theme';

@Component({
    selector: 'app-color-scheme-switcher',
    host: { style: 'display: block' },
    templateUrl: './color-scheme-switcher.component.html',
    styleUrls: ['./color-scheme-switcher.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ColorSchemeSwitcherComponent implements OnInit {
    constructor(public appearanceService: BaseAppearanceService) {}

    public ngOnInit(): void {}

    public setTheme(theme: Theme): void {
        this.appearanceService.selectedTheme = theme;
    }
}
