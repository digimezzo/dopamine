import { Injectable } from '@angular/core';
import { Strings } from '../common/strings';
import { DataDelimiter } from './data-delimiter';

@Injectable()
export class AlbumKeyGenerator {
    public generateAlbumKey(albumTitle: string | undefined, albumArtists: string[] | undefined): string {
        if (!Strings.isNullOrWhiteSpace(albumTitle)) {
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
