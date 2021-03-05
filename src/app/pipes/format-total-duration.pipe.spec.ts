import { IMock, Mock } from 'typemoq';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { FormatTotalDurationPipe } from './format-total-duration.pipe';

describe('FormatTotalDurationPipe', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let formatTotalDurationPipe: FormatTotalDurationPipe;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('Durations.Days')).returns(() => 'days');
        translatorServiceMock.setup((x) => x.get('Durations.Hours')).returns(() => 'hours');
        translatorServiceMock.setup((x) => x.get('Durations.Minutes')).returns(() => 'minutes');
        translatorServiceMock.setup((x) => x.get('Durations.Seconds')).returns(() => 'seconds');
        formatTotalDurationPipe = new FormatTotalDurationPipe(translatorServiceMock.object);
    });

    describe('transform', () => {
        it('should return an empty string if total duration is undefined', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(undefined);

            // Assert
            expect(formattedTotalDuration).toEqual('');
        });

        it('should return an empty string if total duration is 0 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(0);

            // Assert
            expect(formattedTotalDuration).toEqual('');
        });

        it('should return an empty string if total duration is -5 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(-5);

            // Assert
            expect(formattedTotalDuration).toEqual('');
        });

        it('should return "1 seconds" if total duration is 1000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(1000);

            // Assert
            expect(formattedTotalDuration).toEqual('1 seconds');
        });

        it('should return "59 seconds" if total duration is 59000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(59000);

            // Assert
            expect(formattedTotalDuration).toEqual('59 seconds');
        });

        it('should return "1 minutes 0 seconds" if total duration is 60000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(60000);

            // Assert
            expect(formattedTotalDuration).toEqual('1 minutes 0 seconds');
        });

        it('should return "35 minutes 16 seconds" if total duration is 2116000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(2116000);

            // Assert
            expect(formattedTotalDuration).toEqual('35 minutes 16 seconds');
        });

        it('should return "1 hours 0 minutes 0 seconds" if total duration is 3600000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(3600000);

            // Assert
            expect(formattedTotalDuration).toEqual('1 hours 0 minutes 0 seconds');
        });

        it('should return "6 hours 35 minutes 16 seconds" if total duration is 23716000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(23716000);

            // Assert
            expect(formattedTotalDuration).toEqual('6 hours 35 minutes 16 seconds');
        });

        it('should return "36 hours 35 minutes 16 seconds" if total duration is 131716000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(131716000);

            // Assert
            expect(formattedTotalDuration).toEqual('36 hours 35 minutes 16 seconds');
        });
    });
});
