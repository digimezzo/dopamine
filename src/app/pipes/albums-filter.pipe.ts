import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { AlbumModel } from '../services/album/album-model';
import { BaseSearchService } from '../services/search/base-search.service';

@Pipe({ name: 'albumsFilter' })
export class AlbumsFilterPipe implements PipeTransform {
    constructor(private searchService: BaseSearchService) {}

    public transform(albums: AlbumModel[], textToContain: string): AlbumModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return albums;
        }

        const filteredAlbums: AlbumModel[] = [];

        for (const album of albums) {
            if (this.searchService.matchesSearchText(album.albumTitle, textToContain)) {
                filteredAlbums.push(album);
            } else if (this.searchService.matchesSearchText(album.albumArtist, textToContain)) {
                filteredAlbums.push(album);
            } else if (this.searchService.matchesSearchText(album.year.toString(), textToContain)) {
                filteredAlbums.push(album);
            }
        }

        return filteredAlbums;
    }
}
