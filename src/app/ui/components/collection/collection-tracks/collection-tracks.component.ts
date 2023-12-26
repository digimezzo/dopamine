import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../common/application/constants';
import { Logger } from '../../../../common/logger';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { TrackModels } from '../../../../services/track/track-models';
import { CollectionPersister } from '../collection-persister';
import { SearchServiceBase } from '../../../../services/search/search.service.base';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { MouseSelectionWatcher } from '../../mouse-selection-watcher';
import { SchedulerBase } from '../../../../common/scheduling/scheduler.base';

@Component({
    selector: 'app-collection-tracks',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './collection-tracks.component.html',
    styleUrls: ['./collection-tracks.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class CollectionTracksComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    public constructor(
        public searchService: SearchServiceBase,
        private trackService: TrackServiceBase,
        private collectionService: CollectionServiceBase,
        private collectionPersister: CollectionPersister,
        private scheduler: SchedulerBase,
        private logger: Logger,
    ) {}

    public tracks: TrackModels = new TrackModels();

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearLists();
    }

    public async ngOnInit(): Promise<void> {
        this.subscription.add(
            this.collectionPersister.selectedTabChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.fillListsAsync());
            }),
        );

        this.subscription.add(
            this.collectionService.collectionChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.fillListsAsync());
            }),
        );

        await this.fillListsAsync();
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
