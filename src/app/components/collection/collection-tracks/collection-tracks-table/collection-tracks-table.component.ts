import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { BaseDialogService } from '../../../../services/dialog/base-dialog.service';
import { BaseMetadataService } from '../../../../services/metadata/base-metadata.service';
import { BasePlaybackIndicationService } from '../../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { BaseTracksColumnsService } from '../../../../services/track-columns/base-tracks-columns.service';
import { TracksColumnsOrder } from '../../../../services/track-columns/track-columns-order';
import { TracksColumnsOrderDirection } from '../../../../services/track-columns/track-columns-order-direction';
import { TracksColumnsVisibility } from '../../../../services/track-columns/track-columns-visibility';
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
        private playbackIndicationService: BasePlaybackIndicationService,
        private tracksColumnsService: BaseTracksColumnsService,
        private dialogService: BaseDialogService
    ) {}

    public orderedTracks: TrackModel[] = [];
    public tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

    public tracksColumnsOrderEnum: typeof TracksColumnsOrder = TracksColumnsOrder;
    public tracksColumnsOrderDirectionEnum: typeof TracksColumnsOrderDirection = TracksColumnsOrderDirection;
    public selectedTracksColumnsOrder: TracksColumnsOrder = TracksColumnsOrder.none;
    public selectedTracksColumnsOrderDirection: TracksColumnsOrderDirection = TracksColumnsOrderDirection.ascending;

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

        this.subscription.add(
            this.tracksColumnsService.tracksColumnsVisibilityChanged$.subscribe((tracksColumnsVisibility) => {
                this.tracksColumnsVisibility = tracksColumnsVisibility;
            })
        );

        this.tracksColumnsVisibility = this.tracksColumnsService.getTracksColumnsVisibility();
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

    public async showEditColumnsDialogAsync(): Promise<void> {
        await this.dialogService.showEditColumnsDialogAsync();
    }

    public orderByTrackTitle(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byTrackTitle);
    }

    public orderByRating(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byRating);
    }

    public orderByArtists(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byArtists);
    }

    public orderByAlbum(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byAlbum);
    }

    public orderByGenres(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byGenres);
    }

    public orderByDuration(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byDuration);
    }

    public orderByTrackNumber(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byTrackNumber);
    }

    public orderByYear(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byYear);
    }

    public orderByPlayCount(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byPlayCount);
    }

    public orderBySkipCount(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.bySkipCount);
    }

    public orderByDateAdded(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byDateAdded);
    }

    public orderByDateLastPlayed(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrder.byDateLastPlayed);
    }
}
