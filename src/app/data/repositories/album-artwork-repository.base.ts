import { AlbumArtwork } from '../entities/album-artwork';

export abstract class AlbumArtworkRepositoryBase {
    public abstract getNumberOfAlbumArtwork(): number;
    public abstract getNumberOfAlbumArtworkThatHasNoTrack(albumKeyIndex: string): number;
    public abstract deleteAlbumArtworkThatHasNoTrack(albumKeyIndex: string): number;
    public abstract addAlbumArtwork(albumArtwork: AlbumArtwork): void;
    public abstract getAllAlbumArtwork(): AlbumArtwork[] | undefined;
    public abstract getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(albumKeyIndex: string): number;
    public abstract deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(albumKeyIndex: string): number;
}
