import { AlphabeticalHeaderPipe } from './alphabetical-header.pipe';

describe('AlphabeticalHeaderPipe', () => {
    describe('transform', () => {
        it('should return "g" when given "gathering"', () => {
            // Arrange
            const alphabeticalHeaderPipe: AlphabeticalHeaderPipe = new AlphabeticalHeaderPipe();

            // Act
            const alphabeticalHeader: string = alphabeticalHeaderPipe.transform('gathering');

            // Assert
            expect(alphabeticalHeader).toEqual('g');
        });

        it('should return "z" when given "zz top"', () => {
            // Arrange
            const alphabeticalHeaderPipe: AlphabeticalHeaderPipe = new AlphabeticalHeaderPipe();

            // Act
            const alphabeticalHeader: string = alphabeticalHeaderPipe.transform('zz top');

            // Assert
            expect(alphabeticalHeader).toEqual('z');
        });

        it('should return "l" when given "lacuna coil"', () => {
            // Arrange
            const alphabeticalHeaderPipe: AlphabeticalHeaderPipe = new AlphabeticalHeaderPipe();

            // Act
            const alphabeticalHeader: string = alphabeticalHeaderPipe.transform('lacuna coil');

            // Assert
            expect(alphabeticalHeader).toEqual('l');
        });

        it('should return "#" when given "% alcohol"', () => {
            // Arrange
            const alphabeticalHeaderPipe: AlphabeticalHeaderPipe = new AlphabeticalHeaderPipe();

            // Act
            const alphabeticalHeader: string = alphabeticalHeaderPipe.transform('% alcohol');

            // Assert
            expect(alphabeticalHeader).toEqual('#');
        });

        it('should return "#" when given "1 singer"', () => {
            // Arrange
            const alphabeticalHeaderPipe: AlphabeticalHeaderPipe = new AlphabeticalHeaderPipe();

            // Act
            const alphabeticalHeader: string = alphabeticalHeaderPipe.transform('1 singer');

            // Assert
            expect(alphabeticalHeader).toEqual('#');
        });

        it('should return "#" when given "1979"', () => {
            // Arrange
            const alphabeticalHeaderPipe: AlphabeticalHeaderPipe = new AlphabeticalHeaderPipe();

            // Act
            const alphabeticalHeader: string = alphabeticalHeaderPipe.transform('1979');

            // Assert
            expect(alphabeticalHeader).toEqual('#');
        });
    });
});
