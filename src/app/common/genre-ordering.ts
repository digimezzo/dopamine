import { Injectable } from '@angular/core';
import { GenreModel } from '../services/genre/genre-model';

@Injectable()
export class GenreOrdering {
    public getGenresOrderedAscending(genresToOrder: GenreModel[]): GenreModel[] {
        return genresToOrder.sort((a, b) => (a.sortableName > b.sortableName ? 1 : -1));
    }

    public getGenresOrderedDescending(genresToOrder: GenreModel[]): GenreModel[] {
        return genresToOrder.sort((a, b) => (a.sortableName < b.sortableName ? 1 : -1));
    }
}
