import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { TrackOrdering } from '../../../common/track-ordering';
import { BasePlaybackIndicationService } from '../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTracksPersister } from '../base-tracks-persister';
import { TrackOrder } from '../track-order';

@Component({
    selector: 'app-track-browser',
    host: { style: 'display: block' },
    templateUrl: './track-browser.component.html',
    styleUrls: ['./track-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class TrackBrowserComponent implements OnInit, OnDestroy {
    private _tracks: TrackModels = new TrackModels();
    private _tracksPersister: BaseTracksPersister;
    private subscription: Subscription = new Subscription();

    constructor(
        public playbackService: BasePlaybackService,
        private playbackIndicationService: BasePlaybackIndicationService,
        private mouseSelectionWatcher: MouseSelectionWatcher,
        private trackOrdering: TrackOrdering,
        private logger: Logger
    ) {}

    public orderedTracks: TrackModel[] = [];

    public trackOrderEnum: typeof TrackOrder = TrackOrder;
    public selectedTrackOrder: TrackOrder;

    public get tracksPersister(): BaseTracksPersister {
        return this._tracksPersister;
    }

    @Input()
    public set tracksPersister(v: BaseTracksPersister) {
        this._tracksPersister = v;
        this.orderTracks();
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

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(async (playbackStarted: PlaybackStarted) => {
                this.playbackIndicationService.setPlayingTrack(this.orderedTracks, playbackStarted.currentTrack);
            })
        );

        this.selectedTrackOrder = this.tracksPersister.getSelectedTrackOrder();
    }

    public setSelectedTracks(event: any, trackToSelect: TrackModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, trackToSelect);
    }

    public toggleTrackOrder(): void {
        switch (this.selectedTrackOrder) {
            case TrackOrder.byTrackTitleAscending:
                this.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
                break;
            case TrackOrder.byTrackTitleDescending:
                this.selectedTrackOrder = TrackOrder.byAlbum;
                break;
            case TrackOrder.byAlbum:
                this.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
                break;
            default: {
                this.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
                break;
            }
        }

        this.tracksPersister.setSelectedTrackOrder(this.selectedTrackOrder);
        this.orderTracks();
    }

    private orderTracks(): void {
        let orderedTracks: TrackModel[] = [];

        try {
            switch (this.selectedTrackOrder) {
                case TrackOrder.byTrackTitleAscending:
                    orderedTracks = this.trackOrdering.getTracksOrderedByTitleAscending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                case TrackOrder.byTrackTitleDescending:
                    orderedTracks = this.trackOrdering.getTracksOrderedByTitleDescending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                case TrackOrder.byAlbum:
                    orderedTracks = this.trackOrdering.getTracksOrderedByAlbum(this.tracks.tracks);
                    this.showAlbumHeaders(orderedTracks);
                    break;
                default: {
                    orderedTracks = this.trackOrdering.getTracksOrderedByTitleAscending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                }
            }
        } catch (e) {
            this.logger.error(`Could not order tracks. Error: ${e.message}`, 'TrackBrowserComponent', 'orderTracks');
        }

        this.orderedTracks = [...orderedTracks];

        this.playbackIndicationService.setPlayingTrack(this.orderedTracks, this.playbackService.currentTrack);
    }

    private hideAllHeaders(orderedTracks: TrackModel[]): void {
        for (const track of orderedTracks) {
            track.showHeader = false;
        }
    }

    private showAlbumHeaders(orderedTracks: TrackModel[]): void {
        let previousAlbumKey: string = uuidv4();
        let previousDiscNumber: number = -1;

        for (const track of orderedTracks) {
            if (track.albumKey !== previousAlbumKey || track.discNumber !== previousDiscNumber) {
                track.showHeader = true;
            }

            previousAlbumKey = track.albumKey;
            previousDiscNumber = track.discNumber;
        }
    }
}
