import * as assert from 'assert';
import { DataDelimiter } from '../app/data/data-delimiter';

describe('DataDelimiter', () => {
    describe('convertToDelimitedString', () => {
        it('Should return an empty string if the array is undefined', () => {
            // Arrange
            const dataDelimiter: DataDelimiter = new DataDelimiter();
            const stringArray: string[] = undefined;

            // Act
            const delimitedString: string = dataDelimiter.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, '');
        });

        it('Should return an empty string if the array has no elements', () => {
            // Arrange
            const dataDelimiter: DataDelimiter = new DataDelimiter();
            const stringArray: string[] = [];

            // Act
            const delimitedString: string = dataDelimiter.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, '');
        });

        it('Should return a delimited string if the array has one element', () => {
            // Arrange
            const dataDelimiter: DataDelimiter = new DataDelimiter();
            const stringArray: string[] = ['String 1'];

            // Act
            const delimitedString: string = dataDelimiter.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, ';String 1;');
        });

        it('Should return a delimited string if the array has more than one element', () => {
            // Arrange
            const dataDelimiter: DataDelimiter = new DataDelimiter();
            const stringArray: string[] = ['String 1', 'String 2'];

            // Act
            const delimitedString: string = dataDelimiter.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, ';String 1;;String 2;');
        });

        it('Should remove leading spaces on array elements', () => {
            // Arrange
            const dataDelimiter: DataDelimiter = new DataDelimiter();
            const stringArray: string[] = [' String 1', '  String 2'];

            // Act
            const delimitedString: string = dataDelimiter.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, ';String 1;;String 2;');
        });

        it('Should remove trailing spaces on array elements', () => {
            // Arrange
            const dataDelimiter: DataDelimiter = new DataDelimiter();
            const stringArray: string[] = ['String 1 ', 'String 2   '];

            // Act
            const delimitedString: string = dataDelimiter.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, ';String 1;;String 2;');
        });

        it('Should remove emtpy array elements', () => {
            // Arrange
            const dataDelimiter: DataDelimiter = new DataDelimiter();
            const stringArray: string[] = ['String 1', '', 'String 2'];

            // Act
            const delimitedString: string = dataDelimiter.convertToDelimitedString(stringArray);

            // Assert
            assert.strictEqual(delimitedString, ';String 1;;String 2;');
        });
    });
});
