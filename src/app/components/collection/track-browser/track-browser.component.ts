import { Component, Input, OnInit } from '@angular/core';
import { Logger } from '../../../core/logger';
import { MouseSelectionWatcher } from '../../../core/mouse-selection-watcher';
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
export class TrackBrowserComponent implements OnInit {
    private _tracks: TrackModels = new TrackModels();
    private _tracksPersister: BaseTracksPersister;

    public orderedTracks: TrackModel[] = [];

    constructor(private mouseSelectionWatcher: MouseSelectionWatcher, private logger: Logger) {}

    public get tracksPersister(): BaseTracksPersister {
        return this._tracksPersister;
    }

    public trackOrderEnum: typeof TrackOrder = TrackOrder;
    public selectedTrackOrder: TrackOrder;

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
        this.orderTracks();
    }

    public selectedTrack: TrackModel;

    public ngOnInit(): void {
        this.selectedTrackOrder = this.tracksPersister.getSelectedTrackOrder();
        this.mouseSelectionWatcher.initialize(this.tracks.tracks, false);
    }

    public setSelectedTrack(track: TrackModel): void {
        this.selectedTrack = track;
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
        try {
            switch (this.selectedTrackOrder) {
                case TrackOrder.byTrackTitleAscending:
                    this.orderedTracks = this.tracks.tracks.sort((a, b) => (a.title < b.title ? -1 : 1));
                    break;
                case TrackOrder.byTrackTitleDescending:
                    this.orderedTracks = this.tracks.tracks.sort((a, b) => (a.title < b.title ? 1 : -1));
                    break;
                case TrackOrder.byAlbum:
                    // TODO
                    break;
                default: {
                    this.orderedTracks = this.tracks.tracks.sort((a, b) => (a.title < b.title ? -1 : 1));
                    break;
                }
            }
        } catch (e) {
            this.logger.error(`Could not order tracks. Error: ${e.message}`, 'TrackBrowserComponent', 'orderTracks');
        }
    }
}
