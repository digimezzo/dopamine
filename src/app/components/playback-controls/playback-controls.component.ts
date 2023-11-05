import { Component, ViewEncapsulation } from '@angular/core';
import { LoopMode } from '../../services/playback/loop-mode';
import {PlaybackServiceBase} from "../../services/playback/playback.service.base";

@Component({
    selector: 'app-playback-controls',
    host: { style: 'display: block' },
    templateUrl: './playback-controls.component.html',
    styleUrls: ['./playback-controls.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackControlsComponent {
    public constructor(public playbackService: PlaybackServiceBase) {}

    // This is required to use enum values in the template
    public loopModeEnum: typeof LoopMode = LoopMode;
}
