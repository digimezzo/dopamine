import { Component, OnInit } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';

@Component({
    selector: 'app-edit-columns-dialog',
    templateUrl: './edit-columns-dialog.component.html',
    styleUrls: ['./edit-columns-dialog.component.scss'],
})
export class EditColumnsDialogComponent implements OnInit {
    constructor(private settings: BaseSettings) {}

    public showRating: boolean;
    public showArtists: boolean;
    public showAlbum: boolean;
    public showGenres: boolean;
    public showDuration: boolean;
    public showNumber: boolean;
    public showYear: boolean;
    public showPlays: boolean;
    public showSkips: boolean;
    public showLastPlayed: boolean;
    public showDateAdded: boolean;

    public ngOnInit(): void {
        this.loadFromSettings();
    }

    private loadFromSettings(): void {
        const tracksPageVisibleColumnsAsString: string = this.settings.tracksPageVisibleColumns;
        const tracksPageVisibleColumns: string[] = tracksPageVisibleColumnsAsString.split(';');

        if (tracksPageVisibleColumns.length > 0) {
            for (const tracksPageVisibleColumn of tracksPageVisibleColumns) {
                switch (tracksPageVisibleColumn) {
                    case 'rating':
                        this.showRating = true;
                        break;
                    case 'artists':
                        this.showArtists = true;
                        break;
                    case 'album':
                        this.showAlbum = true;
                        break;
                    case 'genres':
                        this.showGenres = true;
                        break;
                    case 'duration':
                        this.showDuration = true;
                        break;
                    case 'number':
                        this.showNumber = true;
                        break;
                    case 'year':
                        this.showYear = true;
                        break;
                    case 'plays':
                        this.showPlays = true;
                        break;
                    case 'skips':
                        this.showSkips = true;
                        break;
                    case 'lastPlayed':
                        this.showLastPlayed = true;
                        break;
                    case 'dateAdded':
                        this.showDateAdded = true;
                        break;
                }
            }
        }
    }

    public saveToSettings(): void {}
}
