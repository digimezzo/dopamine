import { Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Constants } from '../../../common/application/constants';

@Component({
    selector: 'app-manage-collection',
    templateUrl: './manage-collection.component.html',
    styleUrls: ['./manage-collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageCollectionComponent {
    public constructor(public appearanceService: AppearanceServiceBase) {}

    public page: number = 0;

    public setPage(page: number): void {
        this.page = page;
    }
}
