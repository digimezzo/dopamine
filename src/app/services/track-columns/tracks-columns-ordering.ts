import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { TracksColumnsOrderDirection } from './tracks-columns-order-direction';

@Injectable()
export class TracksColumnsOrdering {
    public getTracksOrderedByTitle(tracksToOrder: TrackModel[], tracksColumnsOrderDirection: TracksColumnsOrderDirection): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.sortableTitle > b.sortableTitle ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.sortableTitle < b.sortableTitle ? 1 : -1));
        }
    }

    public getTracksOrderedByRating(tracksToOrder: TrackModel[], tracksColumnsOrderDirection: TracksColumnsOrderDirection): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.rating > b.rating ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.rating < b.rating ? 1 : -1));
        }
    }

    public getTracksOrderedByArtists(tracksToOrder: TrackModel[], tracksColumnsOrderDirection: TracksColumnsOrderDirection): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.sortableArtists > b.sortableArtists ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.sortableArtists < b.sortableArtists ? 1 : -1));
        }
    }

    public getTracksOrderedByAlbum(tracksToOrder: TrackModel[], tracksColumnsOrderDirection: TracksColumnsOrderDirection): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.sortableAlbumTitle > b.sortableAlbumTitle ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.sortableAlbumTitle < b.sortableAlbumTitle ? 1 : -1));
        }
    }

    public getTracksOrderedByGenres(tracksToOrder: TrackModel[], tracksColumnsOrderDirection: TracksColumnsOrderDirection): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.sortableGenres > b.sortableGenres ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.sortableGenres < b.sortableGenres ? 1 : -1));
        }
    }

    public getTracksOrderedByDuration(tracksToOrder: TrackModel[], tracksColumnsOrderDirection: TracksColumnsOrderDirection): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.durationInMilliseconds > b.durationInMilliseconds ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.durationInMilliseconds < b.durationInMilliseconds ? 1 : -1));
        }
    }

    public getTracksOrderedByTrackNumber(
        tracksToOrder: TrackModel[],
        tracksColumnsOrderDirection: TracksColumnsOrderDirection
    ): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.number > b.number ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.number < b.number ? 1 : -1));
        }
    }

    public getTracksOrderedByYear(tracksToOrder: TrackModel[], tracksColumnsOrderDirection: TracksColumnsOrderDirection): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.year > b.year ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.year < b.year ? 1 : -1));
        }
    }

    public getTracksOrderedByPlayCount(
        tracksToOrder: TrackModel[],
        tracksColumnsOrderDirection: TracksColumnsOrderDirection
    ): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.playCount > b.playCount ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.playCount < b.playCount ? 1 : -1));
        }
    }

    public getTracksOrderedBySkipCount(
        tracksToOrder: TrackModel[],
        tracksColumnsOrderDirection: TracksColumnsOrderDirection
    ): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.skipCount > b.skipCount ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.skipCount < b.skipCount ? 1 : -1));
        }
    }

    public getTracksOrderedByDateLastPlayed(
        tracksToOrder: TrackModel[],
        tracksColumnsOrderDirection: TracksColumnsOrderDirection
    ): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.dateLastPlayed > b.dateLastPlayed ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.dateLastPlayed < b.dateLastPlayed ? 1 : -1));
        }
    }

    public getTracksOrderedByDateAdded(
        tracksToOrder: TrackModel[],
        tracksColumnsOrderDirection: TracksColumnsOrderDirection
    ): TrackModel[] {
        if (tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            return tracksToOrder.sort((a, b) => (a.dateAdded > b.dateAdded ? 1 : -1));
        } else {
            return tracksToOrder.sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : -1));
        }
    }
}
