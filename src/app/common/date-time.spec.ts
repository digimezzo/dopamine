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

    describe('convertTicksToDate', () => {
        it('should return a Date', () => {
            // Arrange
            const someTicks: number = 637471095302630000;

            // Act
            const date: Date = DateTime.convertTicksToDate(someTicks);

            const year: number = date.getFullYear();
            const month: number = date.getMonth();
            const day: number = date.getDate();
            const hours: number = date.getHours();
            const minutes: number = date.getMinutes();
            const seconds: number = date.getSeconds();
            const milliseconds: number = date.getMilliseconds();

            // Assert
            expect(year).toEqual(2021);
            expect(month).toEqual(0);
            expect(day).toEqual(24);
            expect(hours).toEqual(18);
            expect(minutes).toEqual(25);
            expect(seconds).toEqual(30);
            expect(milliseconds).toEqual(263);
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
