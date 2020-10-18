import { Injectable } from '@angular/core';
import { ImageProcessor } from '../../core/image-processor';
import { Logger } from '../../core/logger';
import { StringCompare } from '../../core/string-compare';
import { FileMetadata } from '../../metadata/file-metadata';
import { ExternalArtworkPathGetter } from './external-artwork-path-getter';

@Injectable()
export class ExternalAlbumArtworkGetter {
    constructor(
        private externalArtworkPathGetter: ExternalArtworkPathGetter,
        private imageprocessor: ImageProcessor,
        private logger: Logger) {
    }

    public async getExternalArtworkAsync(fileMetadata: FileMetadata): Promise<Buffer> {
        if (fileMetadata == undefined) {
            return undefined;
        }

        let artworkData: Buffer;

        try {
            const externalArtworkPath: string = this.externalArtworkPathGetter.getExternalArtworkPath(fileMetadata.path);

            if (!StringCompare.isNullOrWhiteSpace(externalArtworkPath)) {
                artworkData = await this.imageprocessor.convertLocalImageToBufferAsync(externalArtworkPath);
            }
        } catch (error) {
            this.logger.error(
                `Could not get external artwork for track with path='${fileMetadata.path}'`,
                'ExternalAlbumArtworkGetter',
                'getExternalArtwork'
            );
        }

        return artworkData;
    }
}
