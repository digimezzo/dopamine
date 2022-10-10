import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduling/scheduler';
import { BaseSearchService } from '../../../services/search/base-search.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { CollectionPersister } from '../collection-persister';

@Component({
    selector: 'app-collection-tracks',
    templateUrl: './collection-tracks.component.html',
    styleUrls: ['./collection-tracks.component.scss'],
})
export class CollectionTracksComponent implements AfterViewInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(
        public searchService: BaseSearchService,
        private trackService: BaseTrackService,
        private collectionPersister: CollectionPersister,
        private liveAnnouncer: LiveAnnouncer,
        private scheduler: Scheduler,
        private logger: Logger
    ) {}

    @ViewChild(MatSort) private sort: MatSort;

    public displayedColumns: string[] = ['artists', 'title'];
    public tracks: TrackModels = new TrackModels();
    public dataSource: TableVirtualScrollDataSource<TrackModel> = new TableVirtualScrollDataSource(this.tracks.tracks);

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearLists();
    }

    public async ngAfterViewInit(): Promise<void> {
        this.subscription.add(
            this.collectionPersister.selectedTabChanged$.subscribe(async () => {
                await this.processListsAsync();
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
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionTracksComponent', 'fillListsAsync');
        }
    }

    private clearLists(): void {
        this.tracks = new TrackModels();
        this.dataSource = new TableVirtualScrollDataSource(this.tracks.tracks);
    }

    private getTracks(): void {
        this.tracks = this.trackService.getAllTracks();
        this.dataSource = new TableVirtualScrollDataSource(this.tracks.tracks);
        this.dataSource.sort = this.sort;
    }

    public announceSortChange(sortState: Sort): void {
        if (sortState.direction) {
            this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this.liveAnnouncer.announce('Sorting cleared');
        }
    }
}
