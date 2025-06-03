export enum PlaylistOrder {
    byPlaylistNameAscending = 1,
    byPlaylistNameDescending = 2,
}

export function playlistOrderKey(playlistOrder: PlaylistOrder): string {
    switch (playlistOrder) {
        case PlaylistOrder.byPlaylistNameAscending:
            return 'by-playlist-name-ascending';
        case PlaylistOrder.byPlaylistNameDescending:
            return 'by-playlist-name-descending';
    }
}
