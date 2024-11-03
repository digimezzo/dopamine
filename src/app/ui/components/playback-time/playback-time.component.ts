import { Component, ViewEncapsulation } from '@angular/core';
import { PlaybackService } from '../../../services/playback/playback.service';

@Component({
    selector: 'app-playback-time',
    host: { style: 'display: block' },
    templateUrl: './playback-time.component.html',
    styleUrls: ['./playback-time.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackTimeComponent {
    public constructor(public playbackService: PlaybackService) {}
}
