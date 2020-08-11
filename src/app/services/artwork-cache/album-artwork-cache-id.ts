
import { v4 as uuidv4 } from 'uuid';

export class AlbumArtworkCacheId {
    private constructor(public readonly id: string) {
    }

    public static createNew(): AlbumArtworkCacheId {
        const id: string = `album-${uuidv4()}`;

        return new AlbumArtworkCacheId(id);
    }
}
