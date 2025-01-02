import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorData } from '../../../../services/dialog/error-data';
import { TrackModel } from '../../../../services/track/track-model';
import { PromiseUtils } from '../../../../common/utils/promise-utils';

@Component({
    selector: 'app-edit-tracks-dialog',
    templateUrl: './edit-tracks-dialog.component.html',
    styleUrls: ['./edit-tracks-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EditTracksDialogComponent implements OnInit {
    private _tracks: TrackModel[];
    private _multipleValuesText: string = '<Multiple values>';

    public constructor(
        public dialogRef: MatDialogRef<EditTracksDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TrackModel[],
    ) {}

    public title: string = '';
    public artists: string = '';
    public albumTitle: string = '';
    public albumArtists: string = '';
    public year: string = '';
    public genres: string = '';
    public trackNumber: string = '';
    public trackCount: string = '';
    public discNumber: string = '';
    public discCount: string = '';
    public grouping: string = '';
    public comment: string = '';

    public ngOnInit(): void {
        this._tracks = this.data;
        this.setFields();

        this.dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
            if (result != undefined && result) {
                // Save tracks
                alert('Save tracks');
            }
        });
    }

    public exportImage(): void {}

    public changeImage(): void {}

    public downloadImage(): void {}

    public removeImage(): void {}

    private setFields(): void {
        if (this._tracks.length === 1) {
            this.title = this._tracks[0].title;
            this.artists = this._tracks[0].artists;
            this.albumTitle = this._tracks[0].albumTitle;
            this.albumArtists = this._tracks[0].albumArtists;
            this.year = this._tracks[0].year.toString();
            this.genres = this._tracks[0].genres;
            this.trackNumber = this._tracks[0].number.toString();
            this.trackCount = this._tracks[0].discCount.toString();
            this.discNumber = this._tracks[0].discNumber.toString();
            this.discCount = this._tracks[0].discCount.toString();
            // this.grouping = this._tracks[0].grouping;
            // this.comment = this._tracks[0].comment;
        } else {
            const allTitlesSame = this._tracks.every((track) => track.title === this._tracks[0].title);
            this.title = allTitlesSame ? this._tracks[0].title : this._multipleValuesText;

            const allArtistsSame = this._tracks.every((track) => track.artists === this._tracks[0].artists);
            this.artists = allArtistsSame ? this._tracks[0].artists : this._multipleValuesText;

            const allAlbumTitlesSame = this._tracks.every((track) => track.albumTitle === this._tracks[0].albumTitle);
            this.albumTitle = allAlbumTitlesSame ? this._tracks[0].albumTitle : this._multipleValuesText;

            const allAlbumArtistsSame = this._tracks.every((track) => track.albumArtists === this._tracks[0].albumArtists);
            this.albumArtists = allAlbumArtistsSame ? this._tracks[0].albumArtists : this._multipleValuesText;

            const allYearsSame = this._tracks.every((track) => track.year === this._tracks[0].year);
            this.year = allYearsSame ? this._tracks[0].year.toString() : this._multipleValuesText;

            const allGenresSame = this._tracks.every((track) => track.genres === this._tracks[0].genres);
            this.genres = allGenresSame ? this._tracks[0].genres : this._multipleValuesText;

            const allTrackNumbersSame = this._tracks.every((track) => track.number === this._tracks[0].number);
            this.trackNumber = allTrackNumbersSame ? this._tracks[0].number.toString() : this._multipleValuesText;

            const allTrackCountsSame = this._tracks.every((track) => track.discCount === this._tracks[0].discCount);
            this.trackCount = allTrackCountsSame ? this._tracks[0].discCount.toString() : this._multipleValuesText;

            const allDiscNumbersSame = this._tracks.every((track) => track.discNumber === this._tracks[0].discNumber);
            this.discNumber = allDiscNumbersSame ? this._tracks[0].discNumber.toString() : this._multipleValuesText;

            const allDiscCountsSame = this._tracks.every((track) => track.discCount === this._tracks[0].discCount);
            this.discCount = allDiscCountsSame ? this._tracks[0].discCount.toString() : this._multipleValuesText;

            // const allGroupingsSame = this._tracks.every((track) => track.grouping === this._tracks[0].grouping);
            // this.grouping = allGroupingsSame ? this._tracks[0].grouping : this._multipleValuesText;
            //
            // const allCommentsSame = this._tracks.every((track) => track.comment === this._tracks[0].comment);
            // this.comment = allCommentsSame ? this._tracks[0].comment : this._multipleValuesText;
        }
    }
}
