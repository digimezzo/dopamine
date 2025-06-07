export enum ArtistOrder {
    byArtistAscending = 1,
    byArtistDescending = 2,
}

export function artistOrderKey(artistOrder: ArtistOrder): string {
    switch (artistOrder) {
        case ArtistOrder.byArtistAscending:
            return 'by-artist-ascending';
        case ArtistOrder.byArtistDescending:
            return 'by-artist-descending';
    }
}
