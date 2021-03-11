import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-playback-indicator',
    host: { style: 'display: block' },
    templateUrl: './playback-indicator.component.html',
    styleUrls: ['./playback-indicator.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackIndicatorComponent implements OnInit {
    constructor() {}

    public ngOnInit(): void {}
}
