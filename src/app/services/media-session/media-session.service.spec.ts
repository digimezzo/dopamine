import { IMock, It, Mock, Times } from 'typemoq';
import { MediaSessionService } from './media-session.service';
import { MediaSessionProxy } from '../../common/io/media-session-proxy';
import { PlaybackInformationFactory } from '../playback-information/playback-information.factory';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { DateTime } from '../../common/date-time';
import { TrackModel } from '../track/track-model';
import { Track } from '../../data/entities/track';
import { PlaybackInformation } from '../playback-information/playback-information';

describe('MediaSessionService', () => {
    let playbackInformationFactoryMock: IMock<PlaybackInformationFactory>;
    let mediaSessionProxyMock: IMock<MediaSessionProxy>;

    beforeEach(() => {
        playbackInformationFactoryMock = Mock.ofType<PlaybackInformationFactory>();
        mediaSessionProxyMock = Mock.ofType<MediaSessionProxy>();
    });

    function createService(): MediaSessionService {
        return new MediaSessionService(playbackInformationFactoryMock.object, mediaSessionProxyMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: MediaSessionService = createService();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('initialize', () => {
        describe('settings.enableMultimediaKeys is true', () => {
            it('should set all multimedia keys handlers', () => {
                // Arrange
                const service: MediaSessionService = createService();

                // Act
                service.initialize();

                // Assert
                mediaSessionProxyMock.verify((x) => x.setActionHandler('play', It.isAny()), Times.once());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('pause', It.isAny()), Times.once());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('previoustrack', It.isAny()), Times.once());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('nexttrack', It.isAny()), Times.once());
            });
        });
    });

    describe('setMetadataAsync', () => {
        it('should set metadata', async () => {
            // Arrange
            const service: MediaSessionService = createService();
            const translatorServiceMock: IMock<TranslatorServiceBase> = Mock.ofType<TranslatorServiceBase>();
            const dateTimeMock: IMock<DateTime> = Mock.ofType<DateTime>();
            let settingsMock: any = {};

            const track: Track = new Track('path1');
            track.trackTitle = 'title1';
            track.artists = 'artist1';
            track.albumTitle = 'album1';
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);

            const playbackInformation: PlaybackInformation = new PlaybackInformation(trackModel, 'image1');

            playbackInformationFactoryMock.setup((x) => x.createAsync(trackModel)).returns(() => Promise.resolve(playbackInformation));

            // Act
            await service.setMetadataAsync(trackModel);

            // Assert
            mediaSessionProxyMock.verify((x) => x.setMetadata('title1', 'artist1', 'album1', 'image1'), Times.once());
        });
    });
});
