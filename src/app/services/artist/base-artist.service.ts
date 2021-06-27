import { ArtistModel } from './artist-model';
import { ArtistType } from './artist-type';

export abstract class BaseArtistService {
    public abstract getArtists(artistType: ArtistType): ArtistModel[];
}
