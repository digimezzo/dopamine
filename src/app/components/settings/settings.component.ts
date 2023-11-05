import { Component, ViewEncapsulation } from '@angular/core';
import {AppearanceServiceBase} from "../../services/appearance/appearance.service.base";

@Component({
    selector: 'app-settings',
    host: { style: 'display: block' },
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent {
    public constructor(public appearanceService: AppearanceServiceBase) {}
}
