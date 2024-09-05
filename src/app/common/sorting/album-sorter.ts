import { Injectable } from '@angular/core';
import { AlbumModel } from '../../services/album/album-model';
import { Timer } from '../scheduling/timer';
import { sort } from 'fast-sort';
import { Logger } from '../logger';

@Injectable({ providedIn: 'root' })
export class AlbumSorter {
    public constructor(private logger: Logger) {}

    public sortByAlbumTitleAscending(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: AlbumModel[] = sort(albums!).by([
            {
                asc: (a) => a.albumTitle.toLowerCase(),
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting albums by title ascending. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumSorter',
            'sortByAlbumTitleAscending',
        );

        return sorted;
    }

    public sortByAlbumTitleDescending(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: AlbumModel[] = sort(albums!).by([
            {
                desc: (a) => a.albumTitle.toLowerCase(),
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting albums by title descending. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumSorter',
            'sortByAlbumTitleDescending',
        );

        return sorted;
    }

    public sortByDateAdded(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: AlbumModel[] = sort(albums).asc((a) => a.dateAddedInTicks);

        timer.stop();

        this.logger.info(
            `Finished sorting albums by date added. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumSorter',
            'sortByDateAdded',
        );

        return sorted;
    }

    public sortByDateCreated(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: AlbumModel[] = sort(albums).asc((a) => a.dateFileCreatedInTicks);

        timer.stop();

        this.logger.info(
            `Finished sorting albums by date created. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumSorter',
            'sortByDateCreated',
        );

        return sorted;
    }

    public sortByAlbumArtist(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: AlbumModel[] = sort(albums!).by([
            {
                asc: (a) => a.albumArtist.toLowerCase(),
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting albums by album artist. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumSorter',
            'sortByAlbumArtist',
        );

        return sorted;
    }

    public sortByYearAscending(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: AlbumModel[] = sort(albums).asc((a) => a.year);

        timer.stop();

        this.logger.info(
            `Finished sorting albums by year ascending. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumSorter',
            'sortByYearAscending',
        );

        return sorted;
    }

    public sortByYearDescending(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: AlbumModel[] = sort(albums).desc((a) => a.year);

        timer.stop();

        this.logger.info(
            `Finished sorting albums by year ascending. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumSorter',
            'sortByYearDescending',
        );

        return sorted;
    }

    public sortByDateLastPlayed(albums: AlbumModel[] | undefined): AlbumModel[] {
        if (albums == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: AlbumModel[] = sort(albums).asc((a) => a.dateLastPlayedInTicks);

        timer.stop();

        this.logger.info(
            `Finished sorting albums by date last played. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumSorter',
            'sortByDateLastPlayed',
        );

        return sorted;
    }
}
