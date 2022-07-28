import { Strings } from './strings';

describe('Strings', () => {
    describe('empty', () => {
        it('should return an empty string', () => {
            // Arrange

            // Act
            const emptyString: string = Strings.empty;

            // Assert
            expect(emptyString).toEqual('');
        });
    });

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

    describe('replaceFirst', () => {
        it('should replace the first occurrence of an old value by a new value', () => {
            // Arrange
            const sourceString: string = `A string 'with' single 'quotes'`;

            // Act
            const newString: string = Strings.replaceFirst(sourceString, `'`, `''`);

            // Assert
            expect(newString).toEqual(`A string ''with' single 'quotes'`);
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
            const sourceString: string = `Ça, c'était une très bonne crème Brulée. Raphaël l'a adoré!`;

            // Act
            const newString: string = Strings.removeAccents(sourceString);

            // Assert
            expect(newString).toEqual(`Ca, c'etait une tres bonne creme Brulee. Raphael l'a adore!`);
        });
    });

    describe('getSortableString', () => {
        it('should return an empty string given undefined it should not remove prefixes', () => {
            // Arrange

            // Act
            const sortableString: string = Strings.getSortableString(undefined, false);

            // Assert
            expect(sortableString).toEqual('');
        });

        it('should return an empty string given an empty string it should not remove prefixes', () => {
            // Arrange

            // Act
            const sortableString: string = Strings.getSortableString('', false);

            // Assert
            expect(sortableString).toEqual('');
        });

        it('should return the original string in lowercase if it does not contain a prefix and it should not remove prefixes', () => {
            // Arrange
            const sourceString: string = 'Without prefix';

            // Act
            const sortableString: string = Strings.getSortableString(sourceString, false);

            // Assert
            expect(sortableString).toEqual('without prefix');
        });

        it('should return the original string in lowercase given a string that does not contain a prefix and it should remove prefixes', () => {
            // Arrange
            const sourceString: string = 'Without prefix';

            // Act
            const sortableString: string = Strings.getSortableString(sourceString, true);

            // Assert
            expect(sortableString).toEqual('without prefix');
        });

        it('should return the original string in lowercase given a string that starts with a prefix without trailing space and it should not remove prefixes', () => {
            // Arrange
            const sourceString: string = 'Their big reward';

            // Act
            const sortableString: string = Strings.getSortableString(sourceString, false);

            // Assert
            expect(sortableString).toEqual('their big reward');
        });

        it('should return the original string in lowercase given a string that starts with a prefix without trailing space and it should remove prefixes', () => {
            // Arrange
            const sourceString: string = 'Their big reward';

            // Act
            const sortableString: string = Strings.getSortableString(sourceString, true);

            // Assert
            expect(sortableString).toEqual('their big reward');
        });

        it('should return the original string in lowercase given a string that starts with a prefix with a trailing space and it should not remove prefixes', () => {
            // Arrange
            const sourceString: string = 'The Gathering';

            // Act
            const sortableString: string = Strings.getSortableString(sourceString, false);

            // Assert
            expect(sortableString).toEqual('the gathering');
        });

        it('should return the original string without prefix in lowercase given a string that starts with a prefix with a trailing space and it should remove prefixes', () => {
            // Arrange
            const sourceString: string = 'The Gathering';

            // Act
            const sortableString: string = Strings.getSortableString(sourceString, true);

            // Assert
            expect(sortableString).toEqual('gathering');
        });

        it('should return the original string without prefix and spaces in lowercase given a string that starts with a prefix with multiple trailing space and it should remove prefixes', () => {
            // Arrange
            const sourceString: string = 'The    Gathering';

            // Act
            const sortableString: string = Strings.getSortableString(sourceString, true);

            // Assert
            expect(sortableString).toEqual('gathering');
        });
    });
});
