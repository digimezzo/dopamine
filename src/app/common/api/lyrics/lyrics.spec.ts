import { Lyrics } from './lyrics';

describe('Lyrics', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: Lyrics = new Lyrics('sourceName', 'text');

            // Assert
            expect(instance).toBeDefined();
        });

        it('should set sourceName', () => {
            // Arrange, Act
            const instance: Lyrics = new Lyrics('sourceName', 'text');

            // Assert
            expect(instance.sourceName).toEqual('sourceName');
        });

        it('should set text', () => {
            // Arrange, Act
            const instance: Lyrics = new Lyrics('sourceName', 'text');

            // Assert
            expect(instance.text).toEqual('text');
        });
    });
});
