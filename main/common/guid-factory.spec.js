const { GuidFactory } = require('./guid-factory');

describe('GuidFactory', () => {
    describe('create', () => {
        it('should create id that has a length of 36 characters', () => {
            // Arrange, Act, Assert
            expect(GuidFactory.create().length).toEqual(36);
        });

        it('should create unique ids', () => {
            // Arrange, Act
            const id1 = GuidFactory.create();
            const id2 = GuidFactory.create();

            // Assert
            expect(id1).not.toEqual(id2);
        });
    });
});
