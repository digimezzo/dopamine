import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseTracksColumnsService } from './base-tracks-columns.service';
import { TracksColumnsOrder } from './tracks-columns-order';
import { TracksColumnsOrderColumn } from './tracks-columns-order-column';
import { TracksColumnsOrderDirection } from './tracks-columns-order-direction';
import { TracksColumnsVisibility } from './tracks-columns-visibility';

@Injectable()
export class TracksColumnsService implements BaseTracksColumnsService {
    private trackTitleSettingsString: string = 'trackTitle';
    private ratingSettingsString: string = 'rating';
    private artistsSettingsString: string = 'artists';
    private albumSettingsString: string = 'album';
    private genresSettingsString: string = 'genres';
    private durationSettingsString: string = 'duration';
    private trackNumberSettingsString: string = 'trackNumber';
    private yearSettingsString: string = 'year';
    private playCountSettingsString: string = 'playCount';
    private skipCountSettingsString: string = 'skipCount';
    private dateLastPlayedSettingsString: string = 'dateLastPlayed';
    private dateAddedPlayedSettingsString: string = 'dateAdded';

    private ascendingSettingsString: string = 'ascending';
    private descendingSettingsString: string = 'descending';

    private tracksColumnsVisibilityChanged: Subject<TracksColumnsVisibility> = new Subject<TracksColumnsVisibility>();
    private tracksColumnsOrderChanged: Subject<TracksColumnsOrder> = new Subject<TracksColumnsOrder>();

    public constructor(private settings: BaseSettings) {}

    public tracksColumnsVisibilityChanged$: Observable<TracksColumnsVisibility> = this.tracksColumnsVisibilityChanged.asObservable();
    public tracksColumnsOrderChanged$: Observable<TracksColumnsOrder> = this.tracksColumnsOrderChanged.asObservable();

