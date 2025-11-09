import { Injectable } from '@angular/core';
import { AlbumData } from '../../data/entities/album-data';
import { ArtistType } from '../artist/artist-type';
import { AlbumModel } from './album-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { AlbumServiceBase } from './album-service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { ApplicationPaths } from '../../common/application/application-paths';
import { SettingsBase } from '../../common/settings/settings.base';
import { ArtistModel } from '../artist/artist-model';
import { Timer } from '../../common/scheduling/timer';
import { Logger } from '../../common/logger';
import { ArtistServiceBase } from '../artist/artist.service.base';

@Injectable()
export class AlbumService implements AlbumServiceBase {
    public constructor(
        private artistService: ArtistServiceBase,
        private trackRepository: TrackRepositoryBase,
        private translatorService: TranslatorServiceBase,
        private applicationPaths: ApplicationPaths,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public async getAllAlbumsAsync(): Promise<AlbumModel[]> {
        const timer = new Timer();
        timer.start();

        const albumDatas: AlbumData[] = (await this.trackRepository.getAllAlbumDataAsync(this.settings.albumKeyIndex)) ?? [];
        const albums: AlbumModel[] = this.createAlbumsFromAlbumData(albumDatas);

        timer.stop();

        this.logger.info(`Finished getting all albums. Time required: ${timer.elapsedMilliseconds} ms`, 'AlbumService', 'getAllAlbums');

        return albums;
    }

    public async getAlbumsForArtistsAsync(artists: ArtistModel[], artistType: ArtistType): Promise<AlbumModel[]> {
        const timer = new Timer();
        timer.start();

        const albumDatas: AlbumData[] = [];

        const sourceArtists: string[] = this.artistService.getSourceArtists(artists);

        const albumKeyIndex = this.settings.albumKeyIndex;

        if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
            await this.addAlbumsForTrackOrAllArtistsAsync(albumKeyIndex, sourceArtists, albumDatas);
        }

        if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
            await this.addAlbumsForAlbumOrAllArtistsAsync(albumKeyIndex, sourceArtists, albumDatas);
        }

        const albums: AlbumModel[] = this.createAlbumsFromAlbumData(albumDatas);

        timer.stop();

        this.logger.info(
            `Finished getting albums for artists. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumService',
            'getAlbumsForArtists',
        );

        return albums;
    }

    public async getAlbumsForGenresAsync(genres: string[]): Promise<AlbumModel[]> {
        const timer = new Timer();
        timer.start();

        const albumDatas: AlbumData[] = (await this.trackRepository.getAlbumDataForGenresAsync(this.settings.albumKeyIndex, genres)) ?? [];
        const albums: AlbumModel[] = this.createAlbumsFromAlbumData(albumDatas);

        timer.stop();

        this.logger.info(
            `Finished getting albums for genres. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumService',
            'getAlbumsForGenres',
        );

        return albums;
    }

    private async addAlbumsForTrackOrAllArtistsAsync(albumKeyIndex: string, artists: string[], albumDatas: AlbumData[]): Promise<void> {
        const trackArtistsAlbumDatas: AlbumData[] =
            (await this.trackRepository.getAlbumDataForTrackArtistsAsync(albumKeyIndex, artists)) ?? [];

        for (const albumData of trackArtistsAlbumDatas) {
            albumDatas.push(albumData);
        }
    }

    private async addAlbumsForAlbumOrAllArtistsAsync(albumKeyIndex: string, artists: string[], albumDatas: AlbumData[]): Promise<void> {
        const albumArtistsAlbumDatas: AlbumData[] =
            (await this.trackRepository.getAlbumDataForAlbumArtistsAsync(albumKeyIndex, artists)) ?? [];

        for (const albumData of albumArtistsAlbumDatas) {
            // Avoid adding a track twice
            // TODO: can this be done better?
            if (!albumDatas.map((x) => x.albumKey).includes(albumData.albumKey)) {
                albumDatas.push(albumData);
            }
        }
    }

    private createAlbumsFromAlbumData(albumDatas: AlbumData[]): AlbumModel[] {
        if (albumDatas != undefined) {
            return albumDatas.map((x) => new AlbumModel(x, this.translatorService, this.applicationPaths));
        }

        return [];
    }
}
