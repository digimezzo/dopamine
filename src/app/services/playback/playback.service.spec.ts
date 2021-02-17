import { IMock, Mock } from 'typemoq';
import { BaseAudioPlayer } from '../../core/audio/base-audio-player';
import { PlaybackService } from './playback.service';

describe('PlaybackService', () => {
    let audioPlayerMock: IMock<BaseAudioPlayer>;
    let service: PlaybackService;

    beforeEach(() => {
        audioPlayerMock = Mock.ofType<BaseAudioPlayer>();
        service = new PlaybackService(audioPlayerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });

        it('should initialize canPause as false', () => {
            // Arrange

            // Act

            // Assert
            expect(service.canPause).toBeFalsy();
        });

        it('should initialize canResume as false', () => {
            // Arrange

            // Act

            // Assert
            expect(service.canResume).toBeTruthy();
        });

        it('should initialize progressPercent as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(service.progressPercent).toEqual(0);
        });
    });
});
