import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlbumModel } from '../../../../services/album/album-model';
import { Constants } from '../../../../common/application/constants';
import { AlbumArtworkCacheServiceBase } from '../../../../services/album-artwork-cache/album-artwork-cache.service.base';
import { AlbumArtworkRepositoryBase } from '../../../../data/repositories/album-artwork-repository.base';
import { Logger } from '../../../../common/logger';
import { LastfmApi } from '../../../../common/api/lastfm/lastfm.api';
import { ImageProcessor } from '../../../../common/image-processor';
import { ApplicationPaths } from '../../../../common/application/application-paths';
import { AlbumArtwork } from '../../../../data/entities/album-artwork';
import { StringUtils } from '../../../../common/utils/string-utils';
import { TrackRepositoryBase } from '../../../../data/repositories/track-repository.base';

@Component({
    selector: 'app-edit-album-dialog',
    templateUrl: './edit-album-dialog.component.html',
    styleUrls: ['./edit-album-dialog.component.scss'],
})
export class EditAlbumDialogComponent {
    public imagePath: string = '';
    public updateFileCovers: boolean = false;
    public album: AlbumModel;
    public isDownloading: boolean = false;
    private shouldRemoveArtwork: boolean = false;

    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: AlbumModel[],
        private dialogRef: MatDialogRef<EditAlbumDialogComponent>,
        private albumArtworkCacheService: AlbumArtworkCacheServiceBase,
        private albumArtworkRepository: AlbumArtworkRepositoryBase,
        private lastfmApi: LastfmApi,
        private imageProcessor: ImageProcessor,
        private applicationPaths: ApplicationPaths,
        private trackRepository: TrackRepositoryBase,
        private logger: Logger,
    ) {
        this.album = data[0];
        this.initializeImagePath();

        this.dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                void this.commitChanges();
            }
        });
    }

    public onExport(): void {}

    public onChange(): void {}

    public async onDownload(): Promise<void> {
        if (this.isDownloading) {
            return;
        }

        this.isDownloading = true;

        try {
            const artist: string = this.album.albumArtist;
            const title: string = this.album.albumTitle;

            if (StringUtils.isNullOrWhiteSpace(artist) || StringUtils.isNullOrWhiteSpace(title)) {
                return;
            }

            const lastfmAlbum = await this.lastfmApi.getAlbumInfoAsync(artist, title, false, 'EN');

            if (lastfmAlbum == undefined || StringUtils.isNullOrWhiteSpace(lastfmAlbum.largestImage())) {
                return;
            }

            const imageBuffer: Buffer = await this.imageProcessor.convertOnlineImageToBufferAsync(lastfmAlbum.largestImage());
            const cacheId = await this.albumArtworkCacheService.addArtworkDataToCacheAsync(imageBuffer);

            if (cacheId == undefined) {
                return;
            }

            // Remove old artwork if present
            if (this.album.artworkId != undefined) {
                await this.albumArtworkCacheService.removeArtworkDataFromCacheAsync(this.album.artworkId);
            }

            // Delete existing row and insert new one
            this.albumArtworkRepository.deleteAlbumArtworkByAlbumKey(this.album.albumKey);
            this.albumArtworkRepository.addAlbumArtwork(new AlbumArtwork(this.album.albumKey, cacheId.id));
            this.trackRepository.disableNeedsAlbumArtworkIndexing(this.album.albumKey);
            this.album.artworkId = cacheId.id;
            this.imagePath = 'file:///' + this.applicationPaths.coverArtFullPath(cacheId.id);
            this.shouldRemoveArtwork = false;
        } catch (e: unknown) {
            this.logger.error(e, 'Could not download album artwork from Last.fm', 'EditAlbumDialogComponent', 'onDownload');
        } finally {
            this.isDownloading = false;
        }
    }

    public onRemove(): void {
        this.shouldRemoveArtwork = true;
        this.imagePath = '';
    }

    private async commitChanges(): Promise<void> {
        if (this.shouldRemoveArtwork) {
            try {
                const artworkId: string | undefined = this.album.artworkId;

                if (artworkId != undefined) {
                    await this.albumArtworkCacheService.removeArtworkDataFromCacheAsync(artworkId);
                }

                this.albumArtworkRepository.clearAlbumArtworkByAlbumKey(this.album.albumKey);
                this.album.artworkId = undefined;
            } catch (e: unknown) {
                this.logger.error(e, 'Could not remove album artwork', 'EditAlbumDialogComponent', 'commitChanges');
            }
        }
    }

    private initializeImagePath(): void {
        if (this.album.artworkPath !== Constants.emptyImage) {
            this.imagePath = this.album.artworkPath;
        }
    }
}
