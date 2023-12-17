import { Component } from '@angular/core';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';

@Component({
    selector: 'app-welcome-appearance',
    templateUrl: './welcome-appearance.component.html',
    styleUrls: ['./welcome-appearance.component.scss'],
})
export class WelcomeAppearanceComponent {
    public constructor(public appearanceService: AppearanceServiceBase) {}
}
