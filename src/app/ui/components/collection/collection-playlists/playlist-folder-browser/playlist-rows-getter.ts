import { Injectable } from '@angular/core';
import { ItemSpaceCalculator } from '../../item-space-calculator';
import { PlaylistRow } from '../playlist-browser/playlist-row';
import { PlaylistOrder } from '../playlist-order';
import { Constants } from '../../../../../common/application/constants';
import { PlaylistModel } from '../../../../../services/playlist/playlist-model';
import { PlaylistSorter } from '../../../../../common/sorting/playlist-sorter';

@Injectable()
export class PlaylistRowsGetter {
    public constructor(
        private playlistSorter: PlaylistSorter,
        private playlistSpaceCalculator: ItemSpaceCalculator,
    ) {}

    public getPlaylistRows(availableWidthInPixels: number, playlists: PlaylistModel[], playlistOrder: PlaylistOrder): PlaylistRow[] {
        const playlistRows: PlaylistRow[] = [];

        if (playlists == undefined) {
            return playlistRows;
        }

        if (playlists.length === 0) {
            return playlistRows;
        }

        const numberOfPlaylistsPerRow: number = this.playlistSpaceCalculator.calculateNumberOfItemsPerRow(
            Constants.albumSizeInPixels,
            availableWidthInPixels,
        );

        const sortedPlaylists: PlaylistModel[] = this.getSortedPlaylists(playlists, playlistOrder);

        for (const playlist of sortedPlaylists) {
            if (playlistRows.length === 0 || playlistRows[playlistRows.length - 1].playlists.length === numberOfPlaylistsPerRow) {
                playlistRows.push(new PlaylistRow());
            }

            playlistRows[playlistRows.length - 1].playlists.push(playlist);
        }

        return playlistRows;
    }

    private getSortedPlaylists(unsortedPlaylists: PlaylistModel[], playlistOrder: PlaylistOrder): PlaylistModel[] {
        let sortedPlaylists: PlaylistModel[] = [];

        switch (playlistOrder) {
            case PlaylistOrder.byPlaylistNameAscending:
                sortedPlaylists = unsortedPlaylists.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
                sortedPlaylists = this.playlistSorter.sortAscending(unsortedPlaylists);
                break;
            case PlaylistOrder.byPlaylistNameDescending:
                sortedPlaylists = this.playlistSorter.sortDescending(unsortedPlaylists);
                break;
            default: {
                sortedPlaylists = this.playlistSorter.sortAscending(unsortedPlaylists);
                break;
            }
        }

        return sortedPlaylists;
    }
}
