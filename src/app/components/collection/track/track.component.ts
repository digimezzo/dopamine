import { Component, Input, OnInit } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';
import { ListItemStyler } from '../../../common/styling/list-item-styler';
import { TrackModel } from '../../../services/track/track-model';

@Component({
    selector: 'app-track',
    host: { style: 'display: block' },
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.scss'],
})
export class TrackComponent implements OnInit {
    constructor(public listItemStyler: ListItemStyler, public settings: BaseSettings) {}

    @Input() public track: TrackModel;
    @Input() public canShowHeader: boolean = false;

    public ngOnInit(): void {}
}
