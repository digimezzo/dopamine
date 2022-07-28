import { Shuffler } from './shuffler';

describe('Shuffler', () => {
    describe('shuffle', () => {
        it('should shuffle a list', () => {
            // Arrange
            const shuffler: Shuffler = new Shuffler();
            const originalList: number[] = [0, 1, 2, 3, 4, 5];

            // Act
            const shuffledList: number[] = shuffler.shuffle(originalList);

            // Assert
            expect(
                shuffledList[0] === 0 &&
                    shuffledList[1] === 1 &&
                    shuffledList[2] === 2 &&
                    shuffledList[3] === 3 &&
                    shuffledList[4] === 4 &&
                    shuffledList[5] === 5
            ).toBeFalsy();
        });
    });
});
