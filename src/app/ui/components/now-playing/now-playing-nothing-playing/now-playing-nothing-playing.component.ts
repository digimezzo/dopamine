import { Component, ViewEncapsulation } from '@angular/core';
import { PlaybackService } from '../../../../services/playback/playback.service';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { TrackModels } from '../../../../services/track/track-models';

@Component({
    selector: 'app-now-playing-nothing-playing',
    host: { style: 'display: block; width: 100%; height: 100%;' },
    templateUrl: './now-playing-nothing-playing.component.html',
    styleUrls: ['./now-playing-nothing-playing.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingNothingPlayingComponent {
    public constructor(
        private playbackService: PlaybackService,
        private trackService: TrackServiceBase,
    ) {}

    public async playAllAsync(): Promise<void> {
        const tracks: TrackModels = this.trackService.getVisibleTracks();
        await this.playbackService.enqueueAndPlayTracksAsync(tracks.tracks);
    }

    public async shuffleAllAsync(): Promise<void> {
        const tracks: TrackModels = this.trackService.getVisibleTracks();
        this.playbackService.forceShuffled();
        await this.playbackService.enqueueAndPlayTracksAsync(tracks.tracks);
    }
}
