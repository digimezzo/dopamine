import { StringUtils } from '../src/app/common/utils/string-utils';
import { DataDelimiter } from './data-delimiter';

export class AlbumKeyGenerator {
    public static generateAlbumKey(albumTitle: string | undefined, albumArtists: string[] | undefined): string {
        if (!StringUtils.isNullOrWhiteSpace(albumTitle)) {
            const albumKeyItems: string[] = [];
            albumKeyItems.push(albumTitle!);

            if (albumArtists != undefined && albumArtists.length > 0) {
                albumKeyItems.push(...albumArtists);
            }

            return DataDelimiter.toDelimitedString(albumKeyItems);
        }

        return '';
    }
}
