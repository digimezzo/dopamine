import { Injectable } from '@angular/core';
import { ArtistModel } from '../../services/artist/artist-model';
import { Timer } from '../scheduling/timer';
import { sort } from 'fast-sort';
import { Logger } from '../logger';

@Injectable({ providedIn: 'root' })
export class ArtistSorter {
    public constructor(private logger: Logger) {}

    public sortAscending(artists: ArtistModel[] | undefined): ArtistModel[] {
        if (artists == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: ArtistModel[] = sort(artists!).by([
            {
                asc: (a) => a.sortableName,
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting artists ascending. Time required: ${timer.elapsedMilliseconds} ms`,
            'ArtistSorter',
            'sortAscending',
        );

        return sorted;
    }

    public sortDescending(artists: ArtistModel[] | undefined): ArtistModel[] {
        if (artists == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: ArtistModel[] = sort(artists!).by([
            {
                desc: (a) => a.sortableName,
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting artists descending. Time required: ${timer.elapsedMilliseconds} ms`,
            'ArtistSorter',
            'sortDescending',
        );

        return sorted;
    }
}
