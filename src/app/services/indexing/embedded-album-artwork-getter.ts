import { Injectable } from '@angular/core';
import { Logger } from '../../common/logger';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';

@Injectable()
export class EmbeddedAlbumArtworkGetter {
    public constructor(private logger: Logger) {}

    public getEmbeddedArtwork(fileMetadata: IFileMetadata): Buffer | undefined {
        if (fileMetadata == undefined) {
            return undefined;
        }

        let artworkData: Buffer | undefined;

        try {
            artworkData = fileMetadata.picture;
        } catch (error) {
            this.logger.error(
                `Could not get embedded artwork for track with path='${fileMetadata.path}'`,
                'EmbeddedAlbumArtworkGetter',
                'getEmbeddedArtwork'
            );
        }

        return artworkData;
    }
}
