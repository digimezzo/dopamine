import { Component, ViewEncapsulation } from '@angular/core';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Component({
    selector: 'app-gripes-settings',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './gripes-settings.component.html',
    styleUrls: ['./gripes-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GripesSettingsComponent {
    public constructor(public settings: SettingsBase) {}
}
