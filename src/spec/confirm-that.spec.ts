import * as assert from 'assert';
import { ConfirmThat } from '../app/core/confirm-that';

describe('ConfirmThat', () => {
    describe('equalsIgnoreCase', () => {
        it('Should return true if string1 is null and string2 is null', () => {
            // Arrange
            const string1: string = null;
            const string2: string = null;

            // Act
            const stringsAreEqual: boolean = ConfirmThat.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(stringsAreEqual);
        });

        it('Should return false if string1 is null and string2 is undefined', () => {
            // Arrange
            const string1: string = null;
            const string2: string = undefined;

            // Act
            const stringsAreEqual: boolean = ConfirmThat.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(!stringsAreEqual);
        });

        it('Should return false if string1 is undefined and string2 is null', () => {
            // Arrange
            const string1: string = undefined;
            const string2: string = null;

            // Act
            const stringsAreEqual: boolean = ConfirmThat.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(!stringsAreEqual);
        });

        it('Should return true if string1 and string2 are the same and their casing matches', () => {
            // Arrange
            const string1: string = 'thisisastring';
            const string2: string = 'thisisastring';

            // Act
            const stringsAreEqual: boolean = ConfirmThat.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(stringsAreEqual);
        });

        it('Should return true if string1 and string2 are the same but their casing does not match', () => {
            // Arrange
            const string1: string = 'thisisastring';
            const string2: string = 'THISISASTRING';

            // Act
            const stringsAreEqual: boolean = ConfirmThat.equalsIgnoreCase(string1, string2);

            // Assert
            assert.ok(stringsAreEqual);
        });
    });

    describe('isNullOrWhiteSpace', () => {
        it('Should return true if the string to check is null', () => {
            // Arrange
            const stringToCheck: string = null;

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return true if the string to check is undefined', () => {
            // Arrange
            const stringToCheck: string = undefined;

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return true if the string to check is empty', () => {
            // Arrange
            const stringToCheck: string = '';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return true if the string to check is a white space', () => {
            // Arrange
            const stringToCheck: string = ' ';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return true if the string to check is multiple white spaces', () => {
            // Arrange
            const stringToCheck: string = '     ';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return false if the string to check contains characters', () => {
            // Arrange
            const stringToCheck: string = 'myString 1';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(!stringToCheckIsNullOrWhiteSpace);
        });
    });

    describe('isNotNullOrWhiteSpace', () => {
        it('Should return false if the string to check is null', () => {
            // Arrange
            const stringToCheck: string = null;

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNotNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(!stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return false if the string to check is undefined', () => {
            // Arrange
            const stringToCheck: string = undefined;

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNotNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(!stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return false if the string to check is empty', () => {
            // Arrange
            const stringToCheck: string = '';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNotNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(!stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return false if the string to check is a white space', () => {
            // Arrange
            const stringToCheck: string = ' ';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNotNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(!stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return false if the string to check is multiple white spaces', () => {
            // Arrange
            const stringToCheck: string = '     ';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNotNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(!stringToCheckIsNullOrWhiteSpace);
        });

        it('Should return true if the string to check contains characters', () => {
            // Arrange
            const stringToCheck: string = 'myString 1';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = ConfirmThat.isNotNullOrWhiteSpace(stringToCheck);

            // Assert
            assert.ok(stringToCheckIsNullOrWhiteSpace);
        });
    });

    describe('isNull', () => {
        it('Should return true if the object to check is null', () => {
            // Arrange
            const objectToCheck: object = null;

            // Act
            const objectIsNull: boolean = ConfirmThat.isNull(objectToCheck);

            // Assert
            assert.ok(objectIsNull);
        });

        it('Should return true if the object to check is undefined', () => {
            // Arrange
            const objectToCheck: object = undefined;

            // Act
            const objectIsNull: boolean = ConfirmThat.isNull(objectToCheck);

            // Assert
            assert.ok(objectIsNull);
        });

        it('Should return false if the object to check is not null and not undefined', () => {
            // Arrange
            const objectToCheck: Object = new Object();

            // Act
            const objectIsNull: boolean = ConfirmThat.isNull(objectToCheck);

            // Assert
            assert.ok(!objectIsNull);
        });
    });

    describe('isNotNull', () => {
        it('Should return false if the object to check is null', () => {
            // Arrange
            const objectToCheck: object = null;

            // Act
            const objectIsNotNull: boolean = ConfirmThat.isNotNull(objectToCheck);

            // Assert
            assert.ok(!objectIsNotNull);
        });

        it('Should return false if the object to check is undefined', () => {
            // Arrange
            const objectToCheck: object = undefined;

            // Act
            const objectIsNotNull: boolean = ConfirmThat.isNotNull(objectToCheck);

            // Assert
            assert.ok(!objectIsNotNull);
        });

        it('Should return true if the object to check is not null and not undefined', () => {
            // Arrange
            const objectToCheck: Object = new Object();

            // Act
            const objectIsNotNull: boolean = ConfirmThat.isNotNull(objectToCheck);

            // Assert
            assert.ok(objectIsNotNull);
        });
    });
});
