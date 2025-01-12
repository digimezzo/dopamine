import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorData } from '../../../../services/dialog/error-data';
import { TrackModel } from '../../../../services/track/track-model';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { IFileMetadata } from '../../../../common/metadata/i-file-metadata';
import { FileMetadataFactoryBase } from '../../../../common/metadata/file-metadata.factory.base';
import { CollectionUtils } from '../../../../common/utils/collections-utils';
import { Logger } from '../../../../common/logger';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { MetadataService } from '../../../../services/metadata/metadata.service';
import { GenreOrder } from '../../collection/collection-genres/genre-browser/genre-order';
import { ImageComparisonStatus } from '../../../../services/metadata/image-comparison-status';

@Component({
    selector: 'app-edit-tracks-dialog',
    templateUrl: './edit-tracks-dialog.component.html',
    styleUrls: ['./edit-tracks-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EditTracksDialogComponent implements OnInit {
    private _tracks: TrackModel[];
    private _fileMetaDatas: IFileMetadata[] = [];
    private _multipleValuesText: string = '';

    public constructor(
        private dialogService: DialogServiceBase,
        private translatorService: TranslatorServiceBase,
        private metadataService: MetadataService,
        private fileMetadataFactory: FileMetadataFactoryBase,
        private logger: Logger,
        public dialogRef: MatDialogRef<EditTracksDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TrackModel[],
    ) {}

    public imageComparisonStatus: ImageComparisonStatus = ImageComparisonStatus.None;
    public imageComparisonStatusEnum: typeof ImageComparisonStatus = ImageComparisonStatus;

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
    public imagePath: string = '';

    public async ngOnInit(): Promise<void> {
        this._tracks = this.data;
        this._multipleValuesText = await this.translatorService.getAsync('multiple-values');
        await this.getFileMetaDatasAsync();
        this.setFields();
        await this.setImagePathAsync();

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

    private async getFileMetaDatasAsync(): Promise<void> {
        let numberOfErrors: number = 0;
        for (const track of this._tracks) {
            try {
                this._fileMetaDatas.push(await this.fileMetadataFactory.createAsync(track.path));
            } catch (e: unknown) {
                numberOfErrors++;
                if (e instanceof Error) {
                    this.logger.error(
                        e,
                        `Failed to get metadata for track: ${track.path}`,
                        'EditTracksDialogComponent',
                        'getFileMetaDatasAsync',
                    );
                }
            }
        }

        let errorText = await this.translatorService.getAsync('read-tags-error-single-file');

        if (numberOfErrors > 0) {
            if (numberOfErrors > 1) {
                errorText = await this.translatorService.getAsync('read-tags-error-multiple-files', { numberOfFiles: numberOfErrors });
            }
            this.dialogService.showErrorDialog(errorText);
        }
    }

    private setFields(): void {
        this.imageComparisonStatus = this.metadataService.compareImages(this._fileMetaDatas);

        if (this._fileMetaDatas.length === 1) {
            this.title = this._fileMetaDatas[0].title;
            this.artists = CollectionUtils.toSemicolonSeparatedString(this._fileMetaDatas[0].artists);
            this.albumTitle = this._fileMetaDatas[0].title;
            this.albumArtists = CollectionUtils.toSemicolonSeparatedString(this._fileMetaDatas[0].albumArtists);
            this.year = this._fileMetaDatas[0].year.toString();
            this.genres = CollectionUtils.toSemicolonSeparatedString(this._fileMetaDatas[0].genres);
            this.trackNumber = this._fileMetaDatas[0].trackNumber.toString();
            this.trackCount = this._fileMetaDatas[0].discCount.toString();
            this.discNumber = this._fileMetaDatas[0].discNumber.toString();
            this.discCount = this._fileMetaDatas[0].discCount.toString();
            this.grouping = this._fileMetaDatas[0].grouping;
            this.comment = this._fileMetaDatas[0].comment;
        } else if (this._fileMetaDatas.length > 1) {
            const allTitlesSame = this._fileMetaDatas.every((track) => track.title === this._fileMetaDatas[0].title);
            this.title = allTitlesSame ? this._fileMetaDatas[0].title : this._multipleValuesText;

            const allArtistsSame = this._fileMetaDatas.every((track) => track.artists === this._fileMetaDatas[0].artists);
            this.artists = allArtistsSame
                ? CollectionUtils.toSemicolonSeparatedString(this._fileMetaDatas[0].artists)
                : this._multipleValuesText;

            const allAlbumTitlesSame = this._fileMetaDatas.every((track) => track.title === this._fileMetaDatas[0].title);
            this.albumTitle = allAlbumTitlesSame ? this._fileMetaDatas[0].title : this._multipleValuesText;

            const allAlbumArtistsSame = this._fileMetaDatas.every((track) => track.albumArtists === this._fileMetaDatas[0].albumArtists);
            this.albumArtists = allAlbumArtistsSame
                ? CollectionUtils.toSemicolonSeparatedString(this._fileMetaDatas[0].albumArtists)
                : this._multipleValuesText;

            const allYearsSame = this._fileMetaDatas.every((track) => track.year === this._fileMetaDatas[0].year);
            this.year = allYearsSame ? this._fileMetaDatas[0].year.toString() : this._multipleValuesText;

            const allGenresSame = this._fileMetaDatas.every((track) => track.genres === this._fileMetaDatas[0].genres);
            this.genres = allGenresSame
                ? CollectionUtils.toSemicolonSeparatedString(this._fileMetaDatas[0].genres)
                : this._multipleValuesText;

            const allTrackNumbersSame = this._fileMetaDatas.every((track) => track.trackNumber === this._fileMetaDatas[0].trackNumber);
            this.trackNumber = allTrackNumbersSame ? this._fileMetaDatas[0].trackNumber.toString() : this._multipleValuesText;

            const allTrackCountsSame = this._fileMetaDatas.every((track) => track.discCount === this._fileMetaDatas[0].discCount);
            this.trackCount = allTrackCountsSame ? this._fileMetaDatas[0].discCount.toString() : this._multipleValuesText;

            const allDiscNumbersSame = this._fileMetaDatas.every((track) => track.discNumber === this._fileMetaDatas[0].discNumber);
            this.discNumber = allDiscNumbersSame ? this._fileMetaDatas[0].discNumber.toString() : this._multipleValuesText;

            const allDiscCountsSame = this._fileMetaDatas.every((track) => track.discCount === this._fileMetaDatas[0].discCount);
            this.discCount = allDiscCountsSame ? this._fileMetaDatas[0].discCount.toString() : this._multipleValuesText;

            const allGroupingsSame = this._fileMetaDatas.every((track) => track.grouping === this._fileMetaDatas[0].grouping);
            this.grouping = allGroupingsSame ? this._fileMetaDatas[0].grouping : this._multipleValuesText;

            const allCommentsSame = this._fileMetaDatas.every((track) => track.comment === this._fileMetaDatas[0].comment);
            this.comment = allCommentsSame ? this._fileMetaDatas[0].comment : this._multipleValuesText;
        }
    }

    private async setImagePathAsync(): Promise<void> {
        this.imagePath = await this.metadataService.createImageUrlAsync(this._tracks[0], false, 0);
    }

    public async changeImageAsync(): Promise<void> {}
}
