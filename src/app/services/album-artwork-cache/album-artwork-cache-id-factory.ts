
import { AlbumArtworkCacheId } from './album-artwork-cache-id';

export class AlbumArtworkCacheIdFactory {
    public create(): AlbumArtworkCacheId {
        return new AlbumArtworkCacheId();
    }
}
