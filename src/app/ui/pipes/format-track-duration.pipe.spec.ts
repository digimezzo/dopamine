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

        it('should return 00:00 when track duration is 0 milliseconds', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(0);

            // Assert
            expect(formattedTrackDuration).toEqual('00:00');
        });

        it('should return 00:00 when track duration is -6 milliseconds', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(-6);

            // Assert
            expect(formattedTrackDuration).toEqual('00:00');
        });

        it('should return "00:59" if track duration is 59000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(59000);

            // Assert
            expect(formattedTrackDuration).toEqual('00:59');
        });

        it('should return "01:00" if track duration is 60000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(60000);

            // Assert
            expect(formattedTrackDuration).toEqual('01:00');
        });

        it('should return "59:59" if track duration is 3599000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(3599000);

            // Assert
            expect(formattedTrackDuration).toEqual('59:59');
        });

        it('should return "01:00:00" if track duration is 3600000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(3600000);

            // Assert
            expect(formattedTrackDuration).toEqual('01:00:00');
        });

        it('should return "15:27:42" if track duration is 55662000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(55662000);

            // Assert
            expect(formattedTrackDuration).toEqual('15:27:42');
        });

        it('should return "35:00:00" if track duration is 126000000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTrackDuration: string = formatTrackDurationPipe.transform(126000000);

            // Assert
            expect(formattedTrackDuration).toEqual('35:00:00');
        });
    });
});
