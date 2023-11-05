import { IMock, Mock } from 'typemoq';
import { Logger } from '../../common/logger';
import { MathExtensions } from '../../common/math-extensions';
import { AudioPlayer } from './audio-player';
import { AudioPlayerBase } from './audio-player.base';

describe('AudioPlayer', () => {
    let player: AudioPlayerBase;
    let mathExtensionsMock: IMock<MathExtensions>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        mathExtensionsMock = Mock.ofType<MathExtensions>();
        loggerMock = Mock.ofType<Logger>();

        player = new AudioPlayer(mathExtensionsMock.object, loggerMock.object);
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
