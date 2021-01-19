import assert from 'assert';
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
        it('should create', async () => {
            // Arrange

            // Act

            // Assert
            assert.ok(service);
        });
    });
});
