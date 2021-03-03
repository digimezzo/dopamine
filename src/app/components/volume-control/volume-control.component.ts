import { Component, OnInit } from '@angular/core';
import { BasePlaybackService } from '../../services/playback/base-playback.service';

@Component({
    selector: 'app-volume-control',
    templateUrl: './volume-control.component.html',
    styleUrls: ['./volume-control.component.scss'],
})
export class VolumeControlComponent implements OnInit {
    constructor(public playbackService: BasePlaybackService) {}

    public ngOnInit(): void {}
}
