import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { ArtistModel } from '../services/artist/artist-model';
import {SearchServiceBase} from "../services/search/search.service.base";

@Pipe({ name: 'artistsFilter' })
export class ArtistFilterPipe implements PipeTransform {
    public constructor(private searchService: SearchServiceBase) {}

    public transform(artists: ArtistModel[], textToContain: string | undefined): ArtistModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
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
