import { Injectable } from '@angular/core';
import { TrackOrder } from '../../components/collection/track-order';
import { TrackModel } from '../../services/track/track-model';
import { TrackModels } from '../../services/track/track-models';

@Injectable()
export class TrackOrdering {
    public getTracksOrderedBy(order: TrackOrder, container: TrackModels): TrackModels {
        let tracks: TrackModel[];

        switch(order) {
            case TrackOrder.byTrackTitleAscending:
                tracks = this.getTracksOrderedByTitleAscending(container.tracks);
                break;
                
            case TrackOrder.byTrackTitleDescending:
                tracks = this.getTracksOrderedByTitleDescending(container.tracks);
                break;

            case TrackOrder.byDateCreatedAsc:
            case TrackOrder.byDateCreatedDesc:
                tracks = this.getTracksOrderedByDateCreated(container.tracks, order === TrackOrder.byDateCreatedDesc);
                break;

            case TrackOrder.byFileNameAsc:
            case TrackOrder.byFileNameDesc:
                tracks = this.getTracksOrderedByFileName(container.tracks, order === TrackOrder.byFileNameDesc);
                break;

            case TrackOrder.byAlbum:
                tracks = this.getTracksOrderedByAlbum(container.tracks);
                break;

            default:
                return container;
        }

        const newContainer: TrackModels = new TrackModels();

        for (const t of tracks) {
            newContainer.addTrack(t);
        }

        return newContainer;
    }

    public getTracksOrderedByTitleAscending(tracksToOrder: TrackModel[]): TrackModel[] {
        return tracksToOrder.sort((a, b) => (a.sortableTitle > b.sortableTitle ? 1 : -1));
    }

    public getTracksOrderedByTitleDescending(tracksToOrder: TrackModel[]): TrackModel[] {
        return tracksToOrder.sort((a, b) => (a.sortableTitle < b.sortableTitle ? 1 : -1));
    }

    public getTracksOrderedByDateCreated(tracksToOrder: TrackModel[], descending: boolean): TrackModel[] {
        return tracksToOrder.sort((a, b) => {
            return a.dateCreated === b.dateCreated
                ? (a.sortableTitle > b.sortableTitle ? 1 : -1)
                : descending
                    ? (a.dateCreated < b.dateCreated ? 1 : -1)
                    : (a.dateCreated > b.dateCreated ? 1 : -1);
        });
    }

    public getTracksOrderedByFileName(tracksToOrder: TrackModel[], descending: boolean): TrackModel[] {
        return tracksToOrder.sort((a, b) => {
            return descending
                ? (a.fileName < b.fileName ? 1 : -1)
                : (a.fileName > b.fileName ? 1 : -1);
        });
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
