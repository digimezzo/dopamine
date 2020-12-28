import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { Injectable } from "@angular/core";

@Injectable()
export class AlbumArtworkCacheIdFactory {
    public create(): AlbumArtworkCacheId {
        return new AlbumArtworkCacheId();
    }
}