    public getTracksColumnsVisibility(): TracksColumnsVisibility {
        const tracksPageVisibleColumnsFromSettings: string = this.settings.tracksPageVisibleColumns;
        const tracksPageVisibleColumns: string[] = tracksPageVisibleColumnsFromSettings.split(';');

        const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

        if (tracksPageVisibleColumns.length > 0) {
            for (const tracksPageVisibleColumn of tracksPageVisibleColumns) {
                switch (tracksPageVisibleColumn) {
                    case this.ratingSettingsString:
                        tracksColumnsVisibility.showRating = true;
                        break;
                    case this.artistsSettingsString:
                        tracksColumnsVisibility.showArtists = true;
                        break;
                    case this.albumSettingsString:
                        tracksColumnsVisibility.showAlbum = true;
                        break;
                    case this.genresSettingsString:
                        tracksColumnsVisibility.showGenres = true;
                        break;
                    case this.durationSettingsString:
                        tracksColumnsVisibility.showDuration = true;
                        break;
                    case this.trackNumberSettingsString:
                        tracksColumnsVisibility.showTrackNumber = true;
                        break;
                    case this.yearSettingsString:
                        tracksColumnsVisibility.showYear = true;
                        break;
                    case this.playCountSettingsString:
                        tracksColumnsVisibility.showPlayCount = true;
                        break;
                    case this.skipCountSettingsString:
                        tracksColumnsVisibility.showSkipCount = true;
                        break;
                    case this.dateLastPlayedSettingsString:
                        tracksColumnsVisibility.showDateLastPlayed = true;
                        break;
                    case this.dateAddedPlayedSettingsString:
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
            tracksPageVisibleColumns.push(this.ratingSettingsString);
        }

        if (tracksColumnsVisibility.showArtists) {
            tracksPageVisibleColumns.push(this.artistsSettingsString);
        }

        if (tracksColumnsVisibility.showAlbum) {
            tracksPageVisibleColumns.push(this.albumSettingsString);
        }

        if (tracksColumnsVisibility.showGenres) {
            tracksPageVisibleColumns.push(this.genresSettingsString);
        }

        if (tracksColumnsVisibility.showDuration) {
            tracksPageVisibleColumns.push(this.durationSettingsString);
        }

        if (tracksColumnsVisibility.showTrackNumber) {
            tracksPageVisibleColumns.push(this.trackNumberSettingsString);
        }

        if (tracksColumnsVisibility.showYear) {
            tracksPageVisibleColumns.push(this.yearSettingsString);
        }

        if (tracksColumnsVisibility.showPlayCount) {
            tracksPageVisibleColumns.push(this.playCountSettingsString);
        }

        if (tracksColumnsVisibility.showSkipCount) {
            tracksPageVisibleColumns.push(this.skipCountSettingsString);
        }

        if (tracksColumnsVisibility.showDateLastPlayed) {
            tracksPageVisibleColumns.push(this.dateLastPlayedSettingsString);
        }

        if (tracksColumnsVisibility.showDateAdded) {
            tracksPageVisibleColumns.push(this.dateAddedPlayedSettingsString);
        }

        const tracksPageVisibleColumnsForSettings: string = tracksPageVisibleColumns.join(';');
        this.settings.tracksPageVisibleColumns = tracksPageVisibleColumnsForSettings;

        this.tracksColumnsVisibilityChanged.next(tracksColumnsVisibility);
    }

    public getTracksColumnsOrder(): TracksColumnsOrder {
        const tracksColumnsOrderFromSettings: string = this.settings.tracksPageColumnsOrder;
        const tracksColumnsOrderFromSettingsParts: string[] = tracksColumnsOrderFromSettings.split(';');

        const tracksColumnsOrder: TracksColumnsOrder = new TracksColumnsOrder(
            TracksColumnsOrderColumn.none,
            TracksColumnsOrderDirection.ascending
        );

        if (tracksColumnsOrderFromSettingsParts.length > 1) {
            switch (tracksColumnsOrderFromSettingsParts[0]) {
                case this.trackTitleSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.trackTitle;
                    break;
                case this.ratingSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.rating;
                    break;
                case this.artistsSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.artists;
                    break;
                case this.albumSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.album;
                    break;
                case this.genresSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.genres;
                    break;
                case this.durationSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.duration;
                    break;
                case this.trackNumberSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.trackNumber;
                    break;
                case this.yearSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.year;
                    break;
                case this.playCountSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.playCount;
                    break;
                case this.skipCountSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.skipCount;
                    break;
                case this.dateLastPlayedSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.dateLastPlayed;
                    break;
                case this.dateAddedPlayedSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.dateAdded;
                    break;
                default: {
                    tracksColumnsOrder.tracksColumnsOrderColumn = TracksColumnsOrderColumn.none;
                    break;
                }
            }

            switch (tracksColumnsOrderFromSettingsParts[1]) {
                case this.ascendingSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderDirection = TracksColumnsOrderDirection.ascending;
                    break;
                case this.descendingSettingsString:
                    tracksColumnsOrder.tracksColumnsOrderDirection = TracksColumnsOrderDirection.descending;
                    break;
                default: {
                    tracksColumnsOrder.tracksColumnsOrderDirection = TracksColumnsOrderDirection.ascending;
                    break;
                }
            }
        }

        return tracksColumnsOrder;
    }

    public setTracksColumnsOrder(tracksColumnsOrderColumn: TracksColumnsOrderColumn): void {
        const currentTracksColumnsOrder: TracksColumnsOrder = this.getTracksColumnsOrder();
        const newTracksColumnsOrder: TracksColumnsOrder = new TracksColumnsOrder(
            tracksColumnsOrderColumn,
            TracksColumnsOrderDirection.ascending
        );

        if (currentTracksColumnsOrder.tracksColumnsOrderDirection === TracksColumnsOrderDirection.ascending) {
            newTracksColumnsOrder.tracksColumnsOrderDirection = TracksColumnsOrderDirection.descending;
        }

        const tracksPageColumnsOrderForSettingsParts: string[] = [];

        switch (newTracksColumnsOrder.tracksColumnsOrderColumn) {
            case TracksColumnsOrderColumn.trackTitle:
                tracksPageColumnsOrderForSettingsParts.push(this.trackTitleSettingsString);
                break;
            case TracksColumnsOrderColumn.rating:
                tracksPageColumnsOrderForSettingsParts.push(this.ratingSettingsString);
                break;
            case TracksColumnsOrderColumn.artists:
                tracksPageColumnsOrderForSettingsParts.push(this.artistsSettingsString);
                break;
            case TracksColumnsOrderColumn.album:
                tracksPageColumnsOrderForSettingsParts.push(this.albumSettingsString);
                break;
            case TracksColumnsOrderColumn.genres:
                tracksPageColumnsOrderForSettingsParts.push(this.genresSettingsString);
                break;
            case TracksColumnsOrderColumn.duration:
                tracksPageColumnsOrderForSettingsParts.push(this.durationSettingsString);
                break;
            case TracksColumnsOrderColumn.trackNumber:
                tracksPageColumnsOrderForSettingsParts.push(this.trackNumberSettingsString);
                break;
            case TracksColumnsOrderColumn.year:
                tracksPageColumnsOrderForSettingsParts.push(this.yearSettingsString);
                break;
            case TracksColumnsOrderColumn.playCount:
                tracksPageColumnsOrderForSettingsParts.push(this.playCountSettingsString);
                break;
            case TracksColumnsOrderColumn.skipCount:
                tracksPageColumnsOrderForSettingsParts.push(this.skipCountSettingsString);
                break;
            case TracksColumnsOrderColumn.dateLastPlayed:
                tracksPageColumnsOrderForSettingsParts.push(this.dateLastPlayedSettingsString);
                break;
            case TracksColumnsOrderColumn.dateAdded:
                tracksPageColumnsOrderForSettingsParts.push(this.dateAddedPlayedSettingsString);
                break;
            default: {
                tracksPageColumnsOrderForSettingsParts.push(this.trackTitleSettingsString);
                break;
            }
        }

        switch (newTracksColumnsOrder.tracksColumnsOrderDirection) {
            case TracksColumnsOrderDirection.ascending:
                tracksPageColumnsOrderForSettingsParts.push(this.ascendingSettingsString);
                break;
            case TracksColumnsOrderDirection.descending:
                tracksPageColumnsOrderForSettingsParts.push(this.descendingSettingsString);
                break;
            default: {
                tracksPageColumnsOrderForSettingsParts.push(this.ascendingSettingsString);
                break;
            }
        }

        const tracksPageColumnsOrderForSettings: string = tracksPageColumnsOrderForSettingsParts.join(';');
        this.settings.tracksPageColumnsOrder = tracksPageColumnsOrderForSettings;

        this.tracksColumnsOrderChanged.next(newTracksColumnsOrder);
    }
}
