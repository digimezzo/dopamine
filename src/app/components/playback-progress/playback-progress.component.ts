import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-playback-progress',
    host: { style: 'display: block' },
    templateUrl: './playback-progress.component.html',
    styleUrls: ['./playback-progress.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackProgressComponent implements OnInit {
    constructor() {}

    public progressValue: number = 40;

    public ngOnInit(): void {}
}
