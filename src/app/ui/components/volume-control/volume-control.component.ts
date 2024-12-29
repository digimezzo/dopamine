import { Component, Input } from '@angular/core';
import { PlaybackService } from '../../../services/playback/playback.service';

@Component({
    selector: 'app-volume-control',
    host: { style: 'display: block' },
    templateUrl: './volume-control.component.html',
    styleUrls: ['./volume-control.component.scss'],
})
export class VolumeControlComponent {
    public constructor(private playbackService: PlaybackService) {}

    public get volume(): number {
        return this.playbackService.volume;
    }

    public set volume(v: number) {
        this.playbackService.volume = v;
    }

    public toggleMute(): void {
        this.playbackService.toggleMute();
    }
}
