import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { AlbumModel } from '../services/album/album-model';
import { BaseFilterPipe } from './base-filter.pipe';

@Pipe({ name: 'albumsFilter' })
export class AlbumsFilterPipe extends BaseFilterPipe implements PipeTransform {
    constructor() {
        super();
    }

    public transform(albums: AlbumModel[], textToContain: string): AlbumModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return albums;
        }

        const filteredAlbums: AlbumModel[] = [];

        for (const album of albums) {
            if (this.containsText(album.albumTitle, textToContain)) {
                filteredAlbums.push(album);
            } else if (this.containsText(album.albumArtist, textToContain)) {
                filteredAlbums.push(album);
            } else if (this.containsText(album.year.toString(), textToContain)) {
                filteredAlbums.push(album);
            }
        }

        return filteredAlbums;
    }
}
