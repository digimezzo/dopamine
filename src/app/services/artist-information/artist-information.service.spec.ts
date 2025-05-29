import { IMock, It, Mock, Times } from 'typemoq';
import { LastfmArtist } from '../../common/api/lastfm/lastfm-artist';
import { LastfmBiography } from '../../common/api/lastfm/lastfm-biography';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { TrackModel } from '../track/track-model';
import { ArtistInformation } from './artist-information';
import { ArtistInformationFactory } from './artist-information-factory';
import { ArtistInformationService } from './artist-information.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';
import { ArtistInformationServiceBase } from './artist-information.service.base';
import { Track } from '../../data/entities/track';
import { DesktopBase } from '../../common/io/desktop.base';
import { OnlineArtistImageGetter } from './online-artist-image-getter';
import { SettingsMock } from '../../testing/settings-mock';

describe('ArtistInformationService', () => {
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let artistInformationFactoryMock: IMock<ArtistInformationFactory>;
    let onlineArtistImageGetterMock: IMock<OnlineArtistImageGetter>;
    let lastfmApiMock: IMock<LastfmApi>;
    let loggerMock: IMock<Logger>;
    let dateTimeMock: IMock<DateTime>;
    let settingsMock: any;

    function createService(): ArtistInformationServiceBase {
        return new ArtistInformationService(
            translatorServiceMock.object,
            artistInformationFactoryMock.object,
            onlineArtistImageGetterMock.object,
            lastfmApiMock.object,
            loggerMock.object,
        );
    }

    function createTrackModel(artist: string): TrackModel {
        const track: Track = new Track('path');
        track.artists = `;${artist};`;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
    }

    function createArtistWithoutBiography(): LastfmArtist {
        const lastfmArtist = new LastfmArtist();
        lastfmArtist.name = 'Taylor Swift';
        lastfmArtist.musicBrainzId = '20244d07-534f-4eff-b4d4-930878889970';
        lastfmArtist.url = 'TaylorSwiftUrl';
        lastfmArtist.similarArtists = createSimilarLastfmArtists();

        return lastfmArtist;
    }

    function createArtistWithGermanBiography(): LastfmArtist {
        const lastfmArtist = createArtistWithoutBiography();

        const biography = new LastfmBiography();
        biography.content = 'German biography';
        lastfmArtist.biography = biography;

        return lastfmArtist;
    }

    function createArtistWithEnglishBiography(): LastfmArtist {
        const lastfmArtist = createArtistWithoutBiography();

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

    function createArtistInformation(biography: string, url: string, imageUrl: string): ArtistInformation {
        const desktopMock: IMock<DesktopBase> = Mock.ofType<DesktopBase>();

        return new ArtistInformation(desktopMock.object, 'Taylor Swift', url, imageUrl, biography);
    }

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        artistInformationFactoryMock = Mock.ofType<ArtistInformationFactory>();
        onlineArtistImageGetterMock = Mock.ofType<OnlineArtistImageGetter>();
        lastfmApiMock = Mock.ofType<LastfmApi>();
        loggerMock = Mock.ofType<Logger>();
        dateTimeMock = Mock.ofType<DateTime>();
        settingsMock = new SettingsMock();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const service: ArtistInformationServiceBase = createService();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('getQuickArtistInformation', () => {
        it('should return empty ArtistInformation when track is undefined', () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();

            // Act
            const artist: ArtistInformation = service.getQuickArtistInformation(undefined);

            // Assert
            expect(artist.name).toEqual('');
            expect(artist.url).toEqual('');
            expect(artist.imageUrl).toEqual('');
            expect(artist.biography).toEqual('');
        });

        it('should return ArtistInformation containing artist name when track is not undefined', () => {
            // Arrange
            const trackModel: TrackModel = createTrackModel('Madonna');
            artistInformationFactoryMock
                .setup((x) => x.create('Madonna', '', '', ''))
                .returns(() => new ArtistInformation(undefined, 'Madonna', '', '', ''));
            const service: ArtistInformationServiceBase = createService();

            // Act
            const artist: ArtistInformation = service.getQuickArtistInformation(trackModel);

            // Assert
            expect(artist.name).toEqual('Madonna');
        });
    });

    describe('getArtistInformationAsync', () => {
        it('should return empty ArtistInformation when track is undefined', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(undefined);

            // Assert
            expect(artist.name).toEqual('');
            expect(artist.url).toEqual('');
            expect(artist.imageUrl).toEqual('');
            expect(artist.biography).toEqual('');
        });

        it('should return empty ArtistInformation when track.rawFirstArtist is empty', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('');

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.name).toEqual('');
            expect(artist.url).toEqual('');
            expect(artist.imageUrl).toEqual('');
            expect(artist.biography).toEqual('');
        });

        it('should return non-empty ArtistInformation when Last.fm returns artist', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE'))
                .returns(() => Promise.resolve(createArtistWithGermanBiography()));

            onlineArtistImageGetterMock
                .setup((x) => x.getResizedArtistImageAsync('20244d07-534f-4eff-b4d4-930878889970', 300))
                .returns(() => Promise.resolve('TaylorSwiftImageUrl'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'German biography'))
                .returns(() => createArtistInformation('German biography', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.name).toEqual('Taylor Swift');
            expect(artist.url).toEqual('TaylorSwiftUrl');
            expect(artist.imageUrl).toEqual('TaylorSwiftImageUrl');
            expect(artist.biography).toEqual('German biography');
        });

        it('should return localized biography when available', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE'))
                .returns(() => Promise.resolve(createArtistWithGermanBiography()));

            onlineArtistImageGetterMock
                .setup((x) => x.getResizedArtistImageAsync('20244d07-534f-4eff-b4d4-930878889970', 300))
                .returns(() => Promise.resolve('TaylorSwiftImageUrl'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'German biography'))
                .returns(() => createArtistInformation('German biography', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.biography).toEqual('German biography');
        });

        it('should return English biography when localized biography not available', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE'))
                .returns(() => Promise.resolve(createArtistWithoutBiography()));
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'EN'))
                .returns(() => Promise.resolve(createArtistWithEnglishBiography()));

            onlineArtistImageGetterMock
                .setup((x) => x.getResizedArtistImageAsync('20244d07-534f-4eff-b4d4-930878889970', 300))
                .returns(() => Promise.resolve('TaylorSwiftImageUrl'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'English biography'))
                .returns(() => createArtistInformation('English biography', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.biography).toEqual('English biography');
        });

        it('should return fanart artist image url when no error', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'EN');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'EN'))
                .returns(() => Promise.resolve(createArtistWithEnglishBiography()));

            onlineArtistImageGetterMock
                .setup((x) => x.getResizedArtistImageAsync('20244d07-534f-4eff-b4d4-930878889970', 300))
                .returns(() => Promise.resolve('TaylorSwiftImageUrl'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'English biography'))
                .returns(() => createArtistInformation('English biography', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.imageUrl).toEqual('TaylorSwiftImageUrl');
        });

        it('should return empty artist image url when error', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'EN');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'EN'))
                .returns(() => Promise.resolve(createArtistWithEnglishBiography()));

            onlineArtistImageGetterMock
                .setup((x) => x.getResizedArtistImageAsync('20244d07-534f-4eff-b4d4-930878889970', 300))
                .throws(new Error('An error occurred'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', '', 'English biography'))
                .returns(() => createArtistInformation('English biography', 'TaylorSwiftUrl', ''));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.imageUrl).toEqual('');
        });

        it('should return similar artists when no error', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'EN');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'EN'))
                .returns(() => Promise.resolve(createArtistWithEnglishBiography()));

            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Olivia Rodrigo', true, 'EN'))
                .returns(() => Promise.resolve(createOliviaRodrigoArtist()));
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Gracie Abrams', true, 'EN'))
                .returns(() => Promise.resolve(createGracieAbramsArtist()));

            onlineArtistImageGetterMock
                .setup((x) => x.getResizedArtistImageAsync('20244d07-534f-4eff-b4d4-930878889970', 300))
                .returns(() => Promise.resolve('TaylorSwiftImageUrl'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'English biography'))
                .returns(() => createArtistInformation('English biography', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.similarArtists.length).toEqual(2);
            expect(artist.similarArtists[0].name).toEqual('Olivia Rodrigo');
            expect(artist.similarArtists[1].name).toEqual('Gracie Abrams');
        });

        it('should return remaining similar artists when a similar artist has an error', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'EN');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'EN'))
                .returns(() => Promise.resolve(createArtistWithEnglishBiography()));

            lastfmApiMock.setup((x) => x.getArtistInfoAsync('Olivia Rodrigo', true, 'EN')).throws(new Error('An error occurred'));
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Gracie Abrams', true, 'EN'))
                .returns(() => Promise.resolve(createGracieAbramsArtist()));

            onlineArtistImageGetterMock
                .setup((x) => x.getResizedArtistImageAsync('20244d07-534f-4eff-b4d4-930878889970', 300))
                .returns(() => Promise.resolve('TaylorSwiftImageUrl'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'English biography'))
                .returns(() => createArtistInformation('English biography', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            expect(artist.similarArtists.length).toEqual(1);
            expect(artist.similarArtists[0].name).toEqual('Gracie Abrams');
        });

        it('should return ArtistInformation from Last.fm when there is no cached artist information', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE'))
                .returns(() => Promise.resolve(createArtistWithGermanBiography()));

            onlineArtistImageGetterMock
                .setup((x) => x.getResizedArtistImageAsync('20244d07-534f-4eff-b4d4-930878889970', 300))
                .returns(() => Promise.resolve('TaylorSwiftImageUrl'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'German biography'))
                .returns(() => createArtistInformation('German biography', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl'));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            lastfmApiMock.verify((x) => x.getArtistInfoAsync(trackModel.rawFirstArtist, true, 'DE'), Times.once());
            expect(artist.name).toEqual('Taylor Swift');
            expect(artist.url).toEqual('TaylorSwiftUrl');
            expect(artist.imageUrl).toEqual('TaylorSwiftImageUrl');
            expect(artist.biography).toEqual('German biography');
        });

        it('should return cached ArtistInformation when there is cached artist information and the artist has not changed', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE'))
                .returns(() => Promise.resolve(createArtistWithGermanBiography()));

            onlineArtistImageGetterMock
                .setup((x) => x.getResizedArtistImageAsync('20244d07-534f-4eff-b4d4-930878889970', 300))
                .returns(() => Promise.resolve('TaylorSwiftImageUrl'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'German biography'))
                .returns(() => createArtistInformation('German biography', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl'));
            await service.getArtistInformationAsync(trackModel);

            lastfmApiMock.reset();

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel);

            // Assert
            lastfmApiMock.verify((x) => x.getArtistInfoAsync(It.isAny(), It.isAny(), It.isAny()), Times.never());
            expect(artist.name).toEqual('Taylor Swift');
            expect(artist.url).toEqual('TaylorSwiftUrl');
            expect(artist.imageUrl).toEqual('TaylorSwiftImageUrl');
            expect(artist.biography).toEqual('German biography');
        });

        it('should return ArtistInformation from Last.fm when there is cached artist information and the artist has changed', async () => {
            // Arrange
            const service: ArtistInformationServiceBase = createService();
            const trackModel: TrackModel = createTrackModel('Taylor Swift');

            translatorServiceMock.setup((x) => x.get('language-code')).returns(() => 'DE');
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Taylor Swift', true, 'DE'))
                .returns(() => Promise.resolve(createArtistWithGermanBiography()));

            onlineArtistImageGetterMock
                .setup((x) => x.getResizedArtistImageAsync('20244d07-534f-4eff-b4d4-930878889970', 300))
                .returns(() => Promise.resolve('TaylorSwiftImageUrl'));

            artistInformationFactoryMock
                .setup((x) => x.create('Taylor Swift', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl', 'German biography'))
                .returns(() => createArtistInformation('German biography', 'TaylorSwiftUrl', 'TaylorSwiftImageUrl'));
            await service.getArtistInformationAsync(trackModel);

            const trackModel2: TrackModel = createTrackModel('Madonna');

            lastfmApiMock.reset();
            lastfmApiMock
                .setup((x) => x.getArtistInfoAsync('Madonna', true, 'DE'))
                .returns(() => Promise.resolve(createArtistWithGermanBiography()));

            // Act
            const artist: ArtistInformation = await service.getArtistInformationAsync(trackModel2);

            // Assert
            lastfmApiMock.verify((x) => x.getArtistInfoAsync(trackModel2.rawFirstArtist, true, 'DE'), Times.once());
            expect(artist.name).toEqual('Taylor Swift');
            expect(artist.url).toEqual('TaylorSwiftUrl');
            expect(artist.imageUrl).toEqual('TaylorSwiftImageUrl');
            expect(artist.biography).toEqual('German biography');
        });
    });
});
