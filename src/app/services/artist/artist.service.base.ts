import { ArtistModel } from './artist-model';
import { ArtistType } from './artist-type';

export abstract class ArtistServiceBase {
    public abstract getArtistsAsync(artistType: ArtistType): Promise<ArtistModel[]>;
    public abstract getSourceArtists(artists: ArtistModel[]): string[];
}
