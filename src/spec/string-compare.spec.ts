import * as assert from 'assert';
import { StringCompare } from '../app/core/string-compare';

describe('StringCompare', () => {
    describe('equalsIgnoreCase', () => {
        it('Should return true if both strings are undefined', () => {
            // Arrange
            const string1: string = undefined;
            const string2: string = undefined;

            // Act
            const areStringsEqual: boolean = StringCompare.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(areStringsEqual);
        });

        it('Should return false if string1 is undefined and string2 is not undefined', () => {
            // Arrange
            const string1: string = undefined;
            const string2: string = 'string 2';

            // Act
            const areStringsEqual: boolean = StringCompare.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(!areStringsEqual);
        });

        it('Should return false if string1 is not undefined and string2 is undefined', () => {
            // Arrange
            const string1: string = 'string 1';
            const string2: string = undefined;

            // Act
            const areStringsEqual: boolean = StringCompare.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(!areStringsEqual);
        });

        it('Should return true if string1 and string2 are the same and their casing matches', () => {
            // Arrange
            const string1: string = 'thisisastring';
            const string2: string = 'thisisastring';

            // Act
            const areStringsEqual: boolean = StringCompare.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(areStringsEqual);
        });

        it('Should return true if string1 and string2 are the same but their casing does not match', () => {
            // Arrange
            const string1: string = 'thisisastring';
            const string2: string = 'THISISASTRING';

            // Act
            const areStringsEqual: boolean = StringCompare.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(areStringsEqual);
        });
    });

    describe('isNullOrWhiteSpace', () => {
        it('Should return true if the string to check is undefined', () => {
            // Arrange
            const stringToCheck: string = undefined;

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = StringCompare.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return true if the string to check is empty', () => {
            // Arrange
            const stringToCheck: string = '';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = StringCompare.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return true if the string to check is a white space', () => {
            // Arrange
            const stringToCheck: string = ' ';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = StringCompare.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return true if the string to check is multiple white spaces', () => {
            // Arrange
            const stringToCheck: string = '     ';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = StringCompare.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return false if the string to check contains characters', () => {
            // Arrange
            const stringToCheck: string = 'myString 1';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = StringCompare.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(!stringToCheckIsNullOrWhiteSpace);
        });
    });
});
