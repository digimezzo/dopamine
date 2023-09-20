import { Component, ViewEncapsulation } from '@angular/core';
import { BasePlaybackService } from '../../services/playback/base-playback.service';

@Component({
    selector: 'app-playback-time',
    host: { style: 'display: block' },
    templateUrl: './playback-time.component.html',
    styleUrls: ['./playback-time.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackTimeComponent {
    constructor(public playbackService: BasePlaybackService) {}
}
