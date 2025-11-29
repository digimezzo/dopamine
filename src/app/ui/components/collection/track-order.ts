export enum TrackOrder {
    byTrackTitleAscending = 1,
    byTrackTitleDescending = 2,
    byAlbum = 3,
    byRating = 4,
    byFileNameAscending = 5,
    byFileNameDescending = 6,
    byDateCreatedAscending = 7,
    byDateCreatedDescending = 8,
    none = 9,
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
        case TrackOrder.byFileNameAscending:
            return 'by-file-name-ascending';
        case TrackOrder.byFileNameDescending:
            return 'by-file-name-descending';
        case TrackOrder.byDateCreatedAscending:
            return 'by-date-created-ascending';
        case TrackOrder.byDateCreatedDescending:
            return 'by-date-created-descending';
        case TrackOrder.none:
            return 'none';
    }
}
