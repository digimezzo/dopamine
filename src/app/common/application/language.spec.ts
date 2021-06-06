import { Language } from './language';

describe('Language', () => {
    describe('constructor', () => {
        it('should set code', () => {
            // Arrange

            // Act
            const language: Language = new Language('The code', 'The name');

            // Assert
            expect(language.code).toEqual('The code');
        });

        it('should set name', () => {
            // Arrange

            // Act
            const language: Language = new Language('The code', 'The name');

            // Assert
            expect(language.name).toEqual('The name');
        });
    });
});
