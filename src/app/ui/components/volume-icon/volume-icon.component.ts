import { Component, Input } from '@angular/core';
import { PlaybackServiceBase } from '../../../services/playback/playback.service.base';

@Component({
    selector: 'app-volume-icon',
    host: { style: 'display: block' },
    templateUrl: './volume-icon.component.html',
    styleUrls: ['./volume-icon.component.scss'],
})
export class VolumeIconComponent {
    public constructor(private playbackService: PlaybackServiceBase) {}

    public get volume(): number {
        return this.playbackService.volume;
    }

    public set volume(v: number) {
        this.playbackService.volume = v;
    }
}
