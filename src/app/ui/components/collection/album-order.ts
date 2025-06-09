export enum AlbumOrder {
    byAlbumTitleAscending = 1,
    byAlbumTitleDescending = 2,
    byDateAdded = 3,
    byDateCreated = 4,
    byAlbumArtist = 5,
    byYearAscending = 6,
    byYearDescending = 7,
    byLastPlayed = 8,
    random = 9,
}

export function albumOrderKey(albumOrder: AlbumOrder): string {
    switch (albumOrder) {
        case AlbumOrder.byAlbumTitleAscending:
            return 'by-album-title-ascending';
        case AlbumOrder.byAlbumTitleDescending:
            return 'by-album-title-descending';
        case AlbumOrder.byDateAdded:
            return 'by-date-added';
        case AlbumOrder.byDateCreated:
            return 'by-date-created';
        case AlbumOrder.byAlbumArtist:
            return 'by-album-artist';
        case AlbumOrder.byYearAscending:
            return 'by-year-ascending';
        case AlbumOrder.byYearDescending:
            return 'by-year-descending';
        case AlbumOrder.byLastPlayed:
            return 'by-last-played';
        case AlbumOrder.random:
            return 'random';
    }
}
