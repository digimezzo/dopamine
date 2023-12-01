﻿import { Component, ViewEncapsulation } from '@angular/core';
import { PlaybackServiceBase } from '../../../../services/playback/playback.service.base';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { TrackModels } from '../../../../services/track/track-models';

@Component({
    selector: 'app-now-playing-nothing-playing',
    host: { style: 'display: block' },
    templateUrl: './now-playing-nothing-playing.component.html',
    styleUrls: ['./now-playing-nothing-playing.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingNothingPlayingComponent {
    public constructor(
        private playbackService: PlaybackServiceBase,
        private trackService: TrackServiceBase,
    ) {}

    public playAll(): void {
        const tracks: TrackModels = this.trackService.getVisibleTracks();
        this.playbackService.enqueueAndPlayTracks(tracks.tracks);
    }

    public shuffleAll(): void {
        const tracks: TrackModels = this.trackService.getVisibleTracks();
        this.playbackService.forceShuffled();
        this.playbackService.enqueueAndPlayTracks(tracks.tracks);
    }
}
