import { Injectable } from '@angular/core';
import { StringComparison } from '../core/string-comparison';
import { DataDelimiter } from './data-delimiter';

@Injectable({
    providedIn: 'root'
})
export class AlbumKeyGenerator {
    constructor(private dataDelimiter: DataDelimiter) {
    }

    public generateAlbumKey(albumTitle: string, albumArtists: string[]): string {
        if (!StringComparison.isNullOrWhiteSpace(albumTitle)) {
            const albumKeyItems: string[] = [];
            albumKeyItems.push(albumTitle);

            if (albumArtists !== null && albumArtists !== undefined && albumArtists.length > 0) {
                albumKeyItems.push(...albumArtists);
            }

            return this.dataDelimiter.convertToDelimitedString(albumKeyItems);
        }

        return '';
    }
}
