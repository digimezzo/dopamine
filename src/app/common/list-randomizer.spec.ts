import { ListRandomizer } from './list-randomizer';

describe('ListRandomizer', () => {
    describe('randomizeNumbers', () => {
        it('should randomize a list of numbers', () => {
            // Arrange
            const listRandomizer: ListRandomizer = new ListRandomizer();
            const listOfNumbers: number[] = [0, 1, 2, 3, 4, 5];

            // Act
            const randomizedListOfNumbers: number[] = listRandomizer.randomizeNumbers(listOfNumbers);

            // Assert
            expect(
                randomizedListOfNumbers[0] === 0 &&
                    randomizedListOfNumbers[1] === 1 &&
                    randomizedListOfNumbers[2] === 2 &&
                    randomizedListOfNumbers[3] === 3 &&
                    randomizedListOfNumbers[4] === 4 &&
                    randomizedListOfNumbers[5] === 5
            ).toBeFalsy();
        });
    });
});
