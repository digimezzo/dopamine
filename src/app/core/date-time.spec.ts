import { DateTime } from './date-time';

describe('DateTime', () => {
    describe('getTicks', () => {
        it('should return .NET ticks', () => {
            // Arrange
            const someDate: Date = new Date(2020, 10, 4, 15, 6, 4, 263);

            // Act
            const ticks: number = DateTime.getTicks(someDate);

            // Assert
            expect(ticks).toEqual(637400955642630000);
        });
    });
});
