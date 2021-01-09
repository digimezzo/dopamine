import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { FileMetadata } from '../../metadata/file-metadata';

@Injectable()
export class EmbeddedAlbumArtworkGetter {
    constructor(private logger: Logger) {}

    public getEmbeddedArtwork(fileMetadata: FileMetadata): Buffer {
        if (fileMetadata == undefined) {
            return undefined;
        }

        let artworkData: Buffer;

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
