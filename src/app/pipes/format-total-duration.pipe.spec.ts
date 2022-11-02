import { IMock, Mock } from 'typemoq';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { FormatTotalDurationPipe } from './format-total-duration.pipe';

describe('FormatTotalDurationPipe', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let formatTotalDurationPipe: FormatTotalDurationPipe;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('day')).returns(() => 'day');
        translatorServiceMock.setup((x) => x.get('days')).returns(() => 'days');
        translatorServiceMock.setup((x) => x.get('hour')).returns(() => 'hour');
        translatorServiceMock.setup((x) => x.get('hours')).returns(() => 'hours');
        translatorServiceMock.setup((x) => x.get('minute')).returns(() => 'minute');
        translatorServiceMock.setup((x) => x.get('minutes')).returns(() => 'minutes');
        translatorServiceMock.setup((x) => x.get('second')).returns(() => 'second');
        translatorServiceMock.setup((x) => x.get('seconds')).returns(() => 'seconds');
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

        it('should return "1 second" if total duration is 1000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(1000);

            // Assert
            expect(formattedTotalDuration).toEqual('1 second');
        });

        it('should return "59 seconds" if total duration is 59000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(59000);

            // Assert
            expect(formattedTotalDuration).toEqual('59 seconds');
        });

        it('should return "1 minute" if total duration is 60000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(60000);

            // Assert
            expect(formattedTotalDuration).toEqual('1 minute');
        });

        it('should return "35 minutes 16 seconds" if total duration is 2116000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(2116000);

            // Assert
            expect(formattedTotalDuration).toEqual('35 minutes 16 seconds');
        });

        it('should return "59 minutes" if total duration is 3540000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(3540000);

            // Assert
            expect(formattedTotalDuration).toEqual('59 minutes');
        });

        it('should return "59 minutes 59 seconds" if total duration is 3599000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(3599000);

            // Assert
            expect(formattedTotalDuration).toEqual('59 minutes 59 seconds');
        });

        it('should return "1 hour" if total duration is 3600000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(3600000);

            // Assert
            expect(formattedTotalDuration).toEqual('1 hour');
        });

        it('should return "2 hours" if total duration is 7200000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(7200000);

            // Assert
            expect(formattedTotalDuration).toEqual('2 hours');
        });

        it('should return "7.2 hours" if total duration is 25819000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(25819000);

            // Assert
            expect(formattedTotalDuration).toEqual('7.2 hours');
        });

        it('should return "1 day" if total duration is 86400000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(86400000);

            // Assert
            expect(formattedTotalDuration).toEqual('1 day');
        });

        it('should return "1 day" if total duration is 86340000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(86340000);

            // Assert
            expect(formattedTotalDuration).toEqual('1 day');
        });

        it('should return "1.5 days" if total duration is 131716000 milliseconds', () => {
            // Arrange

            // Act
            const formattedTotalDuration: string = formatTotalDurationPipe.transform(131716000);

            // Assert
            expect(formattedTotalDuration).toEqual('1.5 days');
        });
    });
});
