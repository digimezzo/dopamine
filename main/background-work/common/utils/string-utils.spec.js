const { StringUtils } = require('./string-utils');

describe('StringUtils', () => {
    describe('isNullOrWhiteSpace', () => {
        it('should return true if the string to check is undefined', () => {
            // Arrange
            const stringToCheck = undefined;

            // Act
            const stringToCheckIsNullOrWhiteSpace = StringUtils.isNullOrWhiteSpace(stringToCheck);

            // Assert
            expect(stringToCheckIsNullOrWhiteSpace).toBeTruthy();
        });

        it('should return true if the string to check is empty', () => {
            // Arrange
            const stringToCheck = '';

            // Act
            const stringToCheckIsNullOrWhiteSpace = StringUtils.isNullOrWhiteSpace(stringToCheck);

            // Assert
            expect(stringToCheckIsNullOrWhiteSpace).toBeTruthy();
        });

        it('should return true if the string to check is a white space', () => {
            // Arrange
            const stringToCheck = ' ';

            // Act
            const stringToCheckIsNullOrWhiteSpace = StringUtils.isNullOrWhiteSpace(stringToCheck);

            // Assert
            expect(stringToCheckIsNullOrWhiteSpace).toBeTruthy();
        });

        it('should return true if the string to check is multiple white spaces', () => {
            // Arrange
            const stringToCheck = '     ';

            // Act
            const stringToCheckIsNullOrWhiteSpace = StringUtils.isNullOrWhiteSpace(stringToCheck);

            // Assert
            expect(stringToCheckIsNullOrWhiteSpace).toBeTruthy();
        });

        it('should return false if the string to check contains characters', () => {
            // Arrange
            const stringToCheck = 'myString 1';

            // Act
            const stringToCheckIsNullOrWhiteSpace = StringUtils.isNullOrWhiteSpace(stringToCheck);

            // Assert
            expect(stringToCheckIsNullOrWhiteSpace).toBeFalsy();
        });
    });

    describe('replaceAll', () => {
        it('should replace all occurrences of an old value by a new value', () => {
            // Arrange
            const sourceString = `A string 'with' single 'quotes'`;

            // Act
            const newString = StringUtils.replaceAll(sourceString, `'`, `''`);

            // Assert
            expect(newString).toEqual(`A string ''with'' single ''quotes''`);
        });
    });
});
