import { ThemeCreator } from './theme-creator';

describe('ThemeCreator', () => {
    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');

            // Assert
            expect(creator).toBeDefined();
        });

        it('should set name', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');

            // Act

            // Assert
            expect(creator.name).toEqual('My creator');
        });

        it('should set email', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');

            // Act

            // Assert
            expect(creator.email).toEqual('my@email.com');
        });
    });
});
