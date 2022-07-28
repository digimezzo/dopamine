import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { LoopMode } from '../../services/playback/loop-mode';

@Component({
    selector: 'app-playback-controls',
    host: { style: 'display: block' },
    templateUrl: './playback-controls.component.html',
    styleUrls: ['./playback-controls.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackControlsComponent implements OnInit {
    constructor(public playbackService: BasePlaybackService) {}

    // This is required to use enum values in the template
    public loopModeEnum: typeof LoopMode = LoopMode;

    public ngOnInit(): void {}
}
