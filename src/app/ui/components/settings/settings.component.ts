import { Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { enterLeftToRight, enterRightToLeft } from '../../animations/animations';
import { AnimatedPage } from '../animated-page';

@Component({
    selector: 'app-settings',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [enterLeftToRight, enterRightToLeft],
})
export class SettingsComponent extends AnimatedPage {
    public constructor(public appearanceService: AppearanceServiceBase) {
        super();
    }
}
