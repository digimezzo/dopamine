import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BasePlaybackService } from '../../services/playback/base-playback.service';

@Component({
    selector: 'app-playback-queue',
    host: { style: 'display: block' },
    templateUrl: './playback-queue.component.html',
    styleUrls: ['./playback-queue.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackQueueComponent implements OnInit {
    constructor(public playbackService: BasePlaybackService) {}

    public ngOnInit(): void {}
}
