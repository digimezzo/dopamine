import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { AlbumModel } from '../services/album/album-model';

@Pipe({ name: 'albumsFilter' })
export class AlbumsFilterPipe implements PipeTransform {
    constructor() {}

    public transform(albums: AlbumModel[], filterTerm: string): AlbumModel[] {
        if (Strings.isNullOrWhiteSpace(filterTerm)) {
            return albums;
        }

        const filteredAlbums: AlbumModel[] = [];

        for (const album of albums) {
            if (album.albumTitle.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredAlbums.push(album);
            } else if (album.albumArtist.toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredAlbums.push(album);
            } else if (album.year.toString().toLowerCase().includes(filterTerm.toLowerCase())) {
                filteredAlbums.push(album);
            }
        }

        return filteredAlbums;
    }
}
