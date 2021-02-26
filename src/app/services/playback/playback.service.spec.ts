import { IMock, Mock } from 'typemoq';
import { BaseAudioPlayer } from '../../core/audio/base-audio-player';
import { Logger } from '../../core/logger';
import { PlaybackService } from './playback.service';

describe('PlaybackService', () => {
    let audioPlayerMock: IMock<BaseAudioPlayer>;
    let loggerMock: IMock<Logger>;
    let service: PlaybackService;

    beforeEach(() => {
        audioPlayerMock = Mock.ofType<BaseAudioPlayer>();
        loggerMock = Mock.ofType<Logger>();
        service = new PlaybackService(audioPlayerMock.object, loggerMock.object);
    });

    // describe('constructor', () => {
    //     it('should create', () => {
    //         // Arrange

    //         // Act

    //         // Assert
    //         expect(service).toBeDefined();
    //     });

    //     it('should initialize canPause as false', () => {
    //         // Arrange

    //         // Act

    //         // Assert
    //         expect(service.canPause).toBeFalsy();
    //     });

    //     it('should initialize canResume as false', () => {
    //         // Arrange

    //         // Act

    //         // Assert
    //         expect(service.canResume).toBeTruthy();
    //     });

    //     it('should initialize progressPercent as 0', () => {
    //         // Arrange

    //         // Act

    //         // Assert
    //         expect(service.progressSeconds).toEqual(0);
    //     });
    // });
});
