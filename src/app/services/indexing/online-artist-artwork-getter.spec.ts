import { IMock, It, Mock } from 'typemoq';
import { LastfmArtist } from '../../common/api/lastfm/lastfm-artist';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { OnlineArtistArtworkGetter } from './online-artist-artwork-getter';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';
import { OnlineArtistImageGetter } from '../artist-information/online-artist-image-getter';
import { Constants } from '../../common/application/constants';
import { MusicBrainzApi } from '../../common/api/musicbrainz/musicbrainz.api';

const artist = 'metallica';
const expectedArtistArtwork: Buffer = Buffer.from([1, 2, 3]);
const imageUrl = 'https://images.com/image.png';

describe('OnlineArtistArtworkGetter', () => {
    let onlineArtistImageGetter: IMock<OnlineArtistImageGetter>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let lastfmApiMock: IMock<LastfmApi>;
    let musicBrainzApi: IMock<MusicBrainzApi>;
    let loggerMock: IMock<Logger>;
    let onlineArtistArtworkGetter: OnlineArtistArtworkGetter;
    let lastfmArtist: LastfmArtist;

    beforeEach(() => {
        onlineArtistImageGetter = Mock.ofType<OnlineArtistImageGetter>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        lastfmApiMock = Mock.ofType<LastfmApi>();
        musicBrainzApi = Mock.ofType<MusicBrainzApi>();
        loggerMock = Mock.ofType<Logger>();

        onlineArtistArtworkGetter = new OnlineArtistArtworkGetter(
            onlineArtistImageGetter.object,
            imageProcessorMock.object,
            lastfmApiMock.object,
            musicBrainzApi.object,
            loggerMock.object,
        );

        lastfmArtist = new LastfmArtist();
        lastfmArtist.musicBrainzId = '123';
    });

    describe('getOnlineArtistArtworkAsync', () => {
        it('should find artist image via last.fm API', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.getArtistInfoAsync(It.isAnyString(), false, 'EN')).returns(() => Promise.resolve(lastfmArtist));
            onlineArtistImageGetter
                .setup((x) => x.getArtistImageAsync(lastfmArtist.musicBrainzId))
                .returns(() => Promise.resolve(imageUrl));
            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync(It.isAnyString()))
                .returns(() => Promise.resolve(expectedArtistArtwork));

            // Act
            const actualArtistArtwork: Buffer | undefined = await onlineArtistArtworkGetter.getOnlineArtworkAsync(artist);

            // Assert
            expect(actualArtistArtwork).toEqual(expectedArtistArtwork);
        });

        it('should use MusicBrainz API as fallback', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.getArtistInfoAsync(It.isAnyString(), false, 'EN')).returns(() => Promise.resolve(lastfmArtist));
            onlineArtistImageGetter.setup((x) => x.getArtistImageAsync(lastfmArtist.musicBrainzId)).returns(() => Promise.resolve(''));
            musicBrainzApi
                .setup((x) => x.getMusicBrainzIdAsync(It.isAnyString()))
                .returns(() => Promise.resolve(lastfmArtist.musicBrainzId));
            onlineArtistImageGetter
                .setup((x) => x.getArtistImageAsync(lastfmArtist.musicBrainzId))
                .returns(() => Promise.resolve(imageUrl));
            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync(It.isAnyString()))
                .returns(() => Promise.resolve(expectedArtistArtwork));

            // Act
            const actualArtistArtwork: Buffer | undefined = await onlineArtistArtworkGetter.getOnlineArtworkAsync(artist);

            // Assert
            expect(actualArtistArtwork).toEqual(expectedArtistArtwork);
        });

        it('should return empty image if no image was found', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.getArtistInfoAsync(It.isAnyString(), false, 'EN')).returns(() => Promise.resolve(lastfmArtist));
            onlineArtistImageGetter.setup((x) => x.getArtistImageAsync(lastfmArtist.musicBrainzId)).returns(() => Promise.resolve(''));
            musicBrainzApi.setup((x) => x.getMusicBrainzIdAsync(It.isAnyString())).returns(() => Promise.resolve(''));

            // Act
            const actualArtistArtwork: Buffer | undefined = await onlineArtistArtworkGetter.getOnlineArtworkAsync(artist);

            // Assert
            expect(actualArtistArtwork).toEqual(Constants.emptyImageBuffer);
        });

        it('should return undefined if getting online artist info throws error', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.getArtistInfoAsync(It.isAnyString(), false, 'EN')).throws(new Error('An error occurred'));

            // Act
            const actualArtistArtwork: Buffer | undefined = await onlineArtistArtworkGetter.getOnlineArtworkAsync(artist);

            // Assert
            expect(actualArtistArtwork).toBeUndefined();
        });

        it('should return undefined if downloading image throws error', async () => {
            // Arrange
            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync(imageUrl))
                .returns(() => Promise.resolve(expectedArtistArtwork));
            onlineArtistImageGetter
                .setup((x) => x.getResizedArtistImageAsync(It.isAnyString(), It.isAnyNumber()))
                .throws(new Error('An error occurred'));

            // Act
            const actualArtistArtwork: Buffer | undefined = await onlineArtistArtworkGetter.getOnlineArtworkAsync(artist);

            // Assert
            expect(actualArtistArtwork).toBeUndefined();
        });

        it('should return undefined if converting file to data throws error', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.getArtistInfoAsync(It.isAnyString(), false, 'EN')).returns(() => Promise.resolve(lastfmArtist));
            onlineArtistImageGetter
                .setup((x) => x.getArtistImageAsync(lastfmArtist.musicBrainzId))
                .returns(() => Promise.resolve(imageUrl));
            imageProcessorMock.setup((x) => x.convertOnlineImageToBufferAsync(It.isAnyString())).throws(new Error('An error occurred'));

            // Act
            const actualArtistArtwork: Buffer | undefined = await onlineArtistArtworkGetter.getOnlineArtworkAsync(artist);

            // Assert
            expect(actualArtistArtwork).toBeUndefined();
        });
    });
});
