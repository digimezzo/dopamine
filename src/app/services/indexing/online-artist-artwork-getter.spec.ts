import { IMock, It, Mock } from 'typemoq';
import { LastfmArtist } from '../../common/api/lastfm/lastfm-artist';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { OnlineArtistArtworkGetter } from './online-artist-artwork-getter';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';
import { Constants } from '../../common/application/constants';
import { MusicBrainzApi } from '../../common/api/musicbrainz/musicbrainz.api';
import {FanartApi} from "../../common/api/fanart/fanart.api";

const artist = 'metallica';
const expectedArtistArtwork: Buffer = Buffer.from([1, 2, 3]);
const imageUrl = 'https://images.com/image.png';

describe('OnlineArtistArtworkGetter', () => {
    let fanartApiMock: IMock<FanartApi>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let lastfmApiMock: IMock<LastfmApi>;
    let musicBrainzApiMock: IMock<MusicBrainzApi>;
    let loggerMock: IMock<Logger>;
    let onlineArtistArtworkGetter: OnlineArtistArtworkGetter;
    let lastfmArtist: LastfmArtist;

    beforeEach(() => {
        fanartApiMock = Mock.ofType<FanartApi>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        lastfmApiMock = Mock.ofType<LastfmApi>();
        musicBrainzApiMock = Mock.ofType<MusicBrainzApi>();
        loggerMock = Mock.ofType<Logger>();

        onlineArtistArtworkGetter = new OnlineArtistArtworkGetter(
            fanartApiMock.object,
            imageProcessorMock.object,
            lastfmApiMock.object,
            musicBrainzApiMock.object,
            loggerMock.object,
        );

        lastfmArtist = new LastfmArtist();
        lastfmArtist.musicBrainzId = '123';
    });

    describe('getOnlineArtistArtworkAsync', () => {
        it('should find artist image via last.fm API', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.getArtistInfoAsync(It.isAnyString(), false, 'EN')).returns(() => Promise.resolve(lastfmArtist));
            fanartApiMock.setup((x) => x.getAllArtistThumbnailsAsync(lastfmArtist.musicBrainzId)).returns(() => Promise.resolve([imageUrl]));
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
            musicBrainzApiMock
                .setup((x) => x.getMusicBrainzIdAsync(It.isAnyString()))
                .returns(() => Promise.resolve(lastfmArtist.musicBrainzId));
            lastfmApiMock.setup((x) => x.getArtistInfoAsync(artist, false, 'EN')).returns(() => Promise.resolve(lastfmArtist));
            fanartApiMock.setup((x) => x.getAllArtistThumbnailsAsync(lastfmArtist.musicBrainzId)).returns(() => Promise.resolve([]));

            const alternativeMusicBrainzId = '456';
            musicBrainzApiMock.setup((x) => x.getMusicBrainzIdAsync(It.isAnyString())).returns(() => Promise.resolve(alternativeMusicBrainzId));
            fanartApiMock.setup((x) => x.getAllArtistThumbnailsAsync(alternativeMusicBrainzId)).returns(() => Promise.resolve([imageUrl]));
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
            musicBrainzApiMock.setup((x) => x.getMusicBrainzIdAsync(It.isAnyString())).returns(() => Promise.resolve(''));
            fanartApiMock.setup((x) => x.getAllArtistThumbnailsAsync(lastfmArtist.musicBrainzId)).returns(() => Promise.resolve(['']));

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

            // Act
            const actualArtistArtwork: Buffer | undefined = await onlineArtistArtworkGetter.getOnlineArtworkAsync(artist);

            // Assert
            expect(actualArtistArtwork).toBeUndefined();
        });

        it('should return undefined if converting file to data throws error', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.getArtistInfoAsync(It.isAnyString(), false, 'EN')).returns(() => Promise.resolve(lastfmArtist));
            imageProcessorMock.setup((x) => x.convertOnlineImageToBufferAsync(It.isAnyString())).throws(new Error('An error occurred'));
            imageProcessorMock.setup((x) => x.convertOnlineImageToBufferAsync(imageUrl)).throws(new Error('An error occurred'));

            // Act
            const actualArtistArtwork: Buffer | undefined = await onlineArtistArtworkGetter.getOnlineArtworkAsync(artist);

            // Assert
            expect(actualArtistArtwork).toBeUndefined();
        });
    });
});
