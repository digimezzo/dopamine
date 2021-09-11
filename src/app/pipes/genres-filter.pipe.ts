import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { GenreModel } from '../services/genre/genre-model';

@Pipe({ name: 'genresFilter' })
export class GenresFilterPipe implements PipeTransform {
    constructor() {}

    public transform(genres: GenreModel[], filterTerm: string): GenreModel[] {
        if (Strings.isNullOrWhiteSpace(filterTerm)) {
            return genres;
        }

        const filteredGenres: GenreModel[] = [];

        for (const genre of genres) {
            if (genre.displayName.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredGenres.push(genre);
            }
        }

        return filteredGenres;
    }
}
