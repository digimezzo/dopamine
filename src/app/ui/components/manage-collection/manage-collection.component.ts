import { Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { AnimatedPage } from '../animated-page';
import { enterLeftToRight, enterRightToLeft } from '../../animations/animations';

@Component({
    selector: 'app-manage-collection',
    templateUrl: './manage-collection.component.html',
    styleUrls: ['./manage-collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [enterLeftToRight, enterRightToLeft],
})
export class ManageCollectionComponent extends AnimatedPage {
    public constructor(public appearanceService: AppearanceServiceBase) {
        super();
    }
}
