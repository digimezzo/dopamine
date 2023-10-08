import { Component } from '@angular/core';
import { BasePlaybackService } from '../../services/playback/base-playback.service';

@Component({
    selector: 'app-volume-control',
    templateUrl: './volume-control.component.html',
    styleUrls: ['./volume-control.component.scss'],
})
export class VolumeControlComponent {
    public constructor(private playbackService: BasePlaybackService) {}

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
