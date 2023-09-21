import { Component, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';

@Component({
    selector: 'app-settings',
    host: { style: 'display: block' },
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent {
    public constructor(public appearanceService: BaseAppearanceService) {}
}
