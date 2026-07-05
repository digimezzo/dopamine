import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { StringUtils } from '../../../../common/utils/string-utils';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { ImageProcessor } from '../../../../common/image-processor';
import { ArtistModel } from '../../../../services/artist/artist-model';
import { Constants } from '../../../../common/application/constants';
import { OnlineArtistArtworkGetter } from '../../../../services/indexing/online-artist-artwork-getter';
import { ArtistArtworkAdder } from '../../../../services/indexing/artist-artwork-adder';
import { Logger } from '../../../../common/logger';

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
    public alternativeImageLoaded: boolean[] = [];

    public constructor(
        private translatorService: TranslatorServiceBase,
        private onlineArtistArtworkGetter: OnlineArtistArtworkGetter,
        private dialogService: DialogServiceBase,
        private artistArtworkAdder: ArtistArtworkAdder,
        private desktop: DesktopBase,
        private imageProcessor: ImageProcessor,
        private logger: Logger,
        @Inject(MAT_DIALOG_DATA) public data: ArtistModel,
    ) {}

    public ngOnInit(): void {
        this.artist = this.data;
        const path: string = this.artist.artworkPath;
        this.originalImagePath = path == Constants.emptyImage ? '' : path;
        this.imagePath = this.originalImagePath;
    }

    public get isImageAvailable(): boolean {
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
        const artistName: string = this.artist.displayName;
        const imageUrls: string[] | undefined = await this.onlineArtistArtworkGetter.getAllOnlineArtworkUrlsAsync(artistName);
        this.alternativeImageUrls = imageUrls ?? [];

        if (imageUrls === undefined) {
            this.dialogService.showInfoDialog(await this.translatorService.getAsync('no-images-found-online'));
        }
    }

    public onImageLoaded(index: number): void {
        this.alternativeImageLoaded[index] = true;
    }

    public selectOnlineImage(imageUrl: string): void {
        this.imagePath = imageUrl;
    }

    public async saveArtistAsync(): Promise<void> {
        try {
            let image: Buffer | undefined = undefined;
            let manuallySet: boolean = false;
            if (StringUtils.isNullOrWhiteSpace(this.imagePath) && !StringUtils.isNullOrWhiteSpace(this.originalImagePath)) {
                image = Constants.emptyImageBuffer;
            } else if (this.imagePath !== this.originalImagePath) {
                manuallySet = true;
                if (this.imagePath.startsWith('file:///')) {
                    image = await this.imageProcessor.convertLocalImageToBufferAsync(this.imagePath);
                } else {
                    image = await this.imageProcessor.convertOnlineImageToBufferAsync(this.imagePath);
                }
            }

            if (image !== undefined) {
                await this.artistArtworkAdder.updateArtistArtworkAsync(this.artist.displayName, image, manuallySet);
            }
        } catch (e: unknown) {
            this.logger.error(
                e,
                `Failed to save artist image for artist ${this.artist.displayName} to file ${this.imagePath}`,
                'EditArtistDialogComponent',
                'saveArtistAsync',
            );
            this.dialogService.showErrorDialog(await this.translatorService.getAsync('change-image-error'));
        }
    }
}
