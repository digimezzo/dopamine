import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { BaseDialogService } from '../../../../services/dialog/base-dialog.service';
import { BaseMetadataService } from '../../../../services/metadata/base-metadata.service';
import { BasePlaybackIndicationService } from '../../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { BaseTracksColumnsService } from '../../../../services/track-columns/base-tracks-columns.service';
import { TracksColumnsOrder } from '../../../../services/track-columns/tracks-columns-order';
import { TracksColumnsOrderColumn } from '../../../../services/track-columns/tracks-columns-order-column';
import { TracksColumnsOrderDirection } from '../../../../services/track-columns/tracks-columns-order-direction';
import { TracksColumnsOrdering } from '../../../../services/track-columns/tracks-columns-ordering';
import { TracksColumnsVisibility } from '../../../../services/track-columns/tracks-columns-visibility';
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
        private dialogService: BaseDialogService,
        private tracksColumnsOrdering: TracksColumnsOrdering
    ) {}

    public orderedTracks: TrackModel[] = [];
    public tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();
    public tracksColumnsOrder: TracksColumnsOrder = new TracksColumnsOrder(
        TracksColumnsOrderColumn.trackTitle,
        TracksColumnsOrderDirection.ascending
    );

    public get isOrderedByTrackTitle(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.trackTitle;
    }

    public get isOrderedByRating(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.rating;
    }

    public get isOrderedByArtists(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.artists;
    }

    public get isOrderedByAlbum(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.album;
    }

    public get isOrderedByGenres(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.genres;
    }

    public get isOrderedByDuration(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.duration;
    }

    public get isOrderedByTrackNumber(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.trackNumber;
    }

    public get isOrderedByYear(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.year;
    }

    public get isOrderedByPlayCount(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.playCount;
    }

    public get isOrderedBySkipCount(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.skipCount;
    }

    public get isOrderedByDateAdded(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.dateAdded;
    }

    public get isOrderedByDateLastPlayed(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderColumn === TracksColumnsOrderColumn.dateLastPlayed;
    }

    public get isOrderedAscending(): boolean {
        return this.tracksColumnsOrder.tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending;
    }

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

        this.subscription.add(
            this.tracksColumnsService.tracksColumnsOrderChanged$.subscribe((tracksColumnsOrder) => {
                this.tracksColumnsOrder = tracksColumnsOrder;
                this.orderTracks();
            })
        );

        this.tracksColumnsVisibility = this.tracksColumnsService.getTracksColumnsVisibility();
        this.tracksColumnsOrder = this.tracksColumnsService.getTracksColumnsOrder();
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
        let orderedTracks: TrackModel[] = [];

        switch (this.tracksColumnsOrder.tracksColumnsOrderColumn) {
            case TracksColumnsOrderColumn.trackTitle:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByTitle(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.rating:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByRating(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.artists:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByArtists(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.album:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByAlbum(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.genres:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByGenres(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.duration:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByDuration(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.trackNumber:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByTrackNumber(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.year:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByYear(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.playCount:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByPlayCount(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.skipCount:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedBySkipCount(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.dateLastPlayed:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByDateLastPlayed(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            case TracksColumnsOrderColumn.dateAdded:
                orderedTracks = this.tracksColumnsOrdering.getTracksOrderedByDateAdded(
                    this.tracks.tracks,
                    this.tracksColumnsOrder.tracksColumnsOrderDirection
                );
                break;
            default:
                orderedTracks = this.tracks.tracks;
                break;
        }

        this.orderedTracks = [...orderedTracks];
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
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.trackTitle);
    }

    public orderByRating(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.rating);
    }

    public orderByArtists(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.artists);
    }

    public orderByAlbum(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.album);
    }

    public orderByGenres(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.genres);
    }

    public orderByDuration(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.duration);
    }

    public orderByTrackNumber(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.trackNumber);
    }

    public orderByYear(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.year);
    }

    public orderByPlayCount(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.playCount);
    }

    public orderBySkipCount(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.skipCount);
    }

    public orderByDateAdded(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.dateAdded);
    }

    public orderByDateLastPlayed(): void {
        this.tracksColumnsService.setTracksColumnsOrder(TracksColumnsOrderColumn.dateLastPlayed);
    }
}
