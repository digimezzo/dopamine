import { IMock, Mock } from 'typemoq';
import { BasePlaybackService } from '../playback/base-playback.service';
import { BasePlaybackInformationService } from '../playback-information/base-playback-information.service';
import { BaseMediaSessionService } from './base-media-session.service';
import { MediaSessionService } from './media-session.service';

describe('MediaSessionService', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let playbackInformationServiceMock: IMock<BasePlaybackInformationService>;

    function createService(): BaseMediaSessionService {
        return new MediaSessionService(
            playbackServiceMock.object,
            playbackInformationServiceMock.object
        );
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        playbackInformationServiceMock = Mock.ofType<BasePlaybackInformationService>();
    });

    describe('constructor', () => {
        it('should create', () => {
          // Arrange

          // Act
          const service: BaseMediaSessionService = createService();

          // Assert
          expect(service).toBeDefined();
        });
    });
});