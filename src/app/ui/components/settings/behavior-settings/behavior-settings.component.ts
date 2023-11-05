import { Component, ViewEncapsulation } from '@angular/core';
import { TrayServiceBase } from '../../../../services/tray/tray.service.base';
import { MediaSessionServiceBase } from '../../../../services/media-session/media-session.service.base';
import { BaseSettings } from '../../../../common/settings/base-settings';

@Component({
    selector: 'app-behavior-settings',
    host: { style: 'display: block' },
    templateUrl: './behavior-settings.component.html',
    styleUrls: ['./behavior-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BehaviorSettingsComponent {
    public constructor(
        public trayService: TrayServiceBase,
        public mediaSessionService: MediaSessionServiceBase,
        public settings: BaseSettings,
    ) {}
}
