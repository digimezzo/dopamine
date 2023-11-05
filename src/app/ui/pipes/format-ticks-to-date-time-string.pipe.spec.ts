import { IMock, Mock } from 'typemoq';
import { DateTime } from '../common/date-time';
import { FormatTicksToDateTimeStringPipe } from './format-ticks-to-date-time-string.pipe';

describe('FormatTicksToDateTimeStringPipe', () => {
    let dateTimeMock: IMock<DateTime>;

    let formatTicksToDateTimeStringPipe: FormatTicksToDateTimeStringPipe;

    beforeEach(() => {
        dateTimeMock = Mock.ofType<DateTime>();

        formatTicksToDateTimeStringPipe = new FormatTicksToDateTimeStringPipe(dateTimeMock.object);
    });

    describe('transform', () => {
        it('should return empty string when ticks is undefined', () => {
            // Arrange

            // Act
            const formattedDateTime: string = formatTicksToDateTimeStringPipe.transform(undefined);

            // Assert
            expect(formattedDateTime).toEqual('');
        });

        it('should return empty string when ticks is negative', () => {
            // Arrange

            // Act
            const formattedDateTime: string = formatTicksToDateTimeStringPipe.transform(-2);

            // Assert
            expect(formattedDateTime).toEqual('');
        });

        it('should return empty string when ticks is zero', () => {
            // Arrange

            // Act
            const formattedDateTime: string = formatTicksToDateTimeStringPipe.transform(0);

            // Assert
            expect(formattedDateTime).toEqual('');
        });

        it('should return formatted date and time when ticks is valid number of ticks', () => {
            // Arrange
            dateTimeMock.setup((x) => x.convertTicksToDate(638012381850000000)).returns(() => new Date(2022, 9, 13, 6, 9));

            // Act
            const formattedDateTime: string = formatTicksToDateTimeStringPipe.transform(638012381850000000);

            // Assert
            expect(formattedDateTime).toEqual('2022-10-13 6:09');
        });
    });
});
