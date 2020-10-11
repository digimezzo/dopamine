import * as assert from 'assert';
import { StringComparison } from '../app/core/string-comparison';

describe('StringComparison', () => {
    describe('equalsIgnoreCase', () => {
        it('Should return true if string1 is null and string2 is null', () => {
            // Arrange
            const string1: string = null;
            const string2: string = null;

            // Act
            const areStringsEqual: boolean = StringComparison.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(areStringsEqual);
        });

        it('Should return false if string1 is null and string2 is undefined', () => {
            // Arrange
            const string1: string = null;
            const string2: string = undefined;

            // Act
            const areStringsEqual: boolean = StringComparison.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(!areStringsEqual);
        });

        it('Should return false if string1 is undefined and string2 is null', () => {
            // Arrange
            const string1: string = undefined;
            const string2: string = null;

            // Act
            const areStringsEqual: boolean = StringComparison.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(!areStringsEqual);
        });

        it('Should return true if string1 and string2 are the same and their casing matches', () => {
            // Arrange
            const string1: string = 'thisisastring';
            const string2: string = 'thisisastring';

            // Act
            const areStringsEqual: boolean = StringComparison.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(areStringsEqual);
        });

        it('Should return true if string1 and string2 are the same but their casing does not match', () => {
            // Arrange
            const string1: string = 'thisisastring';
            const string2: string = 'THISISASTRING';

            // Act
            const areStringsEqual: boolean = StringComparison.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(areStringsEqual);
        });
    });
});
