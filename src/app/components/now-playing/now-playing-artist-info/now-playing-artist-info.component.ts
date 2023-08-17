import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';

@Component({
    selector: 'app-now-playing-artist-info',
    host: { style: 'display: block' },
    templateUrl: './now-playing-artist-info.component.html',
    styleUrls: ['./now-playing-artist-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingArtistInfoComponent implements OnInit {
    constructor(public settings: BaseSettings) {}

    public ngOnInit(): void {}
}
