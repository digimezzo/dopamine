import { ThemeAuthor } from './theme-author';

describe('ThemeAuthor', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');

            // Assert
            expect(author).toBeDefined();
        });

        it('should set name', () => {
            // Arrange
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');

            // Act

            // Assert
            expect(author.name).toEqual('My creator');
        });

        it('should set email', () => {
            // Arrange
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');

            // Act

            // Assert
            expect(author.email).toEqual('my@email.com');
        });
    });
});
