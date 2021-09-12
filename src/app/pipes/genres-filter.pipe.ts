import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { GenreModel } from '../services/genre/genre-model';
import { BaseSearchService } from '../services/search/base-search.service';

@Pipe({ name: 'genresFilter' })
export class GenresFilterPipe implements PipeTransform {
    constructor(private searchService: BaseSearchService) {}

    public transform(genres: GenreModel[], textToContain: string): GenreModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return genres;
        }

        const filteredGenres: GenreModel[] = [];

        for (const genre of genres) {
            if (this.searchService.matchesSearchText(genre.displayName, textToContain)) {
                filteredGenres.push(genre);
            }
        }

        return filteredGenres;
    }
}
