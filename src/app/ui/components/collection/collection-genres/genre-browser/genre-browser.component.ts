import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../../common/application/constants';
import { Logger } from '../../../../../common/logger';
import { SemanticZoomHeaderAdder } from '../../../../../common/semantic-zoom-header-adder';
import { PromiseUtils } from '../../../../../common/utils/promise-utils';
import { GenreModel } from '../../../../../services/genre/genre-model';
import { AddToPlaylistMenu } from '../../../add-to-playlist-menu';
import { GenresPersister } from '../genres-persister';
import { GenreOrder } from './genre-order';
import { PlaybackServiceBase } from '../../../../../services/playback/playback.service.base';
import { SemanticZoomServiceBase } from '../../../../../services/semantic-zoom/semantic-zoom.service.base';
import { ApplicationServiceBase } from '../../../../../services/application/application.service.base';
import { SchedulerBase } from '../../../../../common/scheduling/scheduler.base';
import { MouseSelectionWatcher } from '../../../mouse-selection-watcher';
import { ContextMenuOpener } from '../../../context-menu-opener';
import { GenreSorter } from '../../../../../common/sorting/genre-sorter';
import { Timer } from '../../../../../common/scheduling/timer';

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

    public constructor(
        public playbackService: PlaybackServiceBase,
        private semanticZoomService: SemanticZoomServiceBase,
        private applicationService: ApplicationServiceBase,
        public addToPlaylistMenu: AddToPlaylistMenu,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        private genreSorter: GenreSorter,
        private semanticZoomHeaderAdder: SemanticZoomHeaderAdder,
        private scheduler: SchedulerBase,
        private logger: Logger,
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
            }),
        );

        this.subscription.add(
            this.semanticZoomService.zoomInRequested$.subscribe((text: string) => {
                PromiseUtils.noAwait(this.scrollToZoomHeaderAsync(text));
            }),
        );

        this.subscription.add(
            this.applicationService.mouseButtonReleased$.subscribe(() => {
                this.shouldZoomOut = false;
            }),
        );
    }

    public setSelectedGenres(event: MouseEvent, genreToSelect: GenreModel): void {
        if (!genreToSelect.isZoomHeader) {
            this.mouseSelectionWatcher.setSelectedItems(event, genreToSelect);
            this.genresPersister.setSelectedGenres(this.mouseSelectionWatcher.selectedItems as GenreModel[]);
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

    public onGenreContextMenu(event: MouseEvent, genre: GenreModel): void {
        this.contextMenuOpener.open(this.genreContextMenu, event, genre);
    }

    public async onAddToQueueAsync(genre: GenreModel): Promise<void> {
        await this.playbackService.addGenreToQueueAsync(genre);
    }

    private orderGenres(): void {
        let orderedGenres: GenreModel[] = [];

        const timer = new Timer();
        timer.start();

        try {
            switch (this.selectedGenreOrder) {
                case GenreOrder.byGenreAscending:
                    orderedGenres = this.genreSorter.sortAscending(this.genres);
                    break;
                case GenreOrder.byGenreDescending:
                    orderedGenres = this.genreSorter.sortDescending(this.genres);
                    break;
                default: {
                    orderedGenres = this.genreSorter.sortAscending(this.genres);
                    break;
                }
            }

            orderedGenres = this.semanticZoomHeaderAdder.addZoomHeaders(orderedGenres) as GenreModel[];

            timer.stop();

            this.logger.info(
                `Finished ordering genres. Time required: ${timer.elapsedMilliseconds} ms`,
                'GenreBrowserComponent',
                'orderGenres',
            );

            this.applySelectedGenres();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not order genres', 'GenreBrowserComponent', 'orderGenres');
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

        const selectedIndex = this.orderedGenres.findIndex((elem) => elem.zoomHeader === text && elem.isZoomHeader);

        if (selectedIndex > -1) {
            this.viewPort.scrollToIndex(selectedIndex, 'smooth');
        }
    }
}
