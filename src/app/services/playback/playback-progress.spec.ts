import { PlaybackProgress } from './playback-progress';

describe('PlaybackProgress', () => {
    let playbackProgress: PlaybackProgress;

    beforeEach(() => {
        const progressSeconds: number = 20;
        const totalSeconds: number = 120;
        playbackProgress = new PlaybackProgress(progressSeconds, totalSeconds);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(playbackProgress).toBeDefined();
        });

        it('should set progressSeconds', () => {
            // Arrange

            // Act

            // Assert
            expect(playbackProgress.progressSeconds).toEqual(20);
        });

        it('should set totalSeconds', () => {
            // Arrange

            // Act

            // Assert
            expect(playbackProgress.totalSeconds).toEqual(120);
        });
    });

    describe('timeRemainingInMilliSeconds', () => {
        it('should return time remaining in seconds', () => {
            // Arrange

            // Act

            // Assert
            expect(playbackProgress.timeRemainingInMilliSeconds).toEqual(100000);
        });
    });
});
