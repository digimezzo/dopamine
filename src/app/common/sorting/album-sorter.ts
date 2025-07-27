import { Injectable } from '@angular/core';
import { AlbumModel } from '../../services/album/album-model';
import { Timer } from '../scheduling/timer';
import { sort } from 'fast-sort';
import { Logger } from '../logger';
import { AlbumOrder } from '../../ui/components/collection/album-order';
import { Shuffler } from '../shuffler';

@Injectable({ providedIn: 'root' })
export class AlbumSorter {
    private readonly collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    private readonly compare = (a: string, b: string): number => this.collator.compare(a, b);

    public constructor(
        private shuffler: Shuffler,
        private logger: Logger,
    ) {}

    public sortAlbums(albums: AlbumModel[], albumOrder: AlbumOrder): AlbumModel[] {
        if (albums.length <= 1) {
            return albums;
        }

        switch (albumOrder) {
            case AlbumOrder.byAlbumTitleAscending:
                return this.sortByString(albums, (x) => x.albumTitle, true, 'album title ascending');
            case AlbumOrder.byAlbumTitleDescending:
                return this.sortByString(albums, (x) => x.albumTitle, false, 'album title descending');
            case AlbumOrder.byDateAdded:
                return this.sort(() => sort(albums).desc((a) => a.dateAddedInTicks), 'date added');
            case AlbumOrder.byDateCreated:
                return this.sort(() => sort(albums).desc((a) => a.dateFileCreatedInTicks), 'date created');
            case AlbumOrder.byAlbumArtist:
                return this.sortByString(albums, (a) => a.albumArtist, true, 'album artist');
            case AlbumOrder.byYearAscending:
                return this.sort(() => albums.sort((a, b) => a.year - b.year), 'year ascending');
            case AlbumOrder.byYearDescending:
                return this.sort(() => albums.sort((a, b) => b.year - a.year), 'year descending');
            case AlbumOrder.byLastPlayed:
                return this.sort(() => sort(albums).desc((a) => a.dateLastPlayedInTicks), 'date last played');
            case AlbumOrder.random:
                return this.sort(() => this.shuffler.shuffle(albums), 'random');
        }
    }

    private sortByString(
        albums: AlbumModel[],
        fieldSelector: (a: AlbumModel) => string,
        ascending: boolean,
        sortType: string,
    ): AlbumModel[] {
        const keySelector = (a: AlbumModel) => fieldSelector(a);
        const sortField = ascending
            ? {
                  asc: keySelector,
                  comparer: this.compare,
              }
            : {
                  desc: keySelector,
                  comparer: this.compare,
              };

        return this.sort(() => sort(albums).by([sortField]), sortType);
    }

    private sort(sortFunction: () => AlbumModel[], sortType: string) {
        const timer = new Timer();
        timer.start();

        const sorted: AlbumModel[] = sortFunction();

        timer.stop();

        this.logger.info(`Finished sorting albums by ${sortType}. Time required: ${timer.elapsedMilliseconds} ms`, 'AlbumSorter', 'sort');

        return sorted;
    }
}
