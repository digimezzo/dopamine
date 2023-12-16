import { Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { enterAnimation } from '../../animations/animations';

@Component({
    selector: 'app-settings',
    host: { style: 'display: block' },
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [enterAnimation],
})
export class SettingsComponent {
    public constructor(public appearanceService: AppearanceServiceBase) {}

    public page: number = 0;

    public setPage(page: number): void {
        this.page = page;
    }
}
