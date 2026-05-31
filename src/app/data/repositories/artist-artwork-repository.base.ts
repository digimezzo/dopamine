import { ArtistArtwork } from '../entities/artist-artwork';

export abstract class ArtistArtworkRepositoryBase {
    public abstract getNumberOfArtistArtwork(): number;
    public abstract getNumberOfArtistArtworkThatHasNoTrack(): number;
    public abstract deleteArtistArtworkThatHasNoTrack(): number;
    public abstract addArtistArtwork(artistArtwork: ArtistArtwork): void;
    public abstract getAllArtistArtwork(): ArtistArtwork[] | undefined;
    public abstract getArtistArtworkForArtist(artist: string): ArtistArtwork | undefined;
    public abstract deleteArtistArtworkWithDefaultId(): number;
    public abstract deleteAllArtistArtwork(): number
}
