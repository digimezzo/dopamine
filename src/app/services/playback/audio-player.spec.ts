import { IMock, Mock } from 'typemoq';
import { Logger } from '../../common/logger';
import { AudioPlayer } from './audio-player';
import { BaseAudioPlayer } from './base-audio-player';

describe('AudioPlayer', () => {
    let player: BaseAudioPlayer;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        loggerMock = Mock.ofType<Logger>();

        player = new AudioPlayer(loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(player).toBeDefined();
        });

        it('should define playbackFinished$', () => {
            // Arrange

            // Act

            // Assert
            expect(player.playbackFinished$).toBeDefined();
        });

        it('should define progressSeconds', () => {
            // Arrange

            // Act

            // Assert
            expect(player.progressSeconds).toBeDefined();
        });

        it('should define totalSeconds', () => {
            // Arrange

            // Act

            // Assert
            expect(player.totalSeconds).toBeDefined();
        });

        it('should define play', () => {
            // Arrange

            // Act

            // Assert
            expect(player.play).toBeDefined();
        });

        it('should define stop', () => {
            // Arrange

            // Act

            // Assert
            expect(player.stop).toBeDefined();
        });

        it('should define pause', () => {
            // Arrange

            // Act

            // Assert
            expect(player.pause).toBeDefined();
        });

        it('should define resume', () => {
            // Arrange

            // Act

            // Assert
            expect(player.resume).toBeDefined();
        });

        it('should define setVolume', () => {
            // Arrange

            // Act

            // Assert
            expect(player.setVolume).toBeDefined();
        });

        it('should define mute', () => {
            // Arrange

            // Act

            // Assert
            expect(player.mute).toBeDefined();
        });

        it('should define unMute', () => {
            // Arrange

            // Act

            // Assert
            expect(player.unMute).toBeDefined();
        });

        it('should define skipToSeconds', () => {
            // Arrange

            // Act

            // Assert
            expect(player.skipToSeconds).toBeDefined();
        });
    });
});
