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

    public getAllAlbums(): AlbumModel[] {
        const timer = new Timer();
        timer.start();

        const albumDatas: AlbumData[] = this.trackRepository.getAllAlbumData(this.settings.albumKeyIndex) ?? [];
        const albums: AlbumModel[] = this.createAlbumsFromAlbumData(albumDatas);

        timer.stop();

        this.logger.info(`Finished getting all albums. Time required: ${timer.elapsedMilliseconds} ms`, 'AlbumService', 'getAllAlbums');

        return albums;
    }

    public getAlbumsForArtists(artists: ArtistModel[], artistType: ArtistType): AlbumModel[] {
        const timer = new Timer();
        timer.start();

        const albumDatas: AlbumData[] = [];

        const sourceArtists: string[] = this.artistService.getSourceArtists(artists);

        const albumKeyIndex = this.settings.albumKeyIndex;

        if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
            this.addAlbumsForTrackOrAllArtists(albumKeyIndex, sourceArtists, albumDatas);
        }

        if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
            this.addAlbumsForAlbumOrAllArtists(albumKeyIndex, sourceArtists, albumDatas);
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

    public getAlbumsForGenres(genres: string[]): AlbumModel[] {
        const timer = new Timer();
        timer.start();

        const albumDatas: AlbumData[] = this.trackRepository.getAlbumDataForGenres(this.settings.albumKeyIndex, genres) ?? [];
        const albums: AlbumModel[] = this.createAlbumsFromAlbumData(albumDatas);

        timer.stop();

        this.logger.info(
            `Finished getting albums for genres. Time required: ${timer.elapsedMilliseconds} ms`,
            'AlbumService',
            'getAlbumsForGenres',
        );

        return albums;
    }

    public getMostPlayedAlbums(numberOfAlbums: number): AlbumModel[] {
        const timer = new Timer();
        timer.start();

        const albumDatas: AlbumData[] = this.trackRepository.getMostPlayedAlbumData(this.settings.albumKeyIndex, numberOfAlbums) ?? [];
        const albums: AlbumModel[] = this.createAlbumsFromAlbumData(albumDatas);

        timer.stop();

        this.logger.info(`Finished getting most played albums. Time required: ${timer.elapsedMilliseconds} ms`, 'AlbumService', 'getMostPlayedAlbums');

        return albums;
    }

    private addAlbumsForTrackOrAllArtists(albumKeyIndex: string, artists: string[], albumDatas: AlbumData[]): void {
        const trackArtistsAlbumDatas: AlbumData[] = this.trackRepository.getAlbumDataForTrackArtists(albumKeyIndex, artists) ?? [];

        for (const albumData of trackArtistsAlbumDatas) {
            albumDatas.push(albumData);
        }
    }

    private addAlbumsForAlbumOrAllArtists(albumKeyIndex: string, artists: string[], albumDatas: AlbumData[]): void {
        const albumArtistsAlbumDatas: AlbumData[] = this.trackRepository.getAlbumDataForAlbumArtists(albumKeyIndex, artists) ?? [];

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
