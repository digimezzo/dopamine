import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { GenreOrdering } from '../../../../common/genre-ordering';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { GenreModel } from '../../../../services/genre/genre-model';
import { GenreOrder } from './genre-order';
import { GenresPersister } from './genres-persister';

@Component({
    selector: 'app-genre-browser',
    host: { style: 'display: block' },
    templateUrl: './genre-browser.component.html',
    styleUrls: ['./genre-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class GenreBrowserComponent implements OnInit, OnDestroy {
    private _genres: GenreModel[] = [];
    private _genresPersister: GenresPersister;

    constructor(private mouseSelectionWatcher: MouseSelectionWatcher, private genreOrdering: GenreOrdering, private logger: Logger) {}

    public orderedGenres: GenreModel[] = [];

    public genreOrderEnum: typeof GenreOrder = GenreOrder;
    public selectedGenreOrder: GenreOrder;

    public get genresPersister(): GenresPersister {
        return this._genresPersister;
    }

    @Input()
    public set genresPersister(v: GenresPersister) {
        this._genresPersister = v;
        this.orderGenres();
    }

    public get genres(): GenreModel[] {
        return this._genres;
    }

    @Input()
    public set genres(v: GenreModel[]) {
        this._genres = v;
        this.mouseSelectionWatcher.initialize(this.genres, false);
        this.orderGenres();
    }

    public ngOnDestroy(): void {}

    public ngOnInit(): void {
        this.selectedGenreOrder = this.genresPersister.getSelectedGenreOrder();
    }

    public setSelectedGenres(event: any, genreToSelect: GenreModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, genreToSelect);
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

            this.showGenreHeaders(orderedGenres);
        } catch (e) {
            this.logger.error(`Could not order genres. Error: ${e.message}`, 'TrackBrowserComponent', 'orderTracks');
        }

        this.orderedGenres = [...orderedGenres];
    }

    private showGenreHeaders(orderedGenres: GenreModel[]): void {
        let previousAlphabeticalHeader: string = uuidv4();

        for (const genre of orderedGenres) {
            if (genre.alphabeticalHeader !== previousAlphabeticalHeader) {
                genre.showHeader = true;
            }

            previousAlphabeticalHeader = genre.alphabeticalHeader;
        }
    }
}
