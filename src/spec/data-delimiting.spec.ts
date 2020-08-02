import * as assert from 'assert';
import { DataDelimiting } from '../app/data/data-delimiting';

describe('DataDelimiting', () => {
    describe('convertToDelimitedString', () => {
        it('Should return an empty string if the array is null', () => {
            // Arrange
            const stringArray: string[] = null;

            // Act
            const delimitedString: string = DataDelimiting.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, '');
        });

        it('Should return an empty string if the array is undefined', () => {
            // Arrange
            const stringArray: string[] = undefined;

            // Act
            const delimitedString: string = DataDelimiting.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, '');
        });

        it('Should return an empty string if the array has no elements', () => {
            // Arrange
            const stringArray: string[] = [];

            // Act
            const delimitedString: string = DataDelimiting.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, '');
        });

        it('Should return a delimited string if the array has one element', () => {
            // Arrange
            const stringArray: string[] = ['String 1'];

            // Act
            const delimitedString: string = DataDelimiting.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, ';String 1;');
        });

        it('Should return a delimited string if the array has more than one element', () => {
            // Arrange
            const stringArray: string[] = ['String 1', 'String 2'];

            // Act
            const delimitedString: string = DataDelimiting.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, ';String 1;;String 2;');
        });
    });
});
