import { Component, Input, OnInit } from '@angular/core';
import { TrackModel } from '../../../services/track/track-model';

@Component({
    selector: 'app-track',
    host: { style: 'display: block' },
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.scss'],
})
export class TrackComponent implements OnInit {
    constructor() {}

    @Input() public track: TrackModel;

    public ngOnInit(): void {}
}
