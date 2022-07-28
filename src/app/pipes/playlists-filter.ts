import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { PlaylistModel } from '../services/playlist/playlist-model';
import { BaseSearchService } from '../services/search/base-search.service';

@Pipe({ name: 'playlistsFilter' })
export class PlaylistsFilterPipe implements PipeTransform {
    constructor(private searchService: BaseSearchService) {}

    public transform(playlists: PlaylistModel[], textToContain: string): PlaylistModel[] {
        if (Strings.isNullOrWhiteSpace(textToContain)) {
            return playlists;
        }

        const filteredPlaylists: PlaylistModel[] = [];

        for (const playlist of playlists) {
            if (this.searchService.matchesSearchText(playlist.name, textToContain)) {
                filteredPlaylists.push(playlist);
            }
        }

        return filteredPlaylists;
    }
}
