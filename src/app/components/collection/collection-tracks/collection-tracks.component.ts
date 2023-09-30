import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { Scheduler } from '../../../common/scheduling/scheduler';
import { PromiseUtils } from '../../../common/utils/promise-utils';
import { BaseCollectionService } from '../../../services/collection/base-collection.service';
import { BaseSearchService } from '../../../services/search/base-search.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModels } from '../../../services/track/track-models';
import { CollectionPersister } from '../collection-persister';

@Component({
    selector: 'app-collection-tracks',
    templateUrl: './collection-tracks.component.html',
    styleUrls: ['./collection-tracks.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class CollectionTracksComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    public constructor(
        public searchService: BaseSearchService,
        private trackService: BaseTrackService,
        private collectionService: BaseCollectionService,
        private collectionPersister: CollectionPersister,
        private scheduler: Scheduler,
        private logger: Logger
    ) {}

    public tracks: TrackModels = new TrackModels();

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearLists();
    }

    public async ngOnInit(): Promise<void> {
        this.subscription.add(
            this.collectionPersister.selectedTabChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.processListsAsync());
            })
        );

        this.subscription.add(
            this.collectionService.collectionChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.processListsAsync());
            })
        );

        await this.processListsAsync();
    }

    private async processListsAsync(): Promise<void> {
        if (this.collectionPersister.selectedTab === Constants.tracksTabLabel) {
            await this.fillListsAsync();
        } else {
            this.clearLists();
        }
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);

        try {
            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            this.getTracks();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not fill lists', 'CollectionTracksComponent', 'fillListsAsync');
        }
    }

    private clearLists(): void {
        this.tracks = new TrackModels();
    }

    private getTracks(): void {
        this.tracks = this.trackService.getVisibleTracks();
    }
}
