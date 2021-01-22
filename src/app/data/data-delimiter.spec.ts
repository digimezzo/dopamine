import { DataDelimiter } from './data-delimiter';

describe('DataDelimiter', () => {
    let dataDelimiter: DataDelimiter;

    beforeEach(() => {
        dataDelimiter = new DataDelimiter();
    });

    describe('toDelimitedString', () => {
        it('should return an empty string if the array is undefined', () => {
            // Arrange
            const stringArray: string[] = undefined;

            // Act
            const delimitedString: string = dataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual('');
        });

        it('should return an empty string if the array has no elements', () => {
            // Arrange
            const stringArray: string[] = [];

            // Act
            const delimitedString: string = dataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual('');
        });

        it('should return a delimited string if the array has one element', () => {
            // Arrange
            const stringArray: string[] = ['String 1'];

            // Act
            const delimitedString: string = dataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual(';String 1;');
        });

        it('should return a delimited string if the array has more than one element', () => {
            // Arrange
            const stringArray: string[] = ['String 1', 'String 2'];

            // Act
            const delimitedString: string = dataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual(';String 1;;String 2;');
        });

        it('should remove leading spaces on array elements', () => {
            // Arrange
            const stringArray: string[] = [' String 1', '  String 2'];

            // Act
            const delimitedString: string = dataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual(';String 1;;String 2;');
        });

        it('should remove trailing spaces on array elements', () => {
            // Arrange
            const stringArray: string[] = ['String 1 ', 'String 2   '];

            // Act
            const delimitedString: string = dataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual(';String 1;;String 2;');
        });

        it('should remove empty array elements', () => {
            // Arrange
            const stringArray: string[] = ['String 1', '', 'String 2'];

            // Act
            const delimitedString: string = dataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual(';String 1;;String 2;');
        });
    });

    describe('fromDelimitedString', () => {
        it('should return an empty collection if the delimited string is undefined', () => {
            // Arrange
            const delimitedString: string = undefined;

            // Act
            const collection: string[] = dataDelimiter.fromDelimitedString(delimitedString);

            // Assert
            expect(collection).toEqual([]);
        });

        it('should return an empty collection if the delimited string is empty', () => {
            // Arrange
            const delimitedString: string = '';

            // Act
            const collection: string[] = dataDelimiter.fromDelimitedString(delimitedString);

            // Assert
            expect(collection).toEqual([]);
        });

        it('should return a collection containing just the delimited string if it does not have delimiters', () => {
            // Arrange
            const delimitedString: string = 'the string';

            // Act
            const collection: string[] = dataDelimiter.fromDelimitedString(delimitedString);

            // Assert
            expect(collection).toEqual([delimitedString]);
        });
    });
});
