import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { ArtistModel } from '../services/artist/artist-model';
import { BaseSearchService } from '../services/search/base-search.service';

@Pipe({ name: 'artistsFilter' })
export class ArtistFilterPipe implements PipeTransform {
    constructor(private searchService: BaseSearchService) {}

    public transform(artists: ArtistModel[], textToContain: string): ArtistModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return artists;
        }

        const filteredArtists: ArtistModel[] = [];

        for (const artist of artists) {
            if (this.searchService.matchesSearchText(artist.displayName, textToContain)) {
                filteredArtists.push(artist);
            }
        }

        return filteredArtists;
    }
}
