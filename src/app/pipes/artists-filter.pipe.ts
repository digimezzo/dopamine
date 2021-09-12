import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { ArtistModel } from '../services/artist/artist-model';
import { BaseFilterPipe } from './base-filter.pipe';

@Pipe({ name: 'artistsFilter' })
export class ArtistFilterPipe extends BaseFilterPipe implements PipeTransform {
    constructor() {
        super();
    }

    public transform(artists: ArtistModel[], textToContain: string): ArtistModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return artists;
        }

        const filteredArtists: ArtistModel[] = [];

        for (const artist of artists) {
            if (this.containsText(artist.displayName, textToContain)) {
                filteredArtists.push(artist);
            }
        }

        return filteredArtists;
    }
}
