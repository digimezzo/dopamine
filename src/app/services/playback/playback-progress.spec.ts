import { PlaybackProgress } from './playback-progress';

describe('PlaybackProgress', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const playbackProgress = new PlaybackProgress(20, 120);

            // Assert
            expect(playbackProgress).toBeDefined();
        });

        it('should set progressSeconds', () => {
            // Arrange

            // Act
            const playbackProgress = new PlaybackProgress(20, 120);

            // Assert
            expect(playbackProgress.progressSeconds).toEqual(20);
        });

        it('should set totalSeconds', () => {
            // Arrange

            // Act
            const playbackProgress = new PlaybackProgress(20, 120);

            // Assert
            expect(playbackProgress.totalSeconds).toEqual(120);
        });
    });

    describe('timeRemainingInMilliSeconds', () => {
        it('should return 0 when progressSeconds is undefined', () => {
            // Arrange
            const playbackProgress = new PlaybackProgress(undefined, 120);

            // Act
            const timeRemainingInMilliSeconds = playbackProgress.timeRemainingInMilliSeconds;

            // Assert
            expect(timeRemainingInMilliSeconds).toEqual(0);
        });

        it('should return 0 when totalSeconds is undefined', () => {
            // Arrange
            const playbackProgress = new PlaybackProgress(20, undefined);

            // Act
            const timeRemainingInMilliSeconds = playbackProgress.timeRemainingInMilliSeconds;

            // Assert
            expect(timeRemainingInMilliSeconds).toEqual(0);
        });

        it('should return 0 when totalSeconds is 0', () => {
            // Arrange
            const playbackProgress = new PlaybackProgress(20, 0);

            // Act
            const timeRemainingInMilliSeconds = playbackProgress.timeRemainingInMilliSeconds;

            // Assert
            expect(timeRemainingInMilliSeconds).toEqual(0);
        });

        it('should return time remaining in seconds', () => {
            // Arrange
            const playbackProgress = new PlaybackProgress(20, 120);

            // Act
            const timeRemainingInMilliSeconds = playbackProgress.timeRemainingInMilliSeconds;

            // Assert
            expect(timeRemainingInMilliSeconds).toEqual(100000);
        });
    });

    describe('progressPercent', () => {
        it('should return 0 when progressSeconds is undefined', () => {
            // Arrange
            const playbackProgress = new PlaybackProgress(undefined, 120);

            // Act
            const progressPercent = playbackProgress.progressPercent;

            // Assert
            expect(progressPercent).toEqual(0);
        });

        it('should return 0 when totalSeconds is undefined', () => {
            // Arrange
            const playbackProgress = new PlaybackProgress(20, undefined);

            // Act
            const progressPercent = playbackProgress.progressPercent;

            // Assert
            expect(progressPercent).toEqual(0);
        });

        it('should return 0 when totalSeconds is 0', () => {
            // Arrange
            const playbackProgress = new PlaybackProgress(20, 0);

            // Act
            const progressPercent = playbackProgress.progressPercent;

            // Assert
            expect(progressPercent).toEqual(0);
        });

        it('should return progress in percent', () => {
            // Arrange
            const playbackProgress = new PlaybackProgress(20, 200);

            // Act
            const progressPercent = playbackProgress.progressPercent;

            // Assert
            expect(progressPercent).toEqual(10);
        });
    });
});
