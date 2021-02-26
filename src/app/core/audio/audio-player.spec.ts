import { AudioPlayer } from './audio-player';

describe('AudioPlayer', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(player).toBeDefined();
        });

        it('should define playBackFinished$', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.playBackFinished$).toBeDefined();
        });

        it('should define progressSeconds', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.progressSeconds).toBeDefined();
        });

        it('should define totalSeconds', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.totalSeconds).toBeDefined();
        });

        it('should define play', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.play).toBeDefined();
        });

        it('should define stop', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.stop).toBeDefined();
        });

        it('should define pause', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.pause).toBeDefined();
        });

        it('should define resume', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.resume).toBeDefined();
        });

        it('should define setVolume', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.setVolume).toBeDefined();
        });

        it('should define mute', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.mute).toBeDefined();
        });

        it('should define unMute', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.unMute).toBeDefined();
        });

        it('should define skipToSeconds', () => {
            // Arrange

            // Act
            const player: AudioPlayer = new AudioPlayer();

            // Assert
            expect(player.skipToSeconds).toBeDefined();
        });
    });
});
