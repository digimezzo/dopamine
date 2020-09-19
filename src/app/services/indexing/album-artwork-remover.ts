import { Injectable } from '@angular/core';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';

@Injectable({
    providedIn: 'root'
})
export class AlbumArtworkRemover {
    constructor(private albumArtworkRepository: BaseAlbumArtworkRepository) {
    }

    public removeAlbumArtwork(albumKey: string): void {
        this.albumArtworkRepository.deleteAlbumArtwork(albumKey);
    }
}
