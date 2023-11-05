import { Component, Input } from '@angular/core';
import { BaseSettings } from '../../../../common/settings/base-settings';
import { TrackModel } from '../../../../services/track/track-model';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';

@Component({
    selector: 'app-track',
    host: { style: 'display: block' },
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.scss'],
})
export class TrackComponent {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        public settings: BaseSettings,
    ) {}

    @Input() public track: TrackModel;
    @Input() public canShowHeader: boolean = false;
}
