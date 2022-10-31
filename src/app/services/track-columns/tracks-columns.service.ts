import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseTracksColumnsService } from './base-tracks-columns.service';
import { TracksColumnsOrder } from './track-columns-order';
import { TracksColumnsVisibility } from './track-columns-visibility';

@Injectable()
export class TracksColumnsService implements BaseTracksColumnsService {
    private tracksColumnsVisibilityChanged: Subject<TracksColumnsVisibility> = new Subject<TracksColumnsVisibility>();

    public constructor(private settings: BaseSettings) {}

    public tracksColumnsVisibilityChanged$: Observable<TracksColumnsVisibility> = this.tracksColumnsVisibilityChanged.asObservable();

    public getTracksColumnsVisibility(): TracksColumnsVisibility {
        const tracksPageVisibleColumnsAsString: string = this.settings.tracksPageVisibleColumns;
        const tracksPageVisibleColumns: string[] = tracksPageVisibleColumnsAsString.split(';');

        const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

        if (tracksPageVisibleColumns.length > 0) {
            for (const tracksPageVisibleColumn of tracksPageVisibleColumns) {
                switch (tracksPageVisibleColumn) {
                    case 'rating':
                        tracksColumnsVisibility.showRating = true;
                        break;
                    case 'artists':
                        tracksColumnsVisibility.showArtists = true;
                        break;
                    case 'album':
                        tracksColumnsVisibility.showAlbum = true;
                        break;
                    case 'genres':
                        tracksColumnsVisibility.showGenres = true;
                        break;
                    case 'duration':
                        tracksColumnsVisibility.showDuration = true;
                        break;
                    case 'number':
                        tracksColumnsVisibility.showTrackNumber = true;
                        break;
                    case 'year':
                        tracksColumnsVisibility.showYear = true;
                        break;
                    case 'playCount':
                        tracksColumnsVisibility.showPlayCount = true;
                        break;
                    case 'skipCount':
                        tracksColumnsVisibility.showSkipCount = true;
                        break;
                    case 'dateLastPlayed':
                        tracksColumnsVisibility.showDateLastPlayed = true;
                        break;
                    case 'dateAdded':
                        tracksColumnsVisibility.showDateAdded = true;
                        break;
                }
            }
        }

        return tracksColumnsVisibility;
    }

    public setTracksColumnsVisibility(tracksColumnsVisibility: TracksColumnsVisibility): void {
        const tracksPageVisibleColumns: string[] = [];

        if (tracksColumnsVisibility.showRating) {
            tracksPageVisibleColumns.push('rating');
        }

        if (tracksColumnsVisibility.showArtists) {
            tracksPageVisibleColumns.push('artists');
        }

        if (tracksColumnsVisibility.showAlbum) {
            tracksPageVisibleColumns.push('album');
        }

        if (tracksColumnsVisibility.showGenres) {
            tracksPageVisibleColumns.push('genres');
        }

        if (tracksColumnsVisibility.showDuration) {
            tracksPageVisibleColumns.push('duration');
        }

        if (tracksColumnsVisibility.showTrackNumber) {
            tracksPageVisibleColumns.push('number');
        }

        if (tracksColumnsVisibility.showYear) {
            tracksPageVisibleColumns.push('year');
        }

        if (tracksColumnsVisibility.showPlayCount) {
            tracksPageVisibleColumns.push('playCount');
        }

        if (tracksColumnsVisibility.showSkipCount) {
            tracksPageVisibleColumns.push('skipCount');
        }

        if (tracksColumnsVisibility.showDateLastPlayed) {
            tracksPageVisibleColumns.push('dateLastPlayed');
        }

        if (tracksColumnsVisibility.showDateAdded) {
            tracksPageVisibleColumns.push('dateAdded');
        }

        const tracksPageVisibleColumnsAsString: string = tracksPageVisibleColumns.join(';');
        this.settings.tracksPageVisibleColumns = tracksPageVisibleColumnsAsString;

        this.tracksColumnsVisibilityChanged.next(tracksColumnsVisibility);
    }

    public setTracksColumnsOrder(tracksColumnsOrder: TracksColumnsOrder): void {}
}