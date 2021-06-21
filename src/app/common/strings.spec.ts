import { Strings } from './strings';

describe('Strings', () => {
    describe('equalsIgnoreCase', () => {
        it('should return true if both strings are undefined', () => {
            // Arrange
            const string1: string = undefined;
            const string2: string = undefined;

            // Act
            const sringsAreEqual: boolean = Strings.equalsIgnoreCase(string1, string2);

            // Assert
            expect(sringsAreEqual).toBeTruthy();
        });

        it('should return false if string1 is undefined and string2 is not undefined', () => {
            // Arrange
            const string1: string = undefined;
            const string2: string = 'string 2';

            // Act
            const sringsAreEqual: boolean = Strings.equalsIgnoreCase(string1, string2);

            // Assert
            expect(sringsAreEqual).toBeFalsy();
        });

        it('should return false if string1 is not undefined and string2 is undefined', () => {
            // Arrange
            const string1: string = 'string 1';
            const string2: string = undefined;

            // Act
            const sringsAreEqual: boolean = Strings.equalsIgnoreCase(string1, string2);

            // Assert
            expect(sringsAreEqual).toBeFalsy();
        });

        it('should return true if string1 and string2 are the same and their casing matches', () => {
            // Arrange
            const string1: string = 'thisisastring';
            const string2: string = 'thisisastring';

            // Act
            const sringsAreEqual: boolean = Strings.equalsIgnoreCase(string1, string2);

            // Assert
            expect(sringsAreEqual).toBeTruthy();
        });

        it('should return true if string1 and string2 are the same but their casing does not match', () => {
            // Arrange
            const string1: string = 'thisisastring';
            const string2: string = 'THISISASTRING';

            // Act
            const sringsAreEqual: boolean = Strings.equalsIgnoreCase(string1, string2);

            // Assert
            expect(sringsAreEqual).toBeTruthy();
        });
    });

    describe('isNullOrWhiteSpace', () => {
        it('should return true if the string to check is undefined', () => {
            // Arrange
            const stringToCheck: string = undefined;

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = Strings.isNullOrWhiteSpace(stringToCheck);

            // Assert
            expect(stringToCheckIsNullOrWhiteSpace).toBeTruthy();
        });

        it('should return true if the string to check is empty', () => {
            // Arrange
            const stringToCheck: string = '';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = Strings.isNullOrWhiteSpace(stringToCheck);

            // Assert
            expect(stringToCheckIsNullOrWhiteSpace).toBeTruthy();
        });

        it('should return true if the string to check is a white space', () => {
            // Arrange
            const stringToCheck: string = ' ';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = Strings.isNullOrWhiteSpace(stringToCheck);

            // Assert
            expect(stringToCheckIsNullOrWhiteSpace).toBeTruthy();
        });

        it('should return true if the string to check is multiple white spaces', () => {
            // Arrange
            const stringToCheck: string = '     ';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = Strings.isNullOrWhiteSpace(stringToCheck);

            // Assert
            expect(stringToCheckIsNullOrWhiteSpace).toBeTruthy();
        });

        it('should return false if the string to check contains characters', () => {
            // Arrange
            const stringToCheck: string = 'myString 1';

            // Act
            const stringToCheckIsNullOrWhiteSpace: boolean = Strings.isNullOrWhiteSpace(stringToCheck);

            // Assert
            expect(stringToCheckIsNullOrWhiteSpace).toBeFalsy();
        });
    });

    describe('replaceAll', () => {
        it('should replace all occurrences of an old value by a new value', () => {
            // Arrange
            const sourceString: string = `A string 'with' single 'quotes'`;

            // Act
            const newString: string = Strings.replaceAll(sourceString, `'`, `''`);

            // Assert
            expect(newString).toEqual(`A string ''with'' single ''quotes''`);
        });
    });

    describe('removeAccents', () => {
        it('should remove all accents', () => {
            // Arrange
            const sourceString: string = 'Crème Brulée';

            // Act
            const newString: string = Strings.removeAccents(sourceString);

            // Assert
            expect(newString).toEqual('Creme Brulee');
        });
    });

    describe('getSortableString', () => {
        it('should return the original string in lowercase if it does not contain a prefix and it should not remove prefixes', () => {
            // Arrange
            const sourceString: string = 'Without prefix';

            // Act
            const sortableString: string = Strings.getSortableString(sourceString, false);

            // Assert
            expect(sortableString).toEqual('without prefix');
        });

        it('should return the original string in lowercase if it does not contain a prefix and it should remove prefixes', () => {
            // Arrange
            const sourceString: string = 'Without prefix';

            // Act
            const sortableString: string = Strings.getSortableString(sourceString, true);

            // Assert
            expect(sortableString).toEqual('without prefix');
        });

        it('should return the original string in lowercase if it starts with a prefix without trailing space it should remove prefixes', () => {
            // Arrange
            const sourceString: string = 'their big reward';

            // Act
            const sortableString: string = Strings.getSortableString(sourceString, true);

            // Assert
            expect(sortableString).toEqual('their big reward');
        });

        // it('should return the original string if it does not contain a prefix', () => {
        //     // Arrange
        //     const sourceString: string = `Without prefix`;

        //     // Act
        //     const sortableString: string = Strings.getSortableString(sourceString, true);

        //     // Assert
        //     expect(newString).toEqual(`Creme Brulee`);
        // });
    });
});
