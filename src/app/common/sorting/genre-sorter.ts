import { Injectable } from '@angular/core';
import { GenreModel } from '../../services/genre/genre-model';
import { Sorter } from './sorter';

@Injectable({ providedIn: 'root' })
export class GenreSorter {
    public sortAscending(genres: GenreModel[] | undefined): GenreModel[] {
        if (genres == undefined) {
            return [];
        }

        return genres.sort((a, b) => Sorter.naturalSort(a.sortableName, b.sortableName));
    }

    public sortDescending(genres: GenreModel[] | undefined): GenreModel[] {
        if (genres == undefined) {
            return [];
        }

        return genres.sort((a, b) => Sorter.naturalSort(b.sortableName, a.sortableName));
    }
}
