import { AlbumArtwork } from '../entities/album-artwork';

export abstract class AlbumArtworkRepositoryBase {
    public abstract getNumberOfAlbumArtwork(): number;
    public abstract getNumberOfAlbumArtworkThatHasNoTrack(): number;
    public abstract deleteAlbumArtworkThatHasNoTrack(): number;
    public abstract addAlbumArtwork(albumArtwork: AlbumArtwork): void;
    public abstract getAllAlbumArtwork(): AlbumArtwork[] | undefined;
    public abstract getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(): number;
    public abstract deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(): number;
}
