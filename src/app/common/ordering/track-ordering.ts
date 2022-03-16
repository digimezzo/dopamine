import { Injectable } from '@angular/core';
import { TrackModel } from '../../services/track/track-model';

@Injectable()
export class TrackOrdering {
    public getTracksOrderedByTitleAscending(tracksToOrder: TrackModel[]): TrackModel[] {
        return tracksToOrder.sort((a, b) => (a.sortableTitle > b.sortableTitle ? 1 : -1));
    }

    public getTracksOrderedByTitleDescending(tracksToOrder: TrackModel[]): TrackModel[] {
        return tracksToOrder.sort((a, b) => (a.sortableTitle < b.sortableTitle ? 1 : -1));
    }

    public getTracksOrderedByAlbum(tracksToOrder: TrackModel[]): TrackModel[] {
        return tracksToOrder.sort((a, b) => {
            if (a.sortableAlbumArtists > b.sortableAlbumArtists) {
                return 1;
            } else if (a.sortableAlbumArtists < b.sortableAlbumArtists) {
                return -1;
            }

            if (a.sortableAlbumTitle > b.sortableAlbumTitle) {
                return 1;
            } else if (a.sortableAlbumTitle < b.sortableAlbumTitle) {
                return -1;
            }

            if (a.discNumber > b.discNumber) {
                return 1;
            } else if (a.discNumber < b.discNumber) {
                return -1;
            }

            if (a.number > b.number) {
                return 1;
            } else if (a.number < b.number) {
                return -1;
            } else {
                return 0;
            }
        });
    }
}
