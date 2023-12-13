import { Lyrics } from './lyrics';

describe('Lyrics', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const sut: Lyrics = new Lyrics('sourceName', 'text');

            // Assert
            expect(sut).toBeDefined();
        });

        it('should set sourceName', () => {
            // Arrange, Act
            const sut: Lyrics = new Lyrics('sourceName', 'text');

            // Assert
            expect(sut.sourceName).toEqual('sourceName');
        });

        it('should set text', () => {
            // Arrange, Act
            const sut: Lyrics = new Lyrics('sourceName', 'text');

            // Assert
            expect(sut.text).toEqual('text');
        });
    });

    describe('empty', () => {
        it('should create empty lyrics', () => {
            // Arrange, Act
            const sut: Lyrics = Lyrics.empty();

            // Assert
            expect(sut.sourceName).toEqual('');
            expect(sut.text).toEqual('');
        });
    });
});
