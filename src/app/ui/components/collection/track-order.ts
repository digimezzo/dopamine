export enum TrackOrder {
    byTrackTitleAscending = 1,
    byTrackTitleDescending = 2,
    byAlbum = 3,
    byRating = 4,
    byDateCreatedAscending = 5,
    byDateCreatedDescending = 6,
    none = 7,
    byFileNameAscending = 8,
    byFileNameDescending = 9,
}

export function trackOrderKey(trackOrder: TrackOrder): string {
    switch (trackOrder) {
        case TrackOrder.byTrackTitleAscending:
            return 'by-track-title-ascending';
        case TrackOrder.byTrackTitleDescending:
            return 'by-track-title-descending';
        case TrackOrder.byAlbum:
            return 'by-album';
        case TrackOrder.byRating:
            return 'by-rating';
        case TrackOrder.byDateCreatedAscending:
            return 'oldest-first';
        case TrackOrder.byDateCreatedDescending:
            return 'newest-first';
        case TrackOrder.byFileNameAscending:
            return 'by-file-name-ascending';
        case TrackOrder.byFileNameDescending:
            return 'by-file-name-descending';
        case TrackOrder.none:
            return 'none';
    }
}
