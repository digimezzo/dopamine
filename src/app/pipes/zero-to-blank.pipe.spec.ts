import { ZeroToBlankPipe } from './zero-to-blank.pipe';

describe('ZeroToBlankPipe', () => {
    describe('transform', () => {
        it('should return empty when number is undefined', () => {
            // Arrange
            const pipe: ZeroToBlankPipe = new ZeroToBlankPipe();

            // Act
            const numberAsString: string = pipe.transform(undefined);

            // Assert
            expect(numberAsString).toEqual('');
        });

        it('should return empty when number is 0', () => {
            // Arrange
            const pipe: ZeroToBlankPipe = new ZeroToBlankPipe();

            // Act
            const numberAsString: string = pipe.transform(0);

            // Assert
            expect(numberAsString).toEqual('');
        });

        it('should return the number as string when the number is defined and not 0', () => {
            // Arrange
            const pipe: ZeroToBlankPipe = new ZeroToBlankPipe();

            // Act
            const numberAsString: string = pipe.transform(2022);

            // Assert
            expect(numberAsString).toEqual('2022');
        });
    });
});
