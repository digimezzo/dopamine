import { Injectable } from '@angular/core';
import { AlbumData } from '../../data/album-data';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { BaseAlbumArtworkCacheService } from '../album-artwork-cache/base-album-artwork-cache.service';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { AlbumModel } from './album-model';
import { BaseAlbumService } from './base-album-service';

@Injectable({
    providedIn: 'root',
})
export class AlbumService implements BaseAlbumService {
    constructor(
        private trackRepository: BaseTrackRepository,
        private translatorService: BaseTranslatorService,
        private albumArtworkCacheService: BaseAlbumArtworkCacheService
    ) {}

    public getAllAlbums(): AlbumModel[] {
        const albumDatas: AlbumData[] = this.trackRepository.getAllAlbumData();

        if (albumDatas != undefined) {
            const albums: AlbumModel[] = albumDatas.map((x) => new AlbumModel(x, this.translatorService));

            for (const album of albums) {
                album.artworkPath = this.albumArtworkCacheService.getCachedArtworkFilePathAsync(album.albumKey);
            }

            return albums;
        }

        return [];
    }
}
