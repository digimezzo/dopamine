import { Injectable } from '@angular/core';
import { DataDelimiter } from './data-delimiter';

@Injectable({
    providedIn: 'root'
})
export class AlbumKeyGenerator {
    constructor(private dataDelimiter: DataDelimiter) {
    }

    public generateAlbumKey(albumTitle: string, albumArtists: string[]): string {
        if (albumTitle && albumTitle.trim() !== '') {
            const albumKeyItems: string[] = [];
            albumKeyItems.push(albumTitle);

            if (albumArtists && albumArtists.length > 0) {
                albumKeyItems.push(...albumArtists);
            }

            return this.dataDelimiter.convertToDelimitedString(albumKeyItems);
        }

        return '';
    }
}
