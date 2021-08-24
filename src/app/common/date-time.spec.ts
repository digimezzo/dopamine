import { DateTime } from './date-time';

describe('DateTime', () => {
    describe('convertDateToTicks', () => {
        it('should return .NET ticks', () => {
            // Arrange
            const someDate: Date = new Date(2021, 0, 24, 18, 25, 30, 263);

            // Act
            const ticks: number = DateTime.convertDateToTicks(someDate);

            // Assert
            expect(ticks).toEqual(637471095302630000);
        });
    });

    describe('convertDateToUnixTime', () => {
        it('should return Unix time', () => {
            // Arrange
            const someDate: Date = new Date(2021, 0, 24, 18, 25, 30, 0);

            // Act
            const unixTime: number = DateTime.convertDateToUnixTime(someDate);

            // Assert
            expect(unixTime).toEqual(1611512730);
        });
    });
});
