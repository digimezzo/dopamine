import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';

@Injectable()
export class AlbumArtworkRemover {
    constructor(private albumArtworkRepository: BaseAlbumArtworkRepository, private logger: Logger) {
    }

    public tryRemoveAlbumArtwork(albumKey: string): boolean {
        try {
            this.albumArtworkRepository.deleteAlbumArtwork(albumKey);
        } catch (error) {
            this.logger.error(`Could not remove artwork for albumKey=${albumKey}. Error: ${error.message}`, 'AlbumArtworkRemover', 'removeAlbumArtwork');
            return false;
        }

        return true;
    }
}
