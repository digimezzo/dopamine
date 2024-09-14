import { Injectable } from '@angular/core';
import { GenreModel } from '../../services/genre/genre-model';
import { Logger } from '../logger';
import { Timer } from '../scheduling/timer';
import { sort } from 'fast-sort';

@Injectable({ providedIn: 'root' })
export class GenreSorter {
    public constructor(private logger: Logger) {}

    public sortAscending(genres: GenreModel[] | undefined): GenreModel[] {
        if (genres == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: GenreModel[] = sort(genres!).by([
            {
                asc: (g) => g.sortableName,
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting genres ascending. Time required: ${timer.elapsedMilliseconds} ms`,
            'GenreSorter',
            'sortAscending',
        );

        return sorted;
    }

    public sortDescending(genres: GenreModel[] | undefined): GenreModel[] {
        if (genres == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: GenreModel[] = sort(genres!).by([
            {
                desc: (g) => g.sortableName,
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting genres descending. Time required: ${timer.elapsedMilliseconds} ms`,
            'GenreSorter',
            'sortDescending',
        );

        return sorted;
    }
}
