import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';
import { BaseAlbumArtworkCacheService } from '../album-artwork-cache/base-album-artwork-cache.service';

@Injectable()
export class AlbumArtworkRemover {
    constructor(
        private albumArtworkRepository: BaseAlbumArtworkRepository,
        private logger: Logger,
        private albumArtworkCacheService: BaseAlbumArtworkCacheService) {
    }

    public tryRemoveAlbumArtwork(albumKey: string): boolean {
        try {
            const artworkId: string = this.albumArtworkRepository.getArtworkId(albumKey);
            this.albumArtworkRepository.deleteAlbumArtwork(albumKey);
            this.albumArtworkCacheService.removeArtworkDataFromCache(artworkId);
        } catch (error) {
            this.logger.error(
                `Could not remove artwork for albumKey=${albumKey}. Error: ${error.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtwork'
            );

            return false;
        }

        return true;
    }
}
