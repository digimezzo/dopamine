import { Injectable } from '@angular/core';
import { GenreModel } from '../../services/genre/genre-model';
import { Logger } from '../logger';
import { Timer } from '../scheduling/timer';
import { sort } from 'fast-sort';
import { Constants } from '../application/constants';

@Injectable({ providedIn: 'root' })
export class GenreSorter {
    private readonly collator: Intl.Collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    private readonly compare = this.collator.compare.bind(this.collator) as (a: string, b: string) => number;

    public constructor(private logger: Logger) {}

    public sortAscending(genres: GenreModel[] = []): GenreModel[] {
        return this.sortGenres(genres, true);
    }

    public sortDescending(genres: GenreModel[] = []): GenreModel[] {
        return this.sortGenres(genres, false);
    }

    private sortGenres(genres: GenreModel[], ascending: boolean): GenreModel[] {
        if (genres.length === 0) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sortConfig = ascending
            ? [
                  { asc: (g: GenreModel) => Constants.extendedAlphabeticalHeaders.indexOf(g.zoomHeader) },
                  { asc: (g: GenreModel) => g.sortableName, comparer: this.compare },
              ]
            : [
                  { desc: (g: GenreModel) => Constants.extendedAlphabeticalHeaders.indexOf(g.zoomHeader) },
                  { desc: (g: GenreModel) => g.sortableName, comparer: this.compare },
              ];

        const sorted = sort(genres).by(sortConfig);

        timer.stop();

        this.logger.info(
            `Finished sorting genres ${ascending ? 'ascending' : 'descending'}. Time required: ${timer.elapsedMilliseconds} ms`,
            'GenreSorter',
            'sortGenres',
        );

        return sorted;
    }
}
