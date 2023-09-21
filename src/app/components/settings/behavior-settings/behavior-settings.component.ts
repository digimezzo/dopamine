import { Component, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseMediaSessionService } from '../../../services/media-session/base-media-session.service';
import { BaseTrayService } from '../../../services/tray/base-tray.service';

@Component({
    selector: 'app-behavior-settings',
    host: { style: 'display: block' },
    templateUrl: './behavior-settings.component.html',
    styleUrls: ['./behavior-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BehaviorSettingsComponent {
    public constructor(
        public trayService: BaseTrayService,
        public mediaSessionService: BaseMediaSessionService,
        public settings: BaseSettings
    ) {}
}
