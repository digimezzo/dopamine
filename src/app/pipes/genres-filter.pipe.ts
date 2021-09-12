import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { GenreModel } from '../services/genre/genre-model';
import { BaseFilterPipe } from './base-filter.pipe';

@Pipe({ name: 'genresFilter' })
export class GenresFilterPipe extends BaseFilterPipe implements PipeTransform {
    constructor() {
        super();
    }

    public transform(genres: GenreModel[], textToContain: string): GenreModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return genres;
        }

        const filteredGenres: GenreModel[] = [];

        for (const genre of genres) {
            if (this.containsText(genre.displayName, textToContain)) {
                filteredGenres.push(genre);
            }
        }

        return filteredGenres;
    }
}
