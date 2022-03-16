import { Injectable } from '@angular/core';
import { ArtistModel } from '../../services/artist/artist-model';

@Injectable()
export class ArtistOrdering {
    public getArtistsOrderedAscending(artistsToOrder: ArtistModel[]): ArtistModel[] {
        if (artistsToOrder == undefined) {
            return [];
        }

        return artistsToOrder.sort((a, b) => (a.sortableName > b.sortableName ? 1 : -1));
    }

    public getArtistsOrderedDescending(artistsToOrder: ArtistModel[]): ArtistModel[] {
        if (artistsToOrder == undefined) {
            return [];
        }

        return artistsToOrder.sort((a, b) => (a.sortableName < b.sortableName ? 1 : -1));
    }
}
