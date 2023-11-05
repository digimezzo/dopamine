import { Component, ViewEncapsulation } from '@angular/core';
import {AppearanceServiceBase} from "../../services/appearance/appearance.service.base";

@Component({
    selector: 'app-manage-collection',
    templateUrl: './manage-collection.component.html',
    styleUrls: ['./manage-collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageCollectionComponent {
    public constructor(public appearanceService: AppearanceServiceBase) {}
}
