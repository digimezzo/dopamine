import { Injectable } from '@angular/core';
import { FileMetadata } from '../../metadata/file-metadata';

@Injectable({
    providedIn: 'root'
})
export class AlbumArtworkGetter {
    constructor() {
    }

    public getAlbumArtwork(fileMetadata: FileMetadata): Buffer {
        if (!fileMetadata) {
            return null;
        }

        return fileMetadata.picture;
    }

    // private getEmbeddedArtwork(fileMetadata: FileMetadata): Buffer {
    //     let artworkData: Buffer = null;

    //     try {
    //         artworkData = fileMetadata.picture;
    //     } catch (error) {
    //         this.logger.error(
    //             `Could not get artwork data for track with path='${fileMetadata.path}'`,
    //             'AlbumArtworkAdder',
    //             'getEmbeddedArtwork'
    //             );
    //     }

    //     return artworkData;
    // }
}
