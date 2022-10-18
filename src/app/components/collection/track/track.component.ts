import { Component, Input, OnInit } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { TrackModel } from '../../../services/track/track-model';

@Component({
    selector: 'app-track',
    host: { style: 'display: block' },
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.scss'],
})
export class TrackComponent implements OnInit {
    constructor(public appearanceService: BaseAppearanceService, public settings: BaseSettings) {}

    @Input() public track: TrackModel;
    @Input() public canShowHeader: boolean = false;

    public ngOnInit(): void {}
}
