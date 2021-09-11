import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { ArtistModel } from '../services/artist/artist-model';

@Pipe({ name: 'artistsFilter' })
export class ArtistFiltersPipe implements PipeTransform {
    constructor() {}

    public transform(artists: ArtistModel[], filterTerm: string): ArtistModel[] {
        if (Strings.isNullOrWhiteSpace(filterTerm)) {
            return artists;
        }

        const filteredArtists: ArtistModel[] = [];

        for (const artist of artists) {
            if (artist.displayName.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredArtists.push(artist);
            }
        }

        return filteredArtists;
    }
}
