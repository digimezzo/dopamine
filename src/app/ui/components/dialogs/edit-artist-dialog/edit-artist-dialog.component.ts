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
import { ArtistModel } from '../../../../services/artist/artist-model';
import { Constants } from '../../../../common/application/constants';

@Component({
    selector: 'app-edit-artist-dialog',
    templateUrl: './edit-artist-dialog.component.html',
    styleUrls: ['./edit-artist-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EditArtistDialogComponent implements OnInit {
    private artist: ArtistModel;
    private originalImagePath: string;
    public imagePath: string = '';
    public alternativeImageUrls: string[] = [];

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
        @Inject(MAT_DIALOG_DATA) public data: ArtistModel,
    ) {}

    public ngOnInit(): void {
        this.artist = this.data;
        const path: string = this.artist.artworkPath;
        this.originalImagePath = path == Constants.emptyImage ? '' : path;
        this.imagePath = this.originalImagePath;
    }

    public get isImageAvailable() {
        return !StringUtils.isNullOrWhiteSpace(this.imagePath);
    }

    public async selectLocalImageAsync(): Promise<void> {
        const selectedFile: string = await this.desktop.showSelectFileDialogAsync(this.translatorService.get('choose-image'));
        if (!StringUtils.isNullOrWhiteSpace(selectedFile)) {
            this.imagePath = selectedFile;
        }
    }

    public removeImage(): void {
        this.imagePath = '';
    }

    public async searchForImagesOnline(): Promise<void> {
        return undefined;
    }

    public selectOnlineImage(imageUrl: string): void {
        this.imagePath = imageUrl;
    }

    public saveArtistAsync(): void {
        if (StringUtils.isNullOrWhiteSpace(this.imagePath) && !StringUtils.isNullOrWhiteSpace(this.originalImagePath)) {
            // TODO delete image
        } else if (this.imagePath !== this.originalImagePath) {
            if (this.imagePath.startsWith('file:///')) {
                // TODO local image
            } else {
                // TODO online image
            }

            // this.dialogService.showErrorDialog(await this.translatorService.getAsync('change-image-error'));
        }
    }
}
