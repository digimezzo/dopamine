import { Injectable } from '@angular/core';
import { StringCompare } from '../core/string-compare';
import { DataDelimiter } from './data-delimiter';

@Injectable()
export class AlbumKeyGenerator {
    constructor() {}

    public generateAlbumKey(albumTitle: string, albumArtists: string[]): string {
        if (!StringCompare.isNullOrWhiteSpace(albumTitle)) {
            const albumKeyItems: string[] = [];
            albumKeyItems.push(albumTitle);

            if (albumArtists != undefined && albumArtists.length > 0) {
                albumKeyItems.push(...albumArtists);
            }

            return DataDelimiter.toDelimitedString(albumKeyItems);
        }

        return '';
    }
}
