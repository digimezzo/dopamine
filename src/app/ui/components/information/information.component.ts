import { Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';

@Component({
    selector: 'app-information',
    host: { style: 'display: block' },
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InformationComponent {
    public constructor(public appearanceService: AppearanceServiceBase) {}

    public page: number = 0;

    public setPage(page: number): void {
        this.page = page;
    }
}
