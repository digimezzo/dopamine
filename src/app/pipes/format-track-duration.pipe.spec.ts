import { FormatTrackDurationPipe } from './format-track-duration.pipe';

describe('FormatTrackDurationPipe', () => {
    let formatTrackDurationPipe: FormatTrackDurationPipe;

    beforeEach(() => {
        formatTrackDurationPipe = new FormatTrackDurationPipe();
    });

    describe('transform', () => {
        it('should return 00:00 when track duration is undefined', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(undefined);

            // Assert
            expect(formattedTrackDuration).toEqual('00:00');
        });

        it('should return 00:00 when track duration is 0', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(0);

            // Assert
            expect(formattedTrackDuration).toEqual('00:00');
        });

        it('should return 00:00 when track duration is negative', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(-6);

            // Assert
            expect(formattedTrackDuration).toEqual('00:00');
        });

        it('should return seconds padded with zeroes for the minutes when track duration is less than 1 minute', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(59000);

            // Assert
            expect(formattedTrackDuration).toEqual('00:59');
        });

        it('should return minutes and seconds not padded with zeroes for the hours when track duration is between 1 and 60 minutes', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(3599000);

            // Assert
            expect(formattedTrackDuration).toEqual('59:59');
        });

        it('should show hours when the duration is larger than 1 hour', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(55662000);

            // Assert
            expect(formattedTrackDuration).toEqual('15:27:42');
        });

        it('should support more than 24 hours', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(126000000);

            // Assert
            expect(formattedTrackDuration).toEqual('35:00:00');
        });
    });
});
