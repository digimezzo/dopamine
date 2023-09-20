import { IMock, Mock } from 'typemoq';
import { FanartApi } from '../../common/api/fanart/fanart-api';
import { LastfmApi } from '../../common/api/lastfm/lastfm-api';
import { LastfmArtist } from '../../common/api/lastfm/lastfm-artist';
import { LastfmBiography } from '../../common/api/lastfm/lastfm-biography';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { BaseDesktop } from '../../common/io/base-desktop';
import { Logger } from '../../common/logger';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { ArtistInformation } from './artist-information';
import { ArtistInformationFactory } from './artist-information-factory';
import { ArtistInformationService } from './artist-information.service';
import { BaseArtistInformationService } from './base-artist-information.service';

describe('ArtistInformationService', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let artistInformationFactoryMock: IMock<ArtistInformationFactory>;
    let lastfmApiMock: IMock<LastfmApi>;
    let fanartApiMock: IMock<FanartApi>;
    let loggerMock: IMock<Logger>;
    let dateTimeMock: IMock<DateTime>;

    function createService(): BaseArtistInformationService {
        return new ArtistInformationService(
            translatorServiceMock.object,
            artistInformationFactoryMock.object,
            lastfmApiMock.object,
            fanartApiMock.object,
            loggerMock.object
        );
    }

    function createTrackModel(artist: string): TrackModel {
        const track: Track = new Track('path');
        track.artists = `;${artist};`;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
    }

    function createGermanTaylorSwiftArtist(): LastfmArtist {
        const lastfmArtist = new LastfmArtist();
        lastfmArtist.name = 'Taylor Swift';
        lastfmArtist.musicBrainzId = '20244d07-534f-4eff-b4d4-930878889970';
        lastfmArtist.url = 'TaylorSwiftUrl';
        lastfmArtist.similarArtists = createSimilarLastfmArtists();

        const biography = new LastfmBiography();
        biography.content = 'German biography';
        lastfmArtist.biography = biography;

        return lastfmArtist;
    }

    function createEnglishTaylorSwiftArtist(): LastfmArtist {
        const lastfmArtist = new LastfmArtist();
        lastfmArtist.name = 'Taylor Swift';
        lastfmArtist.musicBrainzId = '20244d07-534f-4eff-b4d4-930878889970';
        lastfmArtist.url = 'TaylorSwiftUrl';
        lastfmArtist.similarArtists = createSimilarLastfmArtists();

        const biography = new LastfmBiography();
        biography.content = 'English biography';
        lastfmArtist.biography = biography;

        return lastfmArtist;
    }

    function createSimilarLastfmArtists(): LastfmArtist[] {
        const similarLastfmArtists: LastfmArtist[] = [];

        similarLastfmArtists.push(createOliviaRodrigoArtist());
        similarLastfmArtists.push(createGracieAbramsArtist());

        return similarLastfmArtists;
    }

    function createOliviaRodrigoArtist(): LastfmArtist {
        const lastfmArtist = new LastfmArtist();
        lastfmArtist.name = 'Olivia Rodrigo';
        lastfmArtist.musicBrainzId = '6925db17-f35e-42f3-a4eb-84ee6bf5d4b0';
        lastfmArtist.url = 'OliviaRodrigoUrl';

        const biography = new LastfmBiography();
        biography.content = 'English biography';
        lastfmArtist.biography = biography;

        return lastfmArtist;
    }

    function createGracieAbramsArtist(): LastfmArtist {
        const lastfmArtist = new LastfmArtist();
        lastfmArtist.name = 'Gracie Abrams';
        lastfmArtist.musicBrainzId = 'f7441bc7-d7de-4813-a2fc-31a4033d396d';
        lastfmArtist.url = 'GracieAbramsUrl';

        const biography = new LastfmBiography();
        biography.content = 'English biography';
        lastfmArtist.biography = biography;

        return lastfmArtist;
    }

    function createArtistInformation(biography: string, imageUrl: string): ArtistInformation {
        const desktopMock: IMock<BaseDesktop> = Mock.ofType<BaseDesktop>();

        return new ArtistInformation(desktopMock.object, 'Taylor Swift', 'url', imageUrl, biography);
    }

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        artistInformationFactoryMock = Mock.ofType<ArtistInformationFactory>();
        lastfmApiMock = Mock.ofType<LastfmApi>();
        fanartApiMock = Mock.ofType<FanartApi>();
        loggerMock = Mock.ofType<Logger>();
        dateTimeMock = Mock.ofType<DateTime>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const service: BaseArtistInformationService = createService();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('getArtistInformationAsync', () => {
        it('should return empty ArtistInformation when track is undefined', async () => {
            // Arrange
            const service: BaseArtistInformationService = createService();

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(undefined);

            // Assert
            expect(artist.isEmpty).toBeTruthy();
        });

        it('should return empty ArtistInformation when track.rawFirstArtist is empty', async () => {
            // Arrange
            const service: BaseArtistInformationService = createService();
            const trackModel: TrackModel = createTrackModel('');

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.isEmpty).toBeTruthy();
        });

        it('should return empty ArtistInformation when Last.fm returns undefined', async () => {
            // Arrange
            const service: BaseArtistInformationService = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE')).returns(async () => undefined);
            fanartApiMock
                .setup((x) => x.getArtistThumbnailAsync('20244d07-534f-4eff-b4d4-930878889970'))
                .returns(async () => 'TaylorSwiftImageUrl');

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.isEmpty).toBeTruthy();
        });

        it('should return non-empty ArtistInformation when Last.fm returns artist', async () => {
            // Arrange
            const service: BaseArtistInformationService = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE'))
                .returns(async () => createGermanTaylorSwiftArtist());

            fanartApiMock
                .setup((x) => x.getArtistThumbnailAsync('20244d07-534f-4eff-b4d4-930878889970'))
                .returns(async () => 'TaylorSwiftImageUrl');

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'German biography'))
                .returns(() => createArtistInformation('German biography', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.isEmpty).toBeFalsy();
        });

        it('should return localized biography when available', async () => {
            // Arrange
            const service: BaseArtistInformationService = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE'))
                .returns(async () => createGermanTaylorSwiftArtist());

            fanartApiMock
                .setup((x) => x.getArtistThumbnailAsync('20244d07-534f-4eff-b4d4-930878889970'))
                .returns(async () => 'TaylorSwiftImageUrl');

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'German biography'))
                .returns(() => createArtistInformation('German biography', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.biography).toEqual('German biography');
        });

        it('should return English biography when localized biography not available', async () => {
            // Arrange
            const service: BaseArtistInformationService = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE')).returns(async () => undefined);
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'EN'))
                .returns(async () => createEnglishTaylorSwiftArtist());

            fanartApiMock
                .setup((x) => x.getArtistThumbnailAsync('20244d07-534f-4eff-b4d4-930878889970'))
                .returns(async () => 'TaylorSwiftImageUrl');

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'English biography'))
                .returns(() => createArtistInformation('English biography', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.biography).toEqual('English biography');
        });

        it('should return fanart artist image url when no error', async () => {
            // Arrange
            const service: BaseArtistInformationService = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE')).returns(async () => undefined);
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'EN'))
                .returns(async () => createEnglishTaylorSwiftArtist());

            fanartApiMock
                .setup((x) => x.getArtistThumbnailAsync('20244d07-534f-4eff-b4d4-930878889970'))
                .returns(async () => 'TaylorSwiftImageUrl');

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'English biography'))
                .returns(() => createArtistInformation('English biography', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.imageUrl).toEqual('TaylorSwiftImageUrl');
        });

        it('should return empty artist image url when error', async () => {
            // Arrange
            const service: BaseArtistInformationService = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE')).returns(async () => undefined);
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'EN'))
                .returns(async () => createEnglishTaylorSwiftArtist());

            fanartApiMock
                .setup((x) => x.getArtistThumbnailAsync('20244d07-534f-4eff-b4d4-930878889970'))
                .throws(new Error('An error occurred'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', '', 'English biography'))
                .returns(() => createArtistInformation('English biography', ''));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.imageUrl).toEqual('');
        });

        it('should return similar artists when no error', async () => {
            // Arrange
            const service: BaseArtistInformationService = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE')).returns(async () => undefined);
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'EN'))
                .returns(async () => createEnglishTaylorSwiftArtist());

            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Olivia Rodrigo', true, 'EN')).returns(async () => createOliviaRodrigoArtist());
            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Gracie Abrams', true, 'EN')).returns(async () => createGracieAbramsArtist());

            fanartApiMock
                .setup((x) => x.getArtistThumbnailAsync('20244d07-534f-4eff-b4d4-930878889970'))
                .returns(async () => 'TaylorSwiftImageUrl');

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'English biography'))
                .returns(() => createArtistInformation('English biography', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.similarArtists.length).toEqual(2);
            expect(artist.similarArtists[0].name).toEqual('Olivia Rodrigo');
            expect(artist.similarArtists[1].name).toEqual('Gracie Abrams');
        });

        it('should return remaining similar artists when a similar artist has an error', async () => {
            // Arrange
            const service: BaseArtistInformationService = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE')).returns(async () => undefined);
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'EN'))
                .returns(async () => createEnglishTaylorSwiftArtist());

            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Olivia Rodrigo', true, 'EN')).throws(new Error('An error occurred'));
            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Gracie Abrams', true, 'EN')).returns(async () => createGracieAbramsArtist());

            fanartApiMock
                .setup((x) => x.getArtistThumbnailAsync('20244d07-534f-4eff-b4d4-930878889970'))
                .returns(async () => 'TaylorSwiftImageUrl');

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'English biography'))
                .returns(() => createArtistInformation('English biography', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.similarArtists.length).toEqual(1);
            expect(artist.similarArtists[0].name).toEqual('Gracie Abrams');
        });
    });
});
