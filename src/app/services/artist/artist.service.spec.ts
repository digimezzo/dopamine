import { IMock, Mock } from 'typemoq';
import { ArtistModel } from './artist-model';
import { ArtistType } from './artist-type';
import { ArtistService } from './artist.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { ArtistData } from '../../data/entities/artist-data';
import { ArtistSplitter } from './artist-splitter';
import { SettingsBase } from '../../common/settings/settings.base';
import { SettingsMock } from '../../testing/settings-mock';
import { Logger } from '../../common/logger';

describe('ArtistService', () => {
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let settingsMock: SettingsBase;
    let artistSplitter: ArtistSplitter;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        loggerMock = Mock.ofType<Logger>();
        settingsMock = new SettingsMock();
        settingsMock.artistSplitSeparators = '';
        settingsMock.artistSplitExceptions = '';
    });

    function createService(): ArtistService {
        artistSplitter = new ArtistSplitter(translatorServiceMock.object, settingsMock);

        return new ArtistService(artistSplitter, trackRepositoryMock.object, loggerMock.object);
    }

    function createArtistModel(artist: string): ArtistModel {
        return new ArtistModel(artist, translatorServiceMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Act
            const service: ArtistService = createService();

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

            const service: ArtistService = createService();

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

            const service: ArtistService = createService();

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

            const service: ArtistService = createService();

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

    describe('getSourceArtists', () => {
        it('should get the source artists for a given list of artists', () => {
            // Arrange
            let artistDatas: ArtistData[] = [
                new ArtistData(';Artist1;'),
                new ArtistData(';artist1;'),
                new ArtistData(';Artist2;'),
                new ArtistData(';Artist1 ft. Artist2 feat. Artist3;'),
                new ArtistData(';artist1 FT. artist2 & Artist3;'),
                new ArtistData(';Artist2 ft. Artist3 & Artist4;'),
                new ArtistData(';artist4;'),
                new ArtistData(';Artist3 & Artist5;'),
                new ArtistData(';Artist5 | Artist6;'),
                new ArtistData(';Artist6 | Artist7;'),
                new ArtistData(';;'),
                new ArtistData(';Drift;'),
                new ArtistData(';Driftwood;'),
            ];

            settingsMock.artistSplitSeparators = '[ft.][feat.][&][|]';
            settingsMock.artistSplitExceptions = '[Artist2 & Artist3][Artist6 | Artist7]';
            trackRepositoryMock.setup((x) => x.getTrackArtistData()).returns(() => artistDatas);

            const service: ArtistService = createService();

            const artists = service.getArtists(ArtistType.trackArtists);

            // Act
            const sourceArtists1: string[] = service.getSourceArtists([createArtistModel('Artist1')]);
            const sourceArtists2: string[] = service.getSourceArtists([createArtistModel('Artist2')]);
            const sourceArtists3: string[] = service.getSourceArtists([createArtistModel('Artist3')]);
            const sourceArtists4: string[] = service.getSourceArtists([createArtistModel('Artist2 & Artist3')]);
            const sourceArtists5: string[] = service.getSourceArtists([createArtistModel('Artist4')]);
            const sourceArtists6: string[] = service.getSourceArtists([createArtistModel('Artist5')]);
            const sourceArtists7: string[] = service.getSourceArtists([createArtistModel('Artist6')]);
            const sourceArtists8: string[] = service.getSourceArtists([createArtistModel('Artist6 | Artist7')]);
            const sourceArtists9: string[] = service.getSourceArtists([createArtistModel('Drift')]);
            const sourceArtists10: string[] = service.getSourceArtists([createArtistModel('Driftwood')]);

            // Assert
            expect(sourceArtists1.length).toEqual(4);
            expect(sourceArtists1[0]).toEqual('Artist1');
            expect(sourceArtists1[1]).toEqual('artist1');
            expect(sourceArtists1[2]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(sourceArtists1[3]).toEqual('artist1 FT. artist2 & Artist3');

            expect(sourceArtists2.length).toEqual(4);
            expect(sourceArtists2[0]).toEqual('Artist2');
            expect(sourceArtists2[1]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(sourceArtists2[2]).toEqual('artist1 FT. artist2 & Artist3');
            expect(sourceArtists2[3]).toEqual('Artist2 ft. Artist3 & Artist4');

            expect(sourceArtists3.length).toEqual(4);
            expect(sourceArtists3[0]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(sourceArtists3[1]).toEqual('artist1 FT. artist2 & Artist3');
            expect(sourceArtists3[2]).toEqual('Artist2 ft. Artist3 & Artist4');
            expect(sourceArtists3[3]).toEqual('Artist3 & Artist5');

            expect(sourceArtists4.length).toEqual(1);
            expect(sourceArtists4[0]).toEqual('artist1 FT. artist2 & Artist3');

            expect(sourceArtists5.length).toEqual(2);
            expect(sourceArtists5[0]).toEqual('Artist2 ft. Artist3 & Artist4');
            expect(sourceArtists5[1]).toEqual('artist4');

            expect(sourceArtists6.length).toEqual(2);
            expect(sourceArtists6[0]).toEqual('Artist3 & Artist5');
            expect(sourceArtists6[1]).toEqual('Artist5 | Artist6');

            expect(sourceArtists7.length).toEqual(2);
            expect(sourceArtists7[0]).toEqual('Artist5 | Artist6');
            expect(sourceArtists7[1]).toEqual('Artist6 | Artist7');

            expect(sourceArtists8.length).toEqual(1);
            expect(sourceArtists8[0]).toEqual('Artist6 | Artist7');

            expect(sourceArtists9.length).toEqual(1);
            expect(sourceArtists9[0]).toEqual('Drift');

            expect(sourceArtists10.length).toEqual(1);
            expect(sourceArtists10[0]).toEqual('Driftwood');
        });
    });
});
