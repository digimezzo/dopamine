import { Pipe, PipeTransform } from '@angular/core';
import { StringUtils } from '../../common/utils/string-utils';
import { AlbumModel } from '../../services/album/album-model';
import { SearchServiceBase } from '../../services/search/search.service.base';

@Pipe({ name: 'albumsFilter' })
export class AlbumsFilterPipe implements PipeTransform {
    public constructor(private searchService: SearchServiceBase) {}

    public transform(albums: AlbumModel[], textToContain: string | undefined): AlbumModel[] {
        if (StringUtils.isNullOrWhiteSpace(textToContain)) {
            return albums;
        }

        const filteredAlbums: AlbumModel[] = [];

        for (const album of albums) {
            const textToSearch = [album.albumTitle, album.albumArtist, album.year.toString(), album.genres.join(' ')].join(' ');
            if (this.searchService.matchesSearchText(textToSearch, textToContain!)) {
                filteredAlbums.push(album);
            }
        }

        return filteredAlbums;
    }
}
