import { Component } from '@angular/core';
import { PlaybackServiceBase } from '../../services/playback/playback.service.base';

@Component({
    selector: 'app-volume-control',
    templateUrl: './volume-control.component.html',
    styleUrls: ['./volume-control.component.scss'],
})
export class VolumeControlComponent {
    public constructor(private playbackService: PlaybackServiceBase) {}

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
