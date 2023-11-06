import { Component, Input } from '@angular/core';
import { TrackModel } from '../../../../services/track/track-model';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Component({
    selector: 'app-track',
    host: { style: 'display: block' },
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.scss'],
})
export class TrackComponent {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        public settings: SettingsBase,
    ) {}

    @Input() public track: TrackModel;
    @Input() public canShowHeader: boolean = false;
}
