import { Component } from '@angular/core';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Component({
    selector: 'app-welcome-online',
    templateUrl: './welcome-online.component.html',
    styleUrls: ['./welcome-online.component.scss'],
})
export class WelcomeOnlineComponent {
    public constructor(public settings: SettingsBase) {}
}
