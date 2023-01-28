import { Injectable } from '@angular/core';
import { AlbumData } from '../../common/data/entities/album-data';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { ArtistType } from '../artist/artist-type';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { AlbumModel } from './album-model';
import { BaseAlbumService } from './base-album-service';

@Injectable()
export class AlbumService implements BaseAlbumService {
    constructor(
        private trackRepository: BaseTrackRepository,
        private translatorService: BaseTranslatorService,
        private fileAccess: BaseFileAccess
    ) {}

    public getAllAlbums(): AlbumModel[] {
        const albumDatas: AlbumData[] = this.trackRepository.getAllAlbumData();

        return this.createAlbumsFromAlbumData(albumDatas);
    }

    public getAlbumsForArtists(artists: string[], artistType: ArtistType): AlbumModel[] {
        const albumDatas: AlbumData[] = [];

        if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
            const trackArtistsAlbumDatas: AlbumData[] = this.trackRepository.getAlbumDataForTrackArtists(artists);

            for (const albumData of trackArtistsAlbumDatas) {
                albumDatas.push(albumData);
            }
        }

        if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
            const albumArtistsAlbumDatas: AlbumData[] = this.trackRepository.getAlbumDataForAlbumArtists(artists);

            for (const albumData of albumArtistsAlbumDatas) {
                // Avoid adding a track twice
                // TODO: can this be done better?
                if (!albumDatas.map((x) => x.albumKey).includes(albumData.albumKey)) {
                    albumDatas.push(albumData);
                }
            }
        }

        return this.createAlbumsFromAlbumData(albumDatas);
    }

    public getAlbumsForGenres(genres: string[]): AlbumModel[] {
        const albumDatas: AlbumData[] = this.trackRepository.getAlbumDataForGenres(genres);

        return this.createAlbumsFromAlbumData(albumDatas);
    }

    private createAlbumsFromAlbumData(albumDatas: AlbumData[]): AlbumModel[] {
        if (albumDatas != undefined) {
            const albums: AlbumModel[] = albumDatas.map((x) => new AlbumModel(x, this.translatorService, this.fileAccess));

            return albums;
        }

        return [];
    }
}
