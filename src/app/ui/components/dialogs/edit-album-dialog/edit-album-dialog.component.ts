import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlbumModel } from '../../../../services/album/album-model';
import { Constants } from '../../../../common/application/constants';
import { AlbumArtworkCacheServiceBase } from '../../../../services/album-artwork-cache/album-artwork-cache.service.base';
import { AlbumArtworkRepositoryBase } from '../../../../data/repositories/album-artwork-repository.base';
import { Logger } from '../../../../common/logger';

@Component({
    selector: 'app-edit-album-dialog',
    templateUrl: './edit-album-dialog.component.html',
    styleUrls: ['./edit-album-dialog.component.scss'],
})
export class EditAlbumDialogComponent {
    public imagePath: string = '';
    public updateFileCovers: boolean = false;
    public album: AlbumModel;

    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: AlbumModel[],
        private albumArtworkCacheService: AlbumArtworkCacheServiceBase,
        private albumArtworkRepository: AlbumArtworkRepositoryBase,
        private logger: Logger,
    ) {
        this.album = data[0];
        this.initializeImagePath();
    }

    public onExport(): void {}

    public onChange(): void {}

    public onDownload(): void {}

    public async onRemove(): Promise<void> {
        try {
            const artworkId: string | undefined = this.album.artworkId;

            if (artworkId != undefined) {
                await this.albumArtworkCacheService.removeArtworkDataFromCacheAsync(artworkId);
            }

            this.albumArtworkRepository.clearAlbumArtworkByAlbumKey(this.album.albumKey);

            this.album.artworkId = undefined;
            this.imagePath = '';
        } catch (e: unknown) {
            this.logger.error(e, 'Could not remove album artwork', 'EditAlbumDialogComponent', 'onRemove');
        }
    }

    private initializeImagePath(): void {
        if (this.album.artworkPath !== Constants.emptyImage) {
            this.imagePath = this.album.artworkPath;
        }
    }
}
