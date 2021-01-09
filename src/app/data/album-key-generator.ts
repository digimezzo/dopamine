import { Injectable } from '@angular/core';
import { StringCompare } from '../core/string-compare';
import { DataDelimiter } from './data-delimiter';

@Injectable({
    providedIn: 'root',
})
export class AlbumKeyGenerator {
    constructor(private dataDelimiter: DataDelimiter) {}

    public generateAlbumKey(albumTitle: string, albumArtists: string[]): string {
        if (!StringCompare.isNullOrWhiteSpace(albumTitle)) {
            const albumKeyItems: string[] = [];
            albumKeyItems.push(albumTitle);

            if (albumArtists != undefined && albumArtists.length > 0) {
                albumKeyItems.push(...albumArtists);
            }

            return this.dataDelimiter.convertToDelimitedString(albumKeyItems);
        }

        return '';
    }
}
