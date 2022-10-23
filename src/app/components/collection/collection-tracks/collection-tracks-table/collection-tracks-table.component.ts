import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
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

    public constructor(public playbackService: BasePlaybackService, public mouseSelectionWatcher: MouseSelectionWatcher) {}

    public orderedTracks: TrackModel[] = [];

    public ngOnInit(): void {}

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
    }
}
