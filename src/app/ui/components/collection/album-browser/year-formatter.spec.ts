import { YearFormatter } from './year-formatter';

describe('YearFormatter', () => {
    describe('formatYear', () => {
        it('should return "?" when year is undefined', () => {
            // Arrange

            // Act
            const result = YearFormatter.formatYear(undefined as any);

            // Assert
            expect(result).toEqual('?');
        });

        it('should return "?" when year is 0', () => {
            // Arrange

            // Act
            const result = YearFormatter.formatYear(0);

            // Assert
            expect(result).toEqual('?');
        });

        it('should return the year as a string when year is a positive number', () => {
            // Arrange

            // Act
            const result = YearFormatter.formatYear(2023);

            // Assert
            expect(result).toEqual('2023');
        });

        it('should return the year as a string when year is a negative number', () => {
            // Arrange

            // Act
            const result = YearFormatter.formatYear(-500);

            // Assert
            expect(result).toEqual('-500');
        });

        it('should return the year as a string for year 1', () => {
            // Arrange

            // Act
            const result = YearFormatter.formatYear(1);

            // Assert
            expect(result).toEqual('1');
        });

        it('should return the year as a string for a large year number', () => {
            // Arrange

            // Act
            const result = YearFormatter.formatYear(9999);

            // Assert
            expect(result).toEqual('9999');
        });
    });
});
