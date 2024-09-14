import { Injectable } from '@angular/core';
import { PlaylistModel } from '../../services/playlist/playlist-model';
import { Logger } from '../logger';
import { Timer } from '../scheduling/timer';
import { sort } from 'fast-sort';

@Injectable({ providedIn: 'root' })
export class PlaylistSorter {
    public constructor(private logger: Logger) {}

    public sortAscending(playlists: PlaylistModel[] | undefined): PlaylistModel[] {
        if (playlists == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: PlaylistModel[] = sort(playlists!).by([
            {
                asc: (p) => p.name.toLowerCase(),
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting playlists ascending. Time required: ${timer.elapsedMilliseconds} ms`,
            'PlaylistSorter',
            'sortAscending',
        );

        return sorted;
    }

    public sortDescending(playlists: PlaylistModel[] | undefined): PlaylistModel[] {
        if (playlists == undefined) {
            return [];
        }

        const timer = new Timer();
        timer.start();

        const sorted: PlaylistModel[] = sort(playlists!).by([
            {
                desc: (p) => p.name.toLowerCase(),
                comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
            },
        ]);

        timer.stop();

        this.logger.info(
            `Finished sorting playlists descending. Time required: ${timer.elapsedMilliseconds} ms`,
            'PlaylistSorter',
            'sortDescending',
        );

        return sorted;
    }
}
