import { Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { BaseMediaSessionProxy } from '../../common/io/base-media-session-proxy';
import { BasePlaybackInformationService } from '../playback-information/base-playback-information.service';
import { PlaybackInformation } from '../playback-information/playback-information';
import { BasePlaybackService } from '../playback/base-playback.service';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseMediaSessionService } from './base-media-session.service';
import { MediaSessionService } from './media-session.service';

describe('MediaSessionService', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let playbackInformationServiceMock: IMock<BasePlaybackInformationService>;
    let mediaSessionProxyMock: IMock<BaseMediaSessionProxy>;
    let settingsMock: any;

    let playingNextTrack: Subject<PlaybackInformation>;
    let playingPreviousTrack: Subject<PlaybackInformation>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        playbackInformationServiceMock = Mock.ofType<BasePlaybackInformationService>();
        mediaSessionProxyMock = Mock.ofType<BaseMediaSessionProxy>();
        settingsMock = { enableMultimediaKeys: false };

        playingNextTrack = new Subject();
        playbackInformationServiceMock.setup((x) => x.playingNextTrack$).returns(() => playingNextTrack.asObservable());

        playingPreviousTrack = new Subject();
        playbackInformationServiceMock.setup((x) => x.playingPreviousTrack$).returns(() => playingPreviousTrack.asObservable());
    });

    function createService(): BaseMediaSessionService {
        return new MediaSessionService(
            playbackServiceMock.object,
            playbackInformationServiceMock.object,
            mediaSessionProxyMock.object,
            settingsMock
        );
    }

    function createPlaybackInformation(): PlaybackInformation {
        const track: Track = new Track('path1');
        track.trackTitle = 'title1';
        track.artists = 'artist1';
        track.albumTitle = 'album1';

        const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
        const dateTimeMock: IMock<DateTime> = Mock.ofType<DateTime>();

        const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);

        const playbackInformation: PlaybackInformation = new PlaybackInformation(trackModel, 'image1');

        return playbackInformation;
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BaseMediaSessionService = createService();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('enableMultimediaKeys', () => {
        it('should set settings.enableMultimediaKeys', () => {
            // Arrange
            const service: BaseMediaSessionService = createService();

            // Act
            service.enableMultimediaKeys = true;

            // Assert
            expect(service.enableMultimediaKeys).toBeTruthy();
        });

        it('should get settings.enableMultimediaKeys', () => {
            // Arrange
            const service: BaseMediaSessionService = createService();
            settingsMock.enableMultimediaKeys = true;

            // Act & Assert
            expect(service.enableMultimediaKeys).toBeTruthy();
        });

        describe('when set to true', () => {
            it('should not clear all multimedia keys handlers', () => {
                // Arrange
                const service: BaseMediaSessionService = createService();

                // Act
                service.enableMultimediaKeys = true;

                // Assert
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('play'), Times.never());
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('pause'), Times.never());
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('previoustrack'), Times.never());
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('nexttrack'), Times.never());
            });

            it('should set all multimedia keys handlers', () => {
                // Arrange
                const service: BaseMediaSessionService = createService();

                // Act
                service.enableMultimediaKeys = true;

                // Assert
                mediaSessionProxyMock.verify((x) => x.setActionHandler('play', It.isAny()), Times.once());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('pause', It.isAny()), Times.once());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('previoustrack', It.isAny()), Times.once());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('nexttrack', It.isAny()), Times.once());
            });

            it('should enable subscriptions so that metadata is set on playing next track', () => {
                // Arrange
                const service: BaseMediaSessionService = createService();

                // Act
                service.enableMultimediaKeys = true;
                playingNextTrack.next(createPlaybackInformation());

                // Assert
                mediaSessionProxyMock.verify((x) => x.setMetadata('title1', 'artist1', 'album1', 'image1'), Times.once());
            });

            it('should enable subscriptions so that metadata is set on previous track', () => {
                // Arrange
                const service: BaseMediaSessionService = createService();

                // Act
                service.enableMultimediaKeys = true;
                playingPreviousTrack.next(createPlaybackInformation());

                // Assert
                mediaSessionProxyMock.verify((x) => x.setMetadata('title1', 'artist1', 'album1', 'image1'), Times.once());
            });
        });

        describe('when set to false', () => {
            it('should clear all multimedia keys handlers', () => {
                // Arrange
                const service: BaseMediaSessionService = createService();

                // Act
                service.enableMultimediaKeys = false;

                // Assert
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('play'), Times.once());
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('pause'), Times.once());
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('previoustrack'), Times.once());
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('nexttrack'), Times.once());
            });

            it('should not set all multimedia keys handlers', () => {
                // Arrange
                const service: BaseMediaSessionService = createService();

                // Act
                service.enableMultimediaKeys = false;

                // Assert
                mediaSessionProxyMock.verify((x) => x.setActionHandler('play', It.isAny()), Times.never());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('pause', It.isAny()), Times.never());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('previoustrack', It.isAny()), Times.never());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('nexttrack', It.isAny()), Times.never());
            });

            it('should disable subscriptions so that metadata is not set on playing next track', () => {
                // Arrange
                const service: BaseMediaSessionService = createService();

                // Act
                service.enableMultimediaKeys = false;
                playingNextTrack.next(createPlaybackInformation());

                // Assert
                mediaSessionProxyMock.verify((x) => x.setMetadata('title1', 'artist1', 'album1', 'image1'), Times.never());
            });

            it('should disable subscriptions so that metadata is not set on playing previous track', () => {
                // Arrange
                const service: BaseMediaSessionService = createService();

                // Act
                service.enableMultimediaKeys = false;
                playingPreviousTrack.next(createPlaybackInformation());

                // Assert
                mediaSessionProxyMock.verify((x) => x.setMetadata('title1', 'artist1', 'album1', 'image1'), Times.never());
            });
        });
    });

    describe('initialize', () => {
        describe('settings.enableMultimediaKeys is true', () => {
            it('should not clear all multimedia keys handlers', () => {
                // Arrange
                settingsMock.enableMultimediaKeys = true;
                const service: BaseMediaSessionService = createService();

                // Act
                service.initialize();

                // Assert
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('play'), Times.never());
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('pause'), Times.never());
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('previoustrack'), Times.never());
                mediaSessionProxyMock.verify((x) => x.clearActionHandler('nexttrack'), Times.never());
            });

            it('should set all multimedia keys handlers', () => {
                // Arrange
                settingsMock.enableMultimediaKeys = true;
                const service: BaseMediaSessionService = createService();

                // Act
                service.initialize();

                // Assert
                mediaSessionProxyMock.verify((x) => x.setActionHandler('play', It.isAny()), Times.once());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('pause', It.isAny()), Times.once());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('previoustrack', It.isAny()), Times.once());
                mediaSessionProxyMock.verify((x) => x.setActionHandler('nexttrack', It.isAny()), Times.once());
            });

            it('should enable subscriptions so that metadata is set on playing next track', async () => {
                // Arrange
                settingsMock.enableMultimediaKeys = true;
                const service: BaseMediaSessionService = createService();

                // Act
                service.initialize();
                playingNextTrack.next(createPlaybackInformation());

                // Assert
                mediaSessionProxyMock.verify((x) => x.setMetadata('title1', 'artist1', 'album1', 'image1'), Times.once());
            });

            it('should enable subscriptions so that metadata is set on playing previous track', () => {
                // Arrange
                settingsMock.enableMultimediaKeys = true;
                const service: BaseMediaSessionService = createService();

                // Act
                service.initialize();
                playingPreviousTrack.next(createPlaybackInformation());

                // Assert
                mediaSessionProxyMock.verify((x) => x.setMetadata('title1', 'artist1', 'album1', 'image1'), Times.once());
            });
        });

        describe('settings.enableMultimediaKeys is false', () => {
            it('should not enable subscriptions so that metadata is set on playing next track', async () => {
                // Arrange
                settingsMock.enableMultimediaKeys = false;
                const service: BaseMediaSessionService = createService();

                // Act
                service.initialize();
                playingNextTrack.next(createPlaybackInformation());

                // Assert
                mediaSessionProxyMock.verify((x) => x.setMetadata('title1', 'artist1', 'album1', 'image1'), Times.never());
            });

            it('should not enable subscriptions so that metadata is set on playing previous track', () => {
                // Arrange
                settingsMock.enableMultimediaKeys = false;
                const service: BaseMediaSessionService = createService();

                // Act
                service.initialize();
                playingPreviousTrack.next(createPlaybackInformation());

                // Assert
                mediaSessionProxyMock.verify((x) => x.setMetadata('title1', 'artist1', 'album1', 'image1'), Times.never());
            });
        });
    });
});
