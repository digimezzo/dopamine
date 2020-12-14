import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { AlbumArtwork } from '../../data/entities/album-artwork';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';

@Injectable()
export class AlbumArtworkRemover {
    constructor(
        private albumArtworkRepository: BaseAlbumArtworkRepository,
        private logger: Logger) {
    }

    public removeAlbumArtworkThatHasNoTrack(): void {
        try {
            const allAlbumArtworkThatHaveNoTrack: AlbumArtwork[] = this.albumArtworkRepository.getAllAlbumArtworkThatHasNoTrack();

            for (const albumArtworkThatHaveNoTrack of allAlbumArtworkThatHaveNoTrack) {
                this.albumArtworkRepository.deleteAlbumArtwork(albumArtworkThatHaveNoTrack.albumKey);
            }
        } catch (e) {
            this.logger.info(
                `Could not remove album artwork that has no track. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrack'
            );
        }
    }

    public removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(): void {
        try {
            const allAlbumArtworkForTracksThatNeedAlbumArtworkIndexing: AlbumArtwork[] = this.albumArtworkRepository.getAllAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            for (const albumArtworkForTracksThatNeedAlbumArtworkIndexing of allAlbumArtworkForTracksThatNeedAlbumArtworkIndexing) {
                this.albumArtworkRepository.deleteAlbumArtwork(albumArtworkForTracksThatNeedAlbumArtworkIndexing.albumKey);
            }
        } catch (e) {
            this.logger.info(
                `Could not remove album artwork for tracks that need album artwork indexing. Error: ${e.message}`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing'
            );
        }
    }
}
