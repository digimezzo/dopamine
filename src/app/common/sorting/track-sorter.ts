import { Injectable } from '@angular/core';
import { TrackModel } from '../../services/track/track-model';
import { sort } from 'fast-sort';
import { Logger } from '../logger';
import { Timer } from '../scheduling/timer';

@Injectable({ providedIn: 'root' })
export class TrackSorter {
    public constructor(private logger: Logger) {}

    public sortByTitleAscending(tracks: TrackModel[]): TrackModel[] {
        const timer = new Timer();
        timer.start();

        const sorted: TrackModel[] = sort(tracks).by([
            {
                asc: (t) => t.sortableTitle,
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting tracks by title ascending. Time required: ${timer.elapsedMilliseconds} ms`,
            'TrackSorter',
            'sortByTitleAscending',
        );

        return sorted;
    }

    public sortByTitleDescending(tracks: TrackModel[]): TrackModel[] {
        const timer = new Timer();
        timer.start();

        const sorted: TrackModel[] = sort(tracks).by([
            {
                desc: (t) => t.sortableTitle,
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting tracks by title descending. Time required: ${timer.elapsedMilliseconds} ms`,
            'TrackSorter',
            'sortByTitleDescending',
        );

        return sorted;
    }

    public sortByDateCreatedAscending(tracks: TrackModel[]): TrackModel[] {
        const timer = new Timer();
        timer.start();

        // Use track number as a secondary key to ensure stable ordering when dateCreated values are equal
        const sorted = sort(tracks).by([{ asc: (t) => t.dateCreated }, { asc: (t) => t.number }]);

        timer.stop();

        this.logger.info(
            `Finished sorting tracks by date created ascending. Time required: ${timer.elapsedMilliseconds} ms`,
            'TrackSorter',
            'sortByDateCreatedAscending',
        );

        return sorted;
    }

    public sortByDateCreatedDescending(tracks: TrackModel[]): TrackModel[] {
        const timer = new Timer();
        timer.start();

        // Use track number as a secondary key to ensure stable ordering when dateCreated values are equal
        const sorted = sort(tracks).by([{ desc: (t) => t.dateCreated }, { desc: (t) => t.number }]);

        timer.stop();

        this.logger.info(
            `Finished sorting tracks by date created descending. Time required: ${timer.elapsedMilliseconds} ms`,
            'TrackSorter',
            'sortByDateCreatedDescending',
        );

        return sorted;
    }

    public sortByAlbum(tracks: TrackModel[]): TrackModel[] {
        const timer = new Timer();
        timer.start();

        const sorted: TrackModel[] = sort(tracks).by([
            {
                asc: (t) => t.sortableAlbumProperties,
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(`Finished sorting tracks by album. Time required: ${timer.elapsedMilliseconds} ms`, 'TrackSorter', 'sortByAlbum');

        return sorted;
    }
}
