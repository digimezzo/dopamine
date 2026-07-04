import { ArtistArtworkCacheId } from './artist-artwork-cache-id';

export abstract class ArtistArtworkCacheServiceBase {
    public abstract addArtworkDataToCacheAsync(data: Buffer): Promise<ArtistArtworkCacheId | undefined>;
    public abstract removeArtworkDataFromCacheAsync(artistKey: string): Promise<void>;
}