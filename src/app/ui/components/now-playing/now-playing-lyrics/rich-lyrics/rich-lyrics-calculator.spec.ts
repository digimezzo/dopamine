import { RichLyricsCalculator } from './rich-lyrics-calculator';
import { LyricsModel } from '../../../../../services/lyrics/lyrics-model';
import { LyricsSourceType } from '../../../../../common/api/lyrics/lyrics-source-type';

describe('RichLyricsCalculator', () => {
    function createTimedLyrics(): LyricsModel {
        return LyricsModel.timed(
            undefined,
            '',
            LyricsSourceType.lrc,
            'Line 1\nLine 2\nLine 3\nLine 4',
            ['Line 1', 'Line 2', 'Line 3', 'Line 4'],
            [0, 5, 10, 15],
        );
    }

    function createDoubleTimedLyrics(): LyricsModel {
        return LyricsModel.doubleTimed(
            undefined,
            '',
            LyricsSourceType.srt,
            'Line 1\nLine 2\nLine 3',
            ['Line 1', 'Line 2', 'Line 3'],
            [0, 5, 10],
            [4, 9, 14],
        );
    }

    describe('reset', () => {
        it('should reset index and percentage to 0', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createTimedLyrics();
            calc.updateCurrentLyric(lyrics, 12);

            // Act
            calc.reset();

            // Assert
            expect(calc.currentIndex).toEqual(0);
            expect(calc.percentage).toEqual(0);
        });
    });

    describe('updateCurrentLyric', () => {
        it('should stay on first lyric when time is before second timestamp', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createTimedLyrics();

            // Act
            calc.updateCurrentLyric(lyrics, 3);

            // Assert
            expect(calc.currentIndex).toEqual(0);
        });

        it('should advance to second lyric when time passes second timestamp', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createTimedLyrics();

            // Act
            calc.updateCurrentLyric(lyrics, 7);

            // Assert
            expect(calc.currentIndex).toEqual(1);
        });

        it('should advance to last lyric when time passes all timestamps', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createTimedLyrics();

            // Act
            calc.updateCurrentLyric(lyrics, 100);

            // Assert
            expect(calc.currentIndex).toEqual(3);
        });
    });

    describe('getCurrentText', () => {
        it('should return current lyric line', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createTimedLyrics();
            calc.updateCurrentLyric(lyrics, 7);

            // Act
            const text = calc.getCurrentText(lyrics);

            // Assert
            expect(text).toEqual('Line 2');
        });

        it('should return empty string for empty lyrics', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = LyricsModel.empty(undefined);

            // Act
            const text = calc.getCurrentText(lyrics);

            // Assert
            expect(text).toEqual('');
        });
    });

    describe('calculatePercentage', () => {
        it('should calculate correct percentage within a lyric range', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createDoubleTimedLyrics();

            // Act — at time 2, first lyric spans 0-4, so 50%
            calc.calculatePercentage(lyrics, 2);

            // Assert
            expect(calc.percentage).toEqual(50);
        });

        it('should clamp percentage to 100', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createDoubleTimedLyrics();

            // Act — time 6 is beyond end of first lyric (0-4)
            calc.calculatePercentage(lyrics, 6);

            // Assert
            expect(calc.percentage).toEqual(100);
        });

        it('should clamp percentage to 0 when time is before start', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createDoubleTimedLyrics();

            // Act
            calc.calculatePercentage(lyrics, -1);

            // Assert
            expect(calc.percentage).toEqual(0);
        });
    });

    describe('getPreviousLines', () => {
        it('should return empty string when at first lyric', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createTimedLyrics();

            // Act
            const result = calc.getPreviousLines(lyrics, 2);

            // Assert
            expect(result).toEqual('');
        });

        it('should return previous lines when not at first lyric', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createTimedLyrics();
            calc.updateCurrentLyric(lyrics, 12);

            // Act
            const result = calc.getPreviousLines(lyrics, 2);

            // Assert
            expect(result).toEqual('Line 1\nLine 2\n');
        });
    });

    describe('getNextLines', () => {
        it('should return empty string when at last lyric', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createTimedLyrics();
            calc.updateCurrentLyric(lyrics, 100);

            // Act
            const result = calc.getNextLines(lyrics, 2);

            // Assert
            expect(result).toEqual('');
        });

        it('should return next lines when not at last lyric', () => {
            // Arrange
            const calc = new RichLyricsCalculator();
            const lyrics = createTimedLyrics();

            // Act
            const result = calc.getNextLines(lyrics, 2);

            // Assert
            expect(result).toEqual('Line 2\nLine 3\n');
        });
    });
});
