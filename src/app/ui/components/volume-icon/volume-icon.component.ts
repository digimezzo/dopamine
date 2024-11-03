import { Component, Input } from '@angular/core';
import { PlaybackService } from '../../../services/playback/playback.service';

@Component({
    selector: 'app-volume-icon',
    host: { style: 'display: block' },
    templateUrl: './volume-icon.component.html',
    styleUrls: ['./volume-icon.component.scss'],
})
export class VolumeIconComponent {
    public constructor(private playbackService: PlaybackService) {}

    public get volume(): number {
        return this.playbackService.volume;
    }

    public set volume(v: number) {
        this.playbackService.volume = v;
    }
}
