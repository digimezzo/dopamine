import { Injectable } from '@angular/core';
import { ArtistModel } from '../../services/artist/artist-model';
import { Sorter } from './sorter';

@Injectable({ providedIn: 'root' })
export class ArtistSorter {
    public sortAscending(artists: ArtistModel[] | undefined): ArtistModel[] {
        if (artists == undefined) {
            return [];
        }

        return artists.sort((a, b) => Sorter.naturalSort(a.sortableName, b.sortableName));
    }

    public sortDescending(artists: ArtistModel[] | undefined): ArtistModel[] {
        if (artists == undefined) {
            return [];
        }

        return artists.sort((a, b) => Sorter.naturalSort(b.sortableName, a.sortableName));
    }
}
