import { Injectable } from '@angular/core';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { Strings } from '../../common/strings';
import { ExternalArtworkPathGetter } from './external-artwork-path-getter';

@Injectable()
export class ExternalAlbumArtworkGetter {
    constructor(
        private externalArtworkPathGetter: ExternalArtworkPathGetter,
        private imageProcessor: ImageProcessor,
        private logger: Logger
    ) {}

    public async getExternalArtworkAsync(fileMetadata: IFileMetadata): Promise<Buffer> {
        if (fileMetadata == undefined) {
            return undefined;
        }

        let artworkData: Buffer;

        try {
            const externalArtworkPath: string = await this.externalArtworkPathGetter.getExternalArtworkPathAsync(fileMetadata.path);

            if (!Strings.isNullOrWhiteSpace(externalArtworkPath)) {
                artworkData = await this.imageProcessor.convertLocalImageToBufferAsync(externalArtworkPath);
            }
        } catch (e) {
            this.logger.error(
                `Could not get external artwork for track with path='${fileMetadata.path}'`,
                'ExternalAlbumArtworkGetter',
                'getExternalArtwork'
            );
        }

        return artworkData;
    }
}
