import { Injectable } from '@angular/core';
import { GuidFactory } from '../../common/guid.factory';
import { ArtistArtworkCacheId } from './artist-artwork-cache-id';

@Injectable({ providedIn: 'root' })
export class ArtistArtworkCacheIdFactory {
    public constructor(private guidFactory: GuidFactory) {}

    public create(): ArtistArtworkCacheId {
        return new ArtistArtworkCacheId(this.guidFactory);
    }

    public createDefault(): ArtistArtworkCacheId {
        return new ArtistArtworkCacheId();
    }
}
