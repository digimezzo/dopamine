import { Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { AnimatedPage } from '../animated-page';
import { enterLeftToRight, enterRightToLeft } from '../../animations/animations';

@Component({
    selector: 'app-information',
    host: { style: 'display: block' },
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [enterLeftToRight, enterRightToLeft],
})
export class InformationComponent extends AnimatedPage {
    public constructor(public appearanceService: AppearanceServiceBase) {
        super();
    }
}
