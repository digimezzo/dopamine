import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
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
    private _genres: string[] = [];
    private _genresPersister: GenresPersister;

    constructor(private mouseSelectionWatcher: MouseSelectionWatcher, private logger: Logger) {}

    public orderedGenres: string[] = [];

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

    public get genres(): string[] {
        return this._genres;
    }

    @Input()
    public set genres(v: string[]) {
        this._genres = v;
        this.mouseSelectionWatcher.initialize(this.genres, false);
        this.orderGenres();
    }

    public ngOnDestroy(): void {}

    public ngOnInit(): void {
        this.selectedGenreOrder = this.genresPersister.getSelectedGenreOrder();
    }

    private orderGenres(): void {}
}
