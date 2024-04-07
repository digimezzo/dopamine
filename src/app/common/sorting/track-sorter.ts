import { Injectable } from '@angular/core';
import { TrackModel } from '../../services/track/track-model';
import { Sorter } from './sorter';

@Injectable({ providedIn: 'root' })
export class TrackSorter {
    public sortByTitleAscending(tracks: TrackModel[]): TrackModel[] {
        return tracks.sort((a, b) => Sorter.naturalSort(a.sortableTitle, b.sortableTitle));
    }

    public sortByTitleDescending(tracks: TrackModel[]): TrackModel[] {
        return tracks.sort((a, b) => Sorter.naturalSort(b.sortableTitle, a.sortableTitle));
    }

    public sortByAlbum(tracks: TrackModel[]): TrackModel[] {
        return tracks.sort((a, b) => {
            let comparison = Sorter.naturalSort(a.albumKey, b.albumKey);
            if (comparison !== 0) {
                return comparison;
            }

            comparison = Sorter.naturalSort(a.discNumber.toString(), b.discNumber.toString());
            if (comparison !== 0) {
                return comparison;
            }

            return Sorter.naturalSort(a.number.toString(), b.number.toString());
        });
    }
}
