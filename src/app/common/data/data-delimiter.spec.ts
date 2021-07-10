import { DataDelimiter } from './data-delimiter';

describe('DataDelimiter', () => {
    describe('toDelimitedString', () => {
        it('should return an empty string if the array is undefined', () => {
            // Arrange
            const stringArray: string[] = undefined;

            // Act
            const delimitedString: string = DataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual('');
        });

        it('should return an empty string if the array has no elements', () => {
            // Arrange
            const stringArray: string[] = [];

            // Act
            const delimitedString: string = DataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual('');
        });

        it('should return a delimited string if the array has one element', () => {
            // Arrange
            const stringArray: string[] = ['String 1'];

            // Act
            const delimitedString: string = DataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual(';String 1;');
        });

        it('should return a delimited string if the array has more than one element', () => {
            // Arrange
            const stringArray: string[] = ['String 1', 'String 2'];

            // Act
            const delimitedString: string = DataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual(';String 1;;String 2;');
        });

        it('should remove leading spaces on array elements', () => {
            // Arrange
            const stringArray: string[] = [' String 1', '  String 2'];

            // Act
            const delimitedString: string = DataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual(';String 1;;String 2;');
        });

        it('should remove trailing spaces on array elements', () => {
            // Arrange
            const stringArray: string[] = ['String 1 ', 'String 2   '];

            // Act
            const delimitedString: string = DataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual(';String 1;;String 2;');
        });

        it('should remove empty array elements', () => {
            // Arrange
            const stringArray: string[] = ['String 1', '', 'String 2'];

            // Act
            const delimitedString: string = DataDelimiter.toDelimitedString(stringArray);

            // Assert
            expect(delimitedString).toEqual(';String 1;;String 2;');
        });
    });

    describe('fromDelimitedString', () => {
        it('should return an empty collection if the delimited string is undefined', () => {
            // Arrange
            const delimitedString: string = undefined;

            // Act
            const collection: string[] = DataDelimiter.fromDelimitedString(delimitedString);

            // Assert
            expect(collection).toEqual([]);
        });

        it('should return an empty collection if the delimited string is empty', () => {
            // Arrange
            const delimitedString: string = '';

            // Act
            const collection: string[] = DataDelimiter.fromDelimitedString(delimitedString);

            // Assert
            expect(collection).toEqual([]);
        });

        it('should return a collection containing just the string if it does not have delimiters', () => {
            // Arrange
            const delimitedString: string = 'the string';

            // Act
            const collection: string[] = DataDelimiter.fromDelimitedString(delimitedString);

            // Assert
            expect(collection).toEqual(['the string']);
        });

        it('should return a collection containing just the string without delimiters if it does have delimiters but only contains one string', () => {
            // Arrange
            const delimitedString: string = ';the string;';

            // Act
            const collection: string[] = DataDelimiter.fromDelimitedString(delimitedString);

            // Assert
            expect(collection).toEqual(['the string']);
        });

        it('should return a collection containing multiple strings if the string has multiple delimited strings', () => {
            // Arrange
            const delimitedString: string = ';the string 1;;the string 2;';

            // Act
            const collection: string[] = DataDelimiter.fromDelimitedString(delimitedString);

            // Assert
            expect(collection).toEqual(['the string 1', 'the string 2']);
        });

        it('should return a collection containing multiple strings if the string has multiple malformed delimited strings', () => {
            // Arrange
            const delimitedString: string = ';the string 1;the string 2;';

            // Act
            const collection: string[] = DataDelimiter.fromDelimitedString(delimitedString);

            // Assert
            expect(collection).toEqual(['the string 1', 'the string 2']);
        });
    });
});
