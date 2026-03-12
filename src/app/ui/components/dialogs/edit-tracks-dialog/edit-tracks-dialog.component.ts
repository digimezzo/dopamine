import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrackModel } from '../../../../services/track/track-model';
import { IFileMetadata } from '../../../../common/metadata/i-file-metadata';
import { FileMetadataFactoryBase } from '../../../../common/metadata/file-metadata.factory.base';
import { CollectionUtils } from '../../../../common/utils/collections-utils';
import { Logger } from '../../../../common/logger';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { MetadataService } from '../../../../services/metadata/metadata.service';
import { ImageComparisonStatus } from '../../../../services/metadata/image-comparison-status';
import { StringUtils } from '../../../../common/utils/string-utils';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { ImageRenderData } from '../../../../services/metadata/image-render-data';
import { OnlineAlbumArtworkGetter } from '../../../../services/indexing/online-album-artwork-getter';
import { ImageProcessor } from '../../../../common/image-processor';
import { IndexingService } from '../../../../services/indexing/indexing.service';
import { MetadataPatcher } from '../../../../common/metadata/metadata-patcher';

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
    private _shouldRemoveImages: boolean = false;
    private _newImageBuffer: Buffer | undefined;

    public constructor(
        private dialogService: DialogServiceBase,
        private translatorService: TranslatorServiceBase,
        private metadataService: MetadataService,
        private metadataPatcher: MetadataPatcher,
        private indexingService: IndexingService,
        private fileMetadataFactory: FileMetadataFactoryBase,
        private onlineAlbumArtworkGetter: OnlineAlbumArtworkGetter,
        private logger: Logger,
        private desktop: DesktopBase,
        private imageProcessor: ImageProcessor,
        @Inject(MAT_DIALOG_DATA) public data: TrackModel[],
    ) {}

    public imageComparisonStatus: ImageComparisonStatus = ImageComparisonStatus.None;
    public imageComparisonStatusEnum: typeof ImageComparisonStatus = ImageComparisonStatus;
    public canShowRemoveButton: boolean = false;

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
    public composers: string = '';
    public conductor: string = '';
    public beatsPerMinute: string = '';

    public get canExportImage(): boolean {
        return (
            this.imageComparisonStatus === ImageComparisonStatus.Identical &&
            this.imagePath !== '' &&
            this._fileMetaDatas[0].picture !== undefined
        );
    }

    public async ngOnInit(): Promise<void> {
        this._tracks = this.data;
        this._multipleValuesText = await this.translatorService.getAsync('multiple-values');
        await this.getFileMetaDatasAsync();
        this.setFields();
        await this.setImagePathAsync();
    }

    public async exportImageAsync(): Promise<void> {
        const selectedPath = await this.desktop.showSaveFileDialogAsync(
            this.translatorService.get('choose-image'),
            `${this.translatorService.get('image')}.png`,
        );

        if (!StringUtils.isNullOrWhiteSpace(selectedPath) && this.canExportImage) {
            await this.imageProcessor.convertImageBufferToFileAsync(this._fileMetaDatas[0].picture!, selectedPath);
        }
    }

    public async changeImageAsync(): Promise<void> {
        const selectedFile: string = await this.desktop.showSelectFileDialogAsync(this.translatorService.get('choose-image'));

        if (!StringUtils.isNullOrWhiteSpace(selectedFile)) {
            try {
                const renderData: ImageRenderData = await this.metadataService.getImageRenderDataAsync(selectedFile);
                this.setNewImageFromRenderData(renderData);
            } catch (e: unknown) {
                this.dialogService.showErrorDialog(await this.translatorService.getAsync('change-image-error'));
            }
        }
    }

    public async downloadImageAsync(): Promise<void> {
        try {
            const onlineAlbumArtwork: Buffer | undefined = await this.onlineAlbumArtworkGetter.getOnlineArtworkAsync(
                this._fileMetaDatas[0],
            );

            if (onlineAlbumArtwork) {
                const renderData: ImageRenderData = await this.metadataService.getImageRenderDataAsync(onlineAlbumArtwork);
                this.setNewImageFromRenderData(renderData);
            } else {
                this.dialogService.showInfoDialog(await this.translatorService.getAsync('no-image-found-online'));
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                this.logger.error(e, 'Failed to download image', 'EditTracksDialogComponent', 'downloadImageAsync');
            }
            this.dialogService.showErrorDialog(await this.translatorService.getAsync('download-image-error'));
        }
    }

    private setNewImageFromRenderData(renderData: ImageRenderData): void {
        this.imagePath = renderData.imageUrl;
        this._newImageBuffer = renderData.imageBuffer;
        this.canShowRemoveButton = true;
        this.imageComparisonStatus = ImageComparisonStatus.Identical;
    }

    public removeImage(): void {
        this.canShowRemoveButton = false;
        this._shouldRemoveImages = true;
        this.imagePath = '';
    }

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

        if (this.imageComparisonStatus !== ImageComparisonStatus.None) {
            this.canShowRemoveButton = true;
        }

        if (this._fileMetaDatas.length === 1) {
            this.title = this._fileMetaDatas[0].title;
            this.artists = CollectionUtils.toSemicolonSeparatedString(
                this.metadataPatcher.joinUnsplittableMetadata(this._fileMetaDatas[0].artists),
            );
            this.albumTitle = this._fileMetaDatas[0].album;
            this.albumArtists = CollectionUtils.toSemicolonSeparatedString(
                this.metadataPatcher.joinUnsplittableMetadata(this._fileMetaDatas[0].albumArtists),
            );
            this.year = this.saveGetNumberAsString(this._fileMetaDatas[0].year);
            this.genres = CollectionUtils.toSemicolonSeparatedString(
                this.metadataPatcher.joinUnsplittableMetadata(this._fileMetaDatas[0].genres),
            );
            this.trackNumber = this.saveGetNumberAsString(this._fileMetaDatas[0].trackNumber);
            this.trackCount = this.saveGetNumberAsString(this._fileMetaDatas[0].trackCount);
            this.discNumber = this.saveGetNumberAsString(this._fileMetaDatas[0].discNumber);
            this.discCount = this.saveGetNumberAsString(this._fileMetaDatas[0].discCount);
            this.grouping = this._fileMetaDatas[0].grouping;
            this.comment = this._fileMetaDatas[0].comment;
            this.composers = CollectionUtils.toSemicolonSeparatedString(
                this.metadataPatcher.joinUnsplittableMetadata(this._fileMetaDatas[0].composers),
            );
            this.conductor = this._fileMetaDatas[0].conductor;
            this.beatsPerMinute = this.saveGetNumberAsString(this._fileMetaDatas[0].beatsPerMinute);
        } else if (this._fileMetaDatas.length > 1) {
            const allTitlesSame = this._fileMetaDatas.every((track) => track.title === this._fileMetaDatas[0].title);
            this.title = allTitlesSame ? this._fileMetaDatas[0].title : this._multipleValuesText;

            const allArtistsSame = this._fileMetaDatas.every((track) => track.artists === this._fileMetaDatas[0].artists);
            this.artists = allArtistsSame
                ? CollectionUtils.toSemicolonSeparatedString(this._fileMetaDatas[0].artists)
                : this._multipleValuesText;

            const allAlbumTitlesSame = this._fileMetaDatas.every((track) => track.album === this._fileMetaDatas[0].album);
            this.albumTitle = allAlbumTitlesSame ? this._fileMetaDatas[0].album : this._multipleValuesText;

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

            const allComposersSame = this._fileMetaDatas.every((track) => track.composers === this._fileMetaDatas[0].composers);
            this.composers = allComposersSame
                ? CollectionUtils.toSemicolonSeparatedString(this._fileMetaDatas[0].composers)
                : this._multipleValuesText;

            const allConductorsSame = this._fileMetaDatas.every((track) => track.conductor === this._fileMetaDatas[0].conductor);
            this.conductor = allConductorsSame ? this._fileMetaDatas[0].conductor : this._multipleValuesText;

            const allBpmSame = this._fileMetaDatas.every((track) => track.beatsPerMinute === this._fileMetaDatas[0].beatsPerMinute);
            this.beatsPerMinute = allBpmSame ? this._fileMetaDatas[0].beatsPerMinute.toString() : this._multipleValuesText;
        }
    }

    private async setImagePathAsync(): Promise<void> {
        this.imagePath = await this.metadataService.createTrackImageUrlAsync(this._tracks[0]);
    }

    public async saveMetadataAsync(): Promise<void> {
        let numberOfErrors: number = 0;

        for (const fileMetaData of this._fileMetaDatas) {
            try {
                if (this.title !== this._multipleValuesText) {
                    fileMetaData.title = this.title;
                }
                if (this.artists !== this._multipleValuesText) {
                    fileMetaData.artists = CollectionUtils.fromSemicolonSeparatedString(this.artists);
                }
                if (this.albumTitle !== this._multipleValuesText) {
                    fileMetaData.album = this.albumTitle;
                }
                if (this.albumArtists !== this._multipleValuesText) {
                    fileMetaData.albumArtists = CollectionUtils.fromSemicolonSeparatedString(this.albumArtists);
                }
                if (this.year !== this._multipleValuesText) {
                    fileMetaData.year = this.saveSetNumberFromString(this.year);
                }
                if (this.genres !== this._multipleValuesText) {
                    fileMetaData.genres = CollectionUtils.fromSemicolonSeparatedString(this.genres);
                }
                if (this.trackNumber !== this._multipleValuesText) {
                    fileMetaData.trackNumber = this.saveSetNumberFromString(this.trackNumber);
                }
                if (this.trackCount !== this._multipleValuesText) {
                    fileMetaData.trackCount = this.saveSetNumberFromString(this.trackCount);
                }
                if (this.discNumber !== this._multipleValuesText) {
                    fileMetaData.discNumber = this.saveSetNumberFromString(this.discNumber);
                }
                if (this.discCount !== this._multipleValuesText) {
                    fileMetaData.discCount = this.saveSetNumberFromString(this.discCount);
                }
                if (this.grouping !== this._multipleValuesText) {
                    fileMetaData.grouping = this.grouping;
                }
                if (this.comment !== this._multipleValuesText) {
                    fileMetaData.comment = this.comment;
                }
                if (this.composers !== this._multipleValuesText) {
                    fileMetaData.composers = CollectionUtils.fromSemicolonSeparatedString(this.composers);
                }
                if (this.conductor !== this._multipleValuesText) {
                    fileMetaData.conductor = this.conductor;
                }
                if (this.beatsPerMinute !== this._multipleValuesText) {
                    fileMetaData.beatsPerMinute = this.saveSetNumberFromString(this.beatsPerMinute);
                }

                if (this._shouldRemoveImages) {
                    fileMetaData.picture = undefined;
                } else if (this._newImageBuffer != undefined) {
                    fileMetaData.picture = this._newImageBuffer;
                }

                fileMetaData.save();
            } catch (e: unknown) {
                numberOfErrors++;
                this.logger.error(
                    e,
                    `Failed to save metadata for file "${fileMetaData.path}"`,
                    'EditTracksDialogComponent',
                    'saveMetadata',
                );
            }
        }

        if (numberOfErrors > 0) {
            const message =
                numberOfErrors === 1
                    ? await this.translatorService.getAsync('save-tags-error-single-file')
                    : await this.translatorService.getAsync('save-tags-error-multiple-files', { numberOfFiles: numberOfErrors });
            this.dialogService.showErrorDialog(message);
        }

        try {
            await this.indexingService.indexAfterTagChangeAsync(this._fileMetaDatas);
        } catch (e: unknown) {
            if (e instanceof Error) {
                this.logger.error(e, 'Failed to index', 'EditTracksDialogComponent', 'saveMetadata');
            }
        }
    }

    private saveGetNumberAsString(number: number): string {
        if (number === 0) {
            return '';
        }

        return number.toString();
    }

    private saveSetNumberFromString(value: string): number {
        if (value === '') {
            return 0;
        }

        const number = parseInt(value);

        if (isNaN(number)) {
            return 0;
        }

        return number;
    }
}
