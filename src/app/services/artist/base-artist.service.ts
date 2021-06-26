import { ArtistModel } from './artist-model';

export abstract class BaseArtistService {
    public abstract getArtists(): ArtistModel[];
}
