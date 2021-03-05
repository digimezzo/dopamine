import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BasePlaybackService } from '../../services/playback/base-playback.service';

@Component({
    selector: 'app-playback-information',
    host: { style: 'display: block' },
    templateUrl: './playback-information.component.html',
    styleUrls: ['./playback-information.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackInformationComponent implements OnInit {
    constructor(public playbackService: BasePlaybackService) {}

    public ngOnInit(): void {}
}
