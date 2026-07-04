import { GuidFactory } from '../../common/guid.factory';

export class ArtistArtworkCacheId {
    public static readonly defaultArtworkId: string = 'artist-00000000-0000-0000-0000-000000000000';

    public constructor(guidFactory?: GuidFactory) {
        if (guidFactory === undefined) {
            this.id = ArtistArtworkCacheId.defaultArtworkId;
        } else {
            this.id = `artist-${guidFactory.create()}`;
        }
    }

    public readonly id: string;
}