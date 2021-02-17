import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BasePlaybackService } from '../../services/playback/base-playback.service';

@Component({
    selector: 'app-playback-controls',
    host: { style: 'display: block' },
    templateUrl: './playback-controls.component.html',
    styleUrls: ['./playback-controls.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackControlsComponent implements OnInit {
    constructor(public playbackService: BasePlaybackService) {}

    public ngOnInit(): void {}
}
