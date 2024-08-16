import { Injectable } from '@angular/core';
import { AlbumData } from '../../data/entities/album-data';
import { ArtistType } from '../artist/artist-type';
import { AlbumModel } from './album-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { AlbumServiceBase } from './album-service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { ApplicationPaths } from '../../common/application/application-paths';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable()
export class AlbumService implements AlbumServiceBase {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private translatorService: TranslatorServiceBase,
        private applicationPaths: ApplicationPaths,
        private settings: SettingsBase,
    ) {}

    public getAllAlbums(): AlbumModel[] {
        const albumDatas: AlbumData[] = this.trackRepository.getAllAlbumData(this.settings.albumKeyIndex) ?? [];

        return this.createAlbumsFromAlbumData(albumDatas);
    }

    public getAlbumsForArtists(artists: string[], artistType: ArtistType): AlbumModel[] {
        const albumDatas: AlbumData[] = [];

        if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
            this.addAlbumsForTrackOrAllArtists(artists, albumDatas);
        }

        if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
            this.addAlbumsForAlbumOrAllArtists(artists, albumDatas);
        }

        return this.createAlbumsFromAlbumData(albumDatas);
    }

    private addAlbumsForTrackOrAllArtists(artists: string[], albumDatas: AlbumData[]): void {
        const trackArtistsAlbumDatas: AlbumData[] =
            this.trackRepository.getAlbumDataForTrackArtists(this.settings.albumKeyIndex, artists) ?? [];

        for (const albumData of trackArtistsAlbumDatas) {
            albumDatas.push(albumData);
        }
    }

    private addAlbumsForAlbumOrAllArtists(artists: string[], albumDatas: AlbumData[]): void {
        const albumArtistsAlbumDatas: AlbumData[] =
            this.trackRepository.getAlbumDataForAlbumArtists(this.settings.albumKeyIndex, artists) ?? [];

        for (const albumData of albumArtistsAlbumDatas) {
            // Avoid adding a track twice
            // TODO: can this be done better?
            if (!albumDatas.map((x) => x.albumKey).includes(albumData.albumKey)) {
                albumDatas.push(albumData);
            }
        }
    }

    public getAlbumsForGenres(genres: string[]): AlbumModel[] {
        const albumDatas: AlbumData[] = this.trackRepository.getAlbumDataForGenres(this.settings.albumKeyIndex, genres) ?? [];

        return this.createAlbumsFromAlbumData(albumDatas);
    }

    private createAlbumsFromAlbumData(albumDatas: AlbumData[]): AlbumModel[] {
        if (albumDatas != undefined) {
            return albumDatas.map((x) => new AlbumModel(x, this.translatorService, this.applicationPaths));
        }

        return [];
    }
}
