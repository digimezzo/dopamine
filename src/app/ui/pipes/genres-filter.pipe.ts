import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../../common/strings';
import { GenreModel } from '../../services/genre/genre-model';
import { SearchServiceBase } from '../../services/search/search.service.base';

@Pipe({ name: 'genresFilter' })
export class GenresFilterPipe implements PipeTransform {
    public constructor(private searchService: SearchServiceBase) {}

    public transform(genres: GenreModel[], textToContain: string | undefined): GenreModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return genres;
        }

        const filteredGenres: GenreModel[] = [];

        for (const genre of genres) {
            if (this.searchService.matchesSearchText(genre.displayName, textToContain!)) {
                filteredGenres.push(genre);
            }
        }

        return filteredGenres;
    }
}
