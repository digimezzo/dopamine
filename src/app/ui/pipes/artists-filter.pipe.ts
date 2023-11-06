import { Pipe, PipeTransform } from '@angular/core';
import { SearchServiceBase } from '../../services/search/search.service.base';
import { ArtistModel } from '../../services/artist/artist-model';
import { StringUtils } from '../../common/utils/string-utils';

@Pipe({ name: 'artistsFilter' })
export class ArtistsFilterPipe implements PipeTransform {
    public constructor(private searchService: SearchServiceBase) {}

    public transform(artists: ArtistModel[], textToContain: string | undefined): ArtistModel[] {
        if (StringUtils.isNullOrWhiteSpace(textToContain)) {
            return artists;
        }

        const filteredArtists: ArtistModel[] = [];

        for (const artist of artists) {
            if (this.searchService.matchesSearchText(artist.displayName, textToContain!)) {
                filteredArtists.push(artist);
            }
        }

        return filteredArtists;
    }
}
