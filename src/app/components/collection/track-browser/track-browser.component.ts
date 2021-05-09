import { Component, Input, OnInit } from '@angular/core';
import { TrackModel } from '../../../services/track/track-model';

@Component({
    selector: 'app-track-browser',
    templateUrl: './track-browser.component.html',
    styleUrls: ['./track-browser.component.scss'],
})
export class TrackBrowserComponent implements OnInit {
    private _tracks: TrackModel[] = [];

    constructor() {}

    public get tracks(): TrackModel[] {
        return this._tracks;
    }

    @Input()
    public set albums(v: TrackModel[]) {
        this._tracks = v;
    }

    public ngOnInit(): void {}
}
