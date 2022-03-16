import { Language } from './language';

describe('Language', () => {
    describe('constructor', () => {
        it('should set code', () => {
            // Arrange

            // Act
            const language: Language = new Language('The code', 'The English name', 'The Localized name', true);

            // Assert
            expect(language.code).toEqual('The code');
        });

        it('should set englishName', () => {
            // Arrange

            // Act
            const language: Language = new Language('The code', 'The English name', 'The Localized name', true);

            // Assert
            expect(language.englishName).toEqual('The English name');
        });

        it('should set localizedName', () => {
            // Arrange

            // Act
            const language: Language = new Language('The code', 'The English name', 'The Localized name', true);

            // Assert
            expect(language.localizedName).toEqual('The Localized name');
        });

        it('should set hasLatinCharacters', () => {
            // Arrange

            // Act
            const language: Language = new Language('The code', 'The English name', 'The Localized name', true);

            // Assert
            expect(language.hasLatinCharacters).toBeTruthy();
        });
    });
});
