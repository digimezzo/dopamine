import { Injectable } from '@angular/core';
import { GenreModel } from '../../services/genre/genre-model';

@Injectable()
export class GenreOrdering {
    public getGenresOrderedAscending(genresToOrder: GenreModel[]): GenreModel[] {
        if (genresToOrder == undefined) {
            return [];
        }

        return genresToOrder.sort((a, b) => (a.sortableName > b.sortableName ? 1 : -1));
    }

    public getGenresOrderedDescending(genresToOrder: GenreModel[]): GenreModel[] {
        if (genresToOrder == undefined) {
            return [];
        }

        return genresToOrder.sort((a, b) => (a.sortableName < b.sortableName ? 1 : -1));
    }
}
