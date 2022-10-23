import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { BaseMetadataService } from '../../../../services/metadata/base-metadata.service';
import { BasePlaybackIndicationService } from '../../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { TrackModel } from '../../../../services/track/track-model';
import { TrackModels } from '../../../../services/track/track-models';

@Component({
    selector: 'app-collection-tracks-table',
    host: { style: 'display: block' },
    templateUrl: './collection-tracks-table.component.html',
    styleUrls: ['./collection-tracks-table.component.scss'],
    providers: [MouseSelectionWatcher],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionTracksTableComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    private _tracks: TrackModels = new TrackModels();

    public constructor(
        public playbackService: BasePlaybackService,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        private metadataService: BaseMetadataService,
        private playbackIndicationService: BasePlaybackIndicationService
    ) {}

    public orderedTracks: TrackModel[] = [];

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.playbackIndicationService.setPlayingTrack(this.orderedTracks, playbackStarted.currentTrack);
            })
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.playbackIndicationService.clearPlayingTrack(this.orderedTracks);
            })
        );

        this.subscription.add(
            this.metadataService.ratingSaved$.subscribe((track: TrackModel) => {
                this.updateTrackRating(track);
            })
        );
    }

    public get tracks(): TrackModels {
        return this._tracks;
    }

    @Input()
    public set tracks(v: TrackModels) {
        this._tracks = v;
        this.mouseSelectionWatcher.initialize(this.tracks.tracks, false);
        this.orderTracks();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public setSelectedTracks(event: any, trackToSelect: TrackModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, trackToSelect);
    }

    private orderTracks(): void {
        this.orderedTracks = this.tracks.tracks;
        this.playbackIndicationService.setPlayingTrack(this.orderedTracks, this.playbackService.currentTrack);
    }

    private updateTrackRating(trackWithUpToDateRating: TrackModel): void {
        for (const track of this.tracks.tracks) {
            if (track.path === trackWithUpToDateRating.path) {
                track.rating = trackWithUpToDateRating.rating;
            }
        }
    }
}
