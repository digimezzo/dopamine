import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../../common/strings';
import { SearchServiceBase } from '../../services/search/search.service.base';
import { PlaylistModel } from '../../services/playlist/playlist-model';

@Pipe({ name: 'playlistsFilter' })
export class PlaylistsFilterPipe implements PipeTransform {
    public constructor(private searchService: SearchServiceBase) {}

    public transform(playlists: PlaylistModel[], textToContain: string | undefined): PlaylistModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return playlists;
        }

        const filteredPlaylists: PlaylistModel[] = [];

        for (const playlist of playlists) {
            if (this.searchService.matchesSearchText(playlist.name, textToContain!)) {
                filteredPlaylists.push(playlist);
            }
        }

        return filteredPlaylists;
    }
}
