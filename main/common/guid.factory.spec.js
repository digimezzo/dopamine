const { GuidFactory } = require('./guid.factory');

describe('GuidFactory', () => {
    function createSut() {
        return new GuidFactory();
    }

    describe('create', () => {
        it('should create id that has a length of 36 characters', () => {
            // Arrange
            const sut = createSut();

            // Act, Assert
            expect(sut.create().length).toEqual(36);
        });

        it('should create unique ids', () => {
            // Arrange
            const sut = createSut();

            // Act
            const id1 = sut.create();
            const id2 = sut.create();

            // Assert
            expect(id1).not.toEqual(id2);
        });
    });
});
