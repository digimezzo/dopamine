import { Injectable } from '@angular/core';
import { PlaylistModel } from '../../services/playlist/playlist-model';
import { Sorter } from './sorter';

@Injectable({ providedIn: 'root' })
export class PlaylistSorter {
    public sortAscending(playlists: PlaylistModel[] | undefined): PlaylistModel[] {
        if (playlists == undefined) {
            return [];
        }

        return playlists.sort((a, b) => Sorter.naturalSort(a.name.toLowerCase(), b.name.toLowerCase()));
    }

    public sortDescending(playlists: PlaylistModel[] | undefined): PlaylistModel[] {
        if (playlists == undefined) {
            return [];
        }

        return playlists.sort((a, b) => Sorter.naturalSort(b.name.toLowerCase(), a.name.toLowerCase()));
    }
}
