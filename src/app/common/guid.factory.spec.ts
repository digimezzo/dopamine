import { GuidFactory } from './guid.factory';

describe('GuidFactory', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const guidFactory: GuidFactory = new GuidFactory();

            // Assert
            expect(guidFactory).toBeDefined();
        });
    });

    describe('create', () => {
        it('should create id that has a length of 36 characters', () => {
            // Arrange
            const guidFactory: GuidFactory = new GuidFactory();

            // Act, Assert
            expect(guidFactory.create().length).toEqual(36);
        });

        it('should create unique ids', () => {
            // Arrange
            const guidFactory: GuidFactory = new GuidFactory();

            // Act
            const id1: string = guidFactory.create();
            const id2: string = guidFactory.create();

            // Assert
            expect(id1).not.toEqual(id2);
        });
    });
});
