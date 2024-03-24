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
            if (a.albumKey > b.albumKey) {
                return 1;
            }

            if (a.albumKey < b.albumKey) {
                return -1;
            }

            if (a.number > b.number) {
                return 1;
            }

            if (a.number < b.number) {
                return -1;
            }

            return 0;
        });
    }
}
