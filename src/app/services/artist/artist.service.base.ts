import { ArtistModel } from './artist-model';
import { ArtistType } from './artist-type';

export abstract class ArtistServiceBase {
    public abstract getArtists(artistType: ArtistType): ArtistModel[];
    public abstract getSourceArtists(artists: ArtistModel[]): string[];
}
