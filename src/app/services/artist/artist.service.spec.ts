import { IMock, Mock } from 'typemoq';
import { ArtistData } from '../../common/data/entities/artist-data';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { ArtistModel } from './artist-model';
import { ArtistType } from './artist-type';
import { ArtistService } from './artist.service';

describe('ArtistService', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let trackRepositoryMock: IMock<BaseTrackRepository>;

    let service: ArtistService;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();

        service = new ArtistService(translatorServiceMock.object, trackRepositoryMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('getArtists', () => {
        it('should get all track artists without duplicates when given ArtistType.trackArtists', () => {
            // Arrange
            const trackArtistDatas: ArtistData[] = [];

            trackArtistDatas.push(new ArtistData(';Aerosmith;'));
            trackArtistDatas.push(new ArtistData(';aerosmith;'));
            trackArtistDatas.push(new ArtistData(';Aerosmith;;Alanis Morissette;'));
            trackArtistDatas.push(new ArtistData(';Alanis Morissette;'));
            trackArtistDatas.push(new ArtistData(';Bon Jovi;'));
            trackArtistDatas.push(new ArtistData(';Bon Jovi;Aerosmith;'));
            trackArtistDatas.push(new ArtistData(';Bon Jovi;Madonna;'));
            trackArtistDatas.push(new ArtistData(';Madonna;'));
            trackArtistDatas.push(new ArtistData(';Metallica;'));
            trackArtistDatas.push(new ArtistData(';Metallica;;Madonna;'));
            trackArtistDatas.push(new ArtistData(';metallica;'));
            trackArtistDatas.push(new ArtistData(';Scorpions;'));

            const albumArtistDatas: ArtistData[] = [];

            albumArtistDatas.push(new ArtistData(';Aerosmith;;Alanis Morissette;'));
            albumArtistDatas.push(new ArtistData(';Alanis Morissette;'));
            albumArtistDatas.push(new ArtistData(';Bon Jovi;'));
            albumArtistDatas.push(new ArtistData(';Bon Jovi;Aerosmith;'));
            albumArtistDatas.push(new ArtistData(';Madonna;'));
            albumArtistDatas.push(new ArtistData(';Megadeth;'));
            albumArtistDatas.push(new ArtistData(';megadeth;'));
            albumArtistDatas.push(new ArtistData(';Rihanna;'));
            albumArtistDatas.push(new ArtistData(';Rihanna;Jennifer Lopez;'));
            albumArtistDatas.push(new ArtistData(';Jennifer Lopez;'));
            albumArtistDatas.push(new ArtistData(';Madonna;;Jennifer Lopez;'));

            trackRepositoryMock.setup((x) => x.getTrackArtistData()).returns(() => trackArtistDatas);
            trackRepositoryMock.setup((x) => x.getAlbumArtistData()).returns(() => albumArtistDatas);

            // Act
            const artists: ArtistModel[] = service.getArtists(ArtistType.trackArtists);

            // Assert
            expect(artists.length).toEqual(6);
            expect(artists[0].displayName).toEqual('Aerosmith');
            expect(artists[1].displayName).toEqual('Alanis Morissette');
            expect(artists[2].displayName).toEqual('Bon Jovi');
            expect(artists[3].displayName).toEqual('Madonna');
            expect(artists[4].displayName).toEqual('Metallica');
            expect(artists[5].displayName).toEqual('Scorpions');
        });

        it('should get all album artists without duplicates when given ArtistType.albumArtists', () => {
            // Arrange
            const trackArtistDatas: ArtistData[] = [];

            trackArtistDatas.push(new ArtistData(';Aerosmith;'));
            trackArtistDatas.push(new ArtistData(';aerosmith;'));
            trackArtistDatas.push(new ArtistData(';Aerosmith;;Alanis Morissette;'));
            trackArtistDatas.push(new ArtistData(';Alanis Morissette;'));
            trackArtistDatas.push(new ArtistData(';Bon Jovi;'));
            trackArtistDatas.push(new ArtistData(';Bon Jovi;Aerosmith;'));
            trackArtistDatas.push(new ArtistData(';Bon Jovi;Madonna;'));
            trackArtistDatas.push(new ArtistData(';Madonna;'));
            trackArtistDatas.push(new ArtistData(';Metallica;'));
            trackArtistDatas.push(new ArtistData(';Metallica;;Madonna;'));
            trackArtistDatas.push(new ArtistData(';metallica;'));
            trackArtistDatas.push(new ArtistData(';Scorpions;'));

            const albumArtistDatas: ArtistData[] = [];

            albumArtistDatas.push(new ArtistData(';Aerosmith;;Alanis Morissette;'));
            albumArtistDatas.push(new ArtistData(';Alanis Morissette;'));
            albumArtistDatas.push(new ArtistData(';Bon Jovi;'));
            albumArtistDatas.push(new ArtistData(';Bon Jovi;Aerosmith;'));
            albumArtistDatas.push(new ArtistData(';Madonna;'));
            albumArtistDatas.push(new ArtistData(';Megadeth;'));
            albumArtistDatas.push(new ArtistData(';megadeth;'));
            albumArtistDatas.push(new ArtistData(';Rihanna;'));
            albumArtistDatas.push(new ArtistData(';Rihanna;Jennifer Lopez;'));
            albumArtistDatas.push(new ArtistData(';Jennifer Lopez;'));
            albumArtistDatas.push(new ArtistData(';Madonna;;Jennifer Lopez;'));

            trackRepositoryMock.setup((x) => x.getTrackArtistData()).returns(() => trackArtistDatas);
            trackRepositoryMock.setup((x) => x.getAlbumArtistData()).returns(() => albumArtistDatas);

            // Act
            const artists: ArtistModel[] = service.getArtists(ArtistType.albumArtists);

            // Assert
            expect(artists.length).toEqual(7);
            expect(artists[0].displayName).toEqual('Aerosmith');
            expect(artists[1].displayName).toEqual('Alanis Morissette');
            expect(artists[2].displayName).toEqual('Bon Jovi');
            expect(artists[3].displayName).toEqual('Madonna');
            expect(artists[4].displayName).toEqual('Megadeth');
            expect(artists[5].displayName).toEqual('Rihanna');
            expect(artists[6].displayName).toEqual('Jennifer Lopez');
        });

        it('should get all track and album artists without duplicates when given ArtistType.allArtists', () => {
            // Arrange
            const trackArtistDatas: ArtistData[] = [];

            trackArtistDatas.push(new ArtistData(';Aerosmith;'));
            trackArtistDatas.push(new ArtistData(';aerosmith;'));
            trackArtistDatas.push(new ArtistData(';Aerosmith;;Alanis Morissette;'));
            trackArtistDatas.push(new ArtistData(';Alanis Morissette;'));
            trackArtistDatas.push(new ArtistData(';Bon Jovi;'));
            trackArtistDatas.push(new ArtistData(';Bon Jovi;Aerosmith;'));
            trackArtistDatas.push(new ArtistData(';Bon Jovi;Madonna;'));
            trackArtistDatas.push(new ArtistData(';Madonna;'));
            trackArtistDatas.push(new ArtistData(';Metallica;'));
            trackArtistDatas.push(new ArtistData(';Metallica;;Madonna;'));
            trackArtistDatas.push(new ArtistData(';metallica;'));
            trackArtistDatas.push(new ArtistData(';Scorpions;'));

            const albumArtistDatas: ArtistData[] = [];

            albumArtistDatas.push(new ArtistData(';Aerosmith;;Alanis Morissette;'));
            albumArtistDatas.push(new ArtistData(';Alanis Morissette;'));
            albumArtistDatas.push(new ArtistData(';Bon Jovi;'));
            albumArtistDatas.push(new ArtistData(';Bon Jovi;Aerosmith;'));
            albumArtistDatas.push(new ArtistData(';Madonna;'));
            albumArtistDatas.push(new ArtistData(';Megadeth;'));
            albumArtistDatas.push(new ArtistData(';megadeth;'));
            albumArtistDatas.push(new ArtistData(';Rihanna;'));
            albumArtistDatas.push(new ArtistData(';Rihanna;Jennifer Lopez;'));
            albumArtistDatas.push(new ArtistData(';Jennifer Lopez;'));
            albumArtistDatas.push(new ArtistData(';Madonna;;Jennifer Lopez;'));

            trackRepositoryMock.setup((x) => x.getTrackArtistData()).returns(() => trackArtistDatas);
            trackRepositoryMock.setup((x) => x.getAlbumArtistData()).returns(() => albumArtistDatas);

            // Act
            const artists: ArtistModel[] = service.getArtists(ArtistType.allArtists);

            // Assert
            expect(artists.length).toEqual(9);
            expect(artists[0].displayName).toEqual('Aerosmith');
            expect(artists[1].displayName).toEqual('Alanis Morissette');
            expect(artists[2].displayName).toEqual('Bon Jovi');
            expect(artists[3].displayName).toEqual('Madonna');
            expect(artists[4].displayName).toEqual('Metallica');
            expect(artists[5].displayName).toEqual('Scorpions');
            expect(artists[6].displayName).toEqual('Megadeth');
            expect(artists[7].displayName).toEqual('Rihanna');
            expect(artists[8].displayName).toEqual('Jennifer Lopez');
        });
    });
});
