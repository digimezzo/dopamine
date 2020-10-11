import { Injectable } from '@angular/core';
import { ConfirmThat } from '../../core/confirm-that';
import { ImageProcessor } from '../../core/image-processor';
import { Logger } from '../../core/logger';
import { FileMetadata } from '../../metadata/file-metadata';
import { ExternalArtworkPathGetter } from './external-artwork-path-getter';

@Injectable({
    providedIn: 'root'
})
export class AlbumArtworkGetter {
    constructor(
        private externalArtworkPathGetter: ExternalArtworkPathGetter,
        private imageprocessor: ImageProcessor,
        private logger: Logger) {
    }

    public async getAlbumArtworkAsync(fileMetadata: FileMetadata): Promise<Buffer> {
        if (ConfirmThat.isNull(fileMetadata)) {
            return null;
        }

        const embeddedArtwork: Buffer = this.getEmbeddedArtwork(fileMetadata);

        if (ConfirmThat.isNotNull(embeddedArtwork)) {
            return embeddedArtwork;
        }

        const externalArtwork: Buffer = await this.getExternalArtworkAsync(fileMetadata);

        if (ConfirmThat.isNotNull(externalArtwork)) {
            return externalArtwork;
        }

        return null;
    }

    private getEmbeddedArtwork(fileMetadata: FileMetadata): Buffer {
        let artworkData: Buffer = null;

        try {
            artworkData = fileMetadata.picture;
        } catch (error) {
            this.logger.error(
                `Could not get embedded artwork for track with path='${fileMetadata.path}'`,
                'AlbumArtworkGetter',
                'getEmbeddedArtwork'
            );
        }

        return artworkData;
    }

    private async getExternalArtworkAsync(fileMetadata: FileMetadata): Promise<Buffer> {
        let artworkData: Buffer = null;

        try {
            const externalArtworkPath: string = this.externalArtworkPathGetter.getExternalArtworkPath(fileMetadata.path);

            if (ConfirmThat.isNotNullOrWhiteSpace(externalArtworkPath)) {
                artworkData = await this.imageprocessor.convertFileToDataAsync(externalArtworkPath);
            }
        } catch (error) {
            this.logger.error(
                `Could not get external artwork for track with path='${fileMetadata.path}'`,
                'AlbumArtworkGetter',
                'getExternalArtwork'
            );
        }

        return artworkData;
    }
}
