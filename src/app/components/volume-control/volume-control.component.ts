import { Component, OnInit } from '@angular/core';
import { MatLegacySliderChange as MatSliderChange } from '@angular/material/legacy-slider';
import { BasePlaybackService } from '../../services/playback/base-playback.service';

@Component({
    selector: 'app-volume-control',
    templateUrl: './volume-control.component.html',
    styleUrls: ['./volume-control.component.scss'],
})
export class VolumeControlComponent implements OnInit {
    constructor(public playbackService: BasePlaybackService) {}

    public ngOnInit(): void {}

    /**
     * The [(ngModel)] binding only triggers a change on mouse up.
     * This function also triggers a change while moving the slider.
     * @param event
     */
    public onInputChange(event: MatSliderChange): void {
        this.playbackService.volume = event.value;
    }

    public onMouseWheel(event: any): void {
        if (event.deltaY > 0) {
            this.playbackService.volume -= 0.05;
        } else {
            this.playbackService.volume += 0.05;
        }
    }
}
