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
import { DesktopBase } from '../../../../common/io/desktop.base';
import { FileAccessBase } from '../../../../common/io/file-access.base';

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
    private pendingArtworkCacheId: string | undefined;
    private originalArtworkId: string | undefined;

    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: AlbumModel[],
        private dialogRef: MatDialogRef<EditAlbumDialogComponent>,
        private albumArtworkCacheService: AlbumArtworkCacheServiceBase,
        private albumArtworkRepository: AlbumArtworkRepositoryBase,
        private lastfmApi: LastfmApi,
        private imageProcessor: ImageProcessor,
        private applicationPaths: ApplicationPaths,
        private trackRepository: TrackRepositoryBase,
        private desktop: DesktopBase,
        private fileAccess: FileAccessBase,
        private logger: Logger,
    ) {
        this.album = data[0];
        this.originalArtworkId = this.album.artworkId;
        this.initializeImagePath();

        this.dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                void this.commitChanges();
            } else {
                void this.discardChanges();
            }
        });
    }

    public async onExport(): Promise<void> {
        if (this.album.artworkId == undefined) {
            return;
        }

        try {
            const defaultFileName: string = `${this.album.albumArtist} - ${this.album.albumTitle}.jpg`;
            const selectedPath: string = await this.desktop.showSaveFileDialogAsync('', defaultFileName);

            if (StringUtils.isNullOrWhiteSpace(selectedPath)) {
                return;
            }

            const artist: string = this.album.albumArtist;
            const title: string = this.album.albumTitle;

            if (!StringUtils.isNullOrWhiteSpace(artist) && !StringUtils.isNullOrWhiteSpace(title)) {
                const lastfmAlbum = await this.lastfmApi.getAlbumInfoAsync(artist, title, false, 'EN');

                if (lastfmAlbum != undefined && !StringUtils.isNullOrWhiteSpace(lastfmAlbum.largestImage())) {
                    const imageBuffer: Buffer = await this.imageProcessor.convertOnlineImageToBufferAsync(lastfmAlbum.largestImage());
                    await this.imageProcessor.convertImageBufferToFileAsync(imageBuffer, selectedPath);
                    this.desktop.showFileInDirectory(selectedPath);
                    return;
                }
            }

            // Fallback: export the cached (resized) artwork
            const artworkFilePath: string = this.applicationPaths.coverArtFullPath(this.album.artworkId);
            this.fileAccess.copyFile(artworkFilePath, selectedPath);
            this.desktop.showFileInDirectory(selectedPath);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not export album artwork', 'EditAlbumDialogComponent', 'onExport');
        }
    }

    public async onChange(): Promise<void> {
        try {
            const selectedPath: string = await this.desktop.showSelectFileDialogAsync('');

            if (StringUtils.isNullOrWhiteSpace(selectedPath)) {
                return;
            }

            const imageBuffer: Buffer = await this.imageProcessor.convertLocalImageToBufferAsync(selectedPath);
            const cacheId = await this.albumArtworkCacheService.addArtworkDataToCacheAsync(imageBuffer);

            if (cacheId == undefined) {
                return;
            }

            // Remove previously pending artwork if user changes again before confirming
            if (this.pendingArtworkCacheId != undefined) {
                await this.albumArtworkCacheService.removeArtworkDataFromCacheAsync(this.pendingArtworkCacheId);
            }

            this.pendingArtworkCacheId = cacheId.id;
            this.imagePath = 'file:///' + this.applicationPaths.coverArtFullPath(cacheId.id);
            this.shouldRemoveArtwork = false;
        } catch (e: unknown) {
            this.logger.error(e, 'Could not change album artwork', 'EditAlbumDialogComponent', 'onChange');
        }
    }

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

            // Remove previously pending artwork if user downloads again before confirming
            if (this.pendingArtworkCacheId != undefined) {
                await this.albumArtworkCacheService.removeArtworkDataFromCacheAsync(this.pendingArtworkCacheId);
            }

            this.pendingArtworkCacheId = cacheId.id;
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
        try {
            if (this.shouldRemoveArtwork) {
                // User chose to remove artwork
                if (this.originalArtworkId != undefined) {
                    await this.albumArtworkCacheService.removeArtworkDataFromCacheAsync(this.originalArtworkId);
                }

                this.albumArtworkRepository.deleteAlbumArtworkByAlbumKey(this.album.albumKey);
                this.album.artworkId = undefined;
            } else if (this.pendingArtworkCacheId != undefined) {
                // User chose a new artwork (download or change image)
                if (this.originalArtworkId != undefined) {
                    await this.albumArtworkCacheService.removeArtworkDataFromCacheAsync(this.originalArtworkId);
                }

                this.albumArtworkRepository.deleteAlbumArtworkByAlbumKey(this.album.albumKey);
                this.albumArtworkRepository.addAlbumArtwork(new AlbumArtwork(this.album.albumKey, this.pendingArtworkCacheId));
                this.trackRepository.disableNeedsAlbumArtworkIndexing(this.album.albumKey);
                this.album.artworkId = this.pendingArtworkCacheId;
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not commit album artwork changes', 'EditAlbumDialogComponent', 'commitChanges');
        }
    }

    private async discardChanges(): Promise<void> {
        try {
            // Clean up any temporarily cached artwork
            if (this.pendingArtworkCacheId != undefined) {
                await this.albumArtworkCacheService.removeArtworkDataFromCacheAsync(this.pendingArtworkCacheId);
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not discard album artwork changes', 'EditAlbumDialogComponent', 'discardChanges');
        }
    }

    private initializeImagePath(): void {
        if (this.album.artworkPath !== Constants.emptyImage) {
            this.imagePath = this.album.artworkPath;
        }
    }
}
