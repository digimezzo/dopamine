import { Component, Input, OnInit } from '@angular/core';
import { Logger } from '../../../core/logger';
import { MouseSelectionWatcher } from '../../../core/mouse-selection-watcher';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
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

    constructor(
        public playbackService: BasePlaybackService,
        private mouseSelectionWatcher: MouseSelectionWatcher,
        private logger: Logger
    ) {}

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
        this.mouseSelectionWatcher.initialize(this.tracks.tracks, false);
        this.orderTracks();
    }

    public selectedTrack: TrackModel;

    public ngOnInit(): void {
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
                    orderedTracks = this.tracks.tracks.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
                    for (const track of orderedTracks) {
                        track.showHeader = false;
                    }
                    break;
                case TrackOrder.byTrackTitleDescending:
                    orderedTracks = this.tracks.tracks.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1));
                    for (const track of orderedTracks) {
                        track.showHeader = false;
                    }
                    break;
                case TrackOrder.byAlbum:
                    orderedTracks = this.getTracksOrderedByAlbum();
                    let previousAlbumKey: string = 'Raphaël is cool';

                    for (const track of orderedTracks) {
                        if (track.albumKey !== previousAlbumKey) {
                            track.showHeader = true;
                        }

                        previousAlbumKey = track.albumKey;
                    }
                    break;
                default: {
                    orderedTracks = this.tracks.tracks.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
                    for (const track of orderedTracks) {
                        track.showHeader = false;
                    }
                    break;
                }
            }
        } catch (e) {
            this.logger.error(`Could not order tracks. Error: ${e.message}`, 'TrackBrowserComponent', 'orderTracks');
        }

        this.orderedTracks = [...orderedTracks];
    }

    private getTracksOrderedByAlbum(): TrackModel[] {
        return this.tracks.tracks.sort((a, b) => {
            if (a.albumArtist > b.albumArtist) {
                return 1;
            } else if (a.albumArtist < b.albumArtist) {
                return -1;
            }

            if (a.albumTitle > b.albumTitle) {
                return 1;
            } else if (a.albumTitle < b.albumTitle) {
                return -1;
            }

            if (a.number > b.number) {
                return 1;
            } else if (a.number < b.number) {
                return -1;
            } else {
                return 0;
            }
        });
    }
}
