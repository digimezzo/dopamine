import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../common/application/constants';
import { ContextMenuOpener } from '../../../../common/context-menu-opener';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { GenreOrdering } from '../../../../common/ordering/genre-ordering';
import { BaseScheduler } from '../../../../common/scheduling/base-scheduler';
import { SemanticZoomHeaderAdder } from '../../../../common/semantic-zoom-header-adder';
import { BaseApplicationService } from '../../../../services/application/base-application.service';
import { GenreModel } from '../../../../services/genre/genre-model';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';
import { AddToPlaylistMenu } from '../../../add-to-playlist-menu';
import { GenresPersister } from '../genres-persister';
import { GenreOrder } from './genre-order';

@Component({
    selector: 'app-genre-browser',
    host: { style: 'display: block' },
    templateUrl: './genre-browser.component.html',
    styleUrls: ['./genre-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class GenreBrowserComponent implements OnInit, OnDestroy {
    @ViewChild(CdkVirtualScrollViewport) public viewPort: CdkVirtualScrollViewport;

    private _genres: GenreModel[] = [];
    private _genresPersister: GenresPersister;
    private subscription: Subscription = new Subscription();

    constructor(
        public playbackService: BasePlaybackService,
        private semanticZoomService: BaseSemanticZoomService,
        private applicationService: BaseApplicationService,
        public addToPlaylistMenu: AddToPlaylistMenu,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        private genreOrdering: GenreOrdering,
        private semanticZoomHeaderAdder: SemanticZoomHeaderAdder,
        private scheduler: BaseScheduler,
        private logger: Logger
    ) {}

    public shouldZoomOut: boolean = false;

    @ViewChild('genreContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public genreContextMenu: MatMenuTrigger;

    public orderedGenres: GenreModel[] = [];

    public genreOrderEnum: typeof GenreOrder = GenreOrder;
    public selectedGenreOrder: GenreOrder;

    public get genresPersister(): GenresPersister {
        return this._genresPersister;
    }

    @Input()
    public set genresPersister(v: GenresPersister) {
        this._genresPersister = v;
        this.selectedGenreOrder = this.genresPersister.getSelectedGenreOrder();
        this.orderGenres();
    }

    public get genres(): GenreModel[] {
        return this._genres;
    }

    @Input()
    public set genres(v: GenreModel[]) {
        this._genres = v;
        this.mouseSelectionWatcher.initialize(this.genres, false);

        // When the component is first rendered, it happens that genresPersister is undefined.
        if (this.genresPersister != undefined) {
            this.orderGenres();
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.semanticZoomService.zoomOutRequested$.subscribe(() => {
                this.shouldZoomOut = true;
            })
        );

        this.subscription.add(
            this.semanticZoomService.zoomInRequested$.subscribe((text: string) => {
                this.scrollToZoomHeaderAsync(text);
            })
        );

        this.subscription.add(
            this.applicationService.mouseButtonReleased$.subscribe(() => {
                this.shouldZoomOut = false;
            })
        );
    }

    public setSelectedGenres(event: any, genreToSelect: GenreModel): void {
        if (!genreToSelect.isZoomHeader) {
            this.mouseSelectionWatcher.setSelectedItems(event, genreToSelect);
            this.genresPersister.setSelectedGenres(this.mouseSelectionWatcher.selectedItems);
        }
    }

    public toggleGenreOrder(): void {
        switch (this.selectedGenreOrder) {
            case GenreOrder.byGenreAscending:
                this.selectedGenreOrder = GenreOrder.byGenreDescending;
                break;
            case GenreOrder.byGenreDescending:
                this.selectedGenreOrder = GenreOrder.byGenreAscending;
                break;
            default: {
                this.selectedGenreOrder = GenreOrder.byGenreAscending;
                break;
            }
        }

        this.genresPersister.setSelectedGenreOrder(this.selectedGenreOrder);
        this.orderGenres();
    }

    public async onGenreContextMenuAsync(event: MouseEvent, genre: GenreModel): Promise<void> {
        this.contextMenuOpener.open(this.genreContextMenu, event, genre);
    }

    public async onAddToQueueAsync(genre: GenreModel): Promise<void> {
        await this.playbackService.addGenreToQueueAsync(genre);
    }

    private orderGenres(): void {
        let orderedGenres: GenreModel[] = [];

        try {
            switch (this.selectedGenreOrder) {
                case GenreOrder.byGenreAscending:
                    orderedGenres = this.genreOrdering.getGenresOrderedAscending(this.genres);
                    break;
                case GenreOrder.byGenreDescending:
                    orderedGenres = this.genreOrdering.getGenresOrderedDescending(this.genres);
                    break;
                default: {
                    orderedGenres = this.genreOrdering.getGenresOrderedAscending(this.genres);
                    break;
                }
            }

            this.semanticZoomHeaderAdder.addZoomHeaders(orderedGenres);
            this.applySelectedGenres();
        } catch (e) {
            this.logger.error(`Could not order genres. Error: ${e.message}`, 'GenreBrowserComponent', 'orderGenres');
        }

        this.orderedGenres = [...orderedGenres];
    }

    private applySelectedGenres(): void {
        const selectedGenres: GenreModel[] = this.genresPersister.getSelectedGenres(this.genres);

        if (selectedGenres == undefined) {
            return;
        }

        for (const selectedGenre of selectedGenres) {
            selectedGenre.isSelected = true;
        }
    }

    private async scrollToZoomHeaderAsync(text: string): Promise<void> {
        this.shouldZoomOut = false;
        await this.scheduler.sleepAsync(Constants.semanticZoomInDelayMilliseconds);

        const selectedIndex = this._genres.findIndex((elem) => elem.zoomHeader === text && elem.isZoomHeader);

        if (selectedIndex > -1) {
            this.viewPort.scrollToIndex(selectedIndex, 'smooth');
        }
    }
}
