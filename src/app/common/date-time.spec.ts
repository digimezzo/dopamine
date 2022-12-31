import { DateTime } from './date-time';

describe('DateTime', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const dateTime: DateTime = new DateTime();

            // Assert
            expect(dateTime).toBeDefined();
        });
    });

    describe('convertDateToTicks', () => {
        it('should return .NET ticks', () => {
            // Arrange
            const someDate: Date = new Date(2021, 0, 24, 18, 25, 30, 263);
            const dateTime: DateTime = new DateTime();

            // Act
            const ticks: number = dateTime.convertDateToTicks(someDate);

            // Assert
            expect(ticks).toEqual(637471095302630000);
        });
    });

    describe('convertTicksToDate', () => {
        it('should return a Date', () => {
            // Arrange
            const someTicks: number = 637471095302630000;
            const dateTime: DateTime = new DateTime();

            // Act
            const date: Date = dateTime.convertTicksToDate(someTicks);

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
            const dateTime: DateTime = new DateTime();

            // Act
            const unixTime: number = dateTime.convertDateToUnixTime(someDate);

            // Assert
            expect(unixTime).toEqual(1611512730);
        });
    });

    describe('getUTCDate', () => {
        it('should return the UTC date', () => {
            // Arrange
            const localDate: Date = new Date();
            const dateTime: DateTime = new DateTime();
            const expectedUtcDate: Date = new Date(localDate);
            expectedUtcDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());

            // Act
            const utcDate: Date = dateTime.getUTCDate(localDate);

            // Assert
            expect(utcDate).toEqual(expectedUtcDate);
        });
    });
});
