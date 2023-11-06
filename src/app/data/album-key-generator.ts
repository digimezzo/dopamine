import { Injectable } from '@angular/core';
import { StringUtils } from '../common/utils/string-utils';
import { DataDelimiter } from './data-delimiter';

@Injectable()
export class AlbumKeyGenerator {
    public generateAlbumKey(albumTitle: string | undefined, albumArtists: string[] | undefined): string {
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
