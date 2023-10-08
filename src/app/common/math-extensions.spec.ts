import { MathExtensions } from './math-extensions';

describe('MathExtensions', () => {
    let mathExtensions: MathExtensions;

    beforeEach(() => {
        mathExtensions = new MathExtensions();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(mathExtensions).toBeDefined();
        });
    });

    describe('clamp', () => {
        it('should return the maximum number of the proposed number is larger than the maximum number', () => {
            // Arrange
            const proposedNumber: number = 600;
            const minimumNumber: number = 0;
            const maximumNumber: number = 500;

            // Act
            const clampedNumber: number = mathExtensions.clamp(proposedNumber, minimumNumber, maximumNumber);

            // Assert
            expect(clampedNumber).toEqual(maximumNumber);
        });

        it('should return the maximum number of the proposed number equals the maximum number', () => {
            // Arrange
            const proposedNumber: number = 500;
            const minimumNumber: number = 0;
            const maximumNumber: number = 500;

            // Act
            const clampedNumber: number = mathExtensions.clamp(proposedNumber, minimumNumber, maximumNumber);

            // Assert
            expect(clampedNumber).toEqual(maximumNumber);
        });

        it('should return the minimum number of the proposed number is less than the minimum number', () => {
            // Arrange
            const proposedNumber: number = -50;
            const minimumNumber: number = 0;
            const maximumNumber: number = 500;

            // Act
            const clampedNumber: number = mathExtensions.clamp(proposedNumber, minimumNumber, maximumNumber);

            // Assert
            expect(clampedNumber).toEqual(minimumNumber);
        });

        it('should return the minimum number of the proposed number equals the minimum number', () => {
            // Arrange
            const proposedNumber: number = 0;
            const minimumNumber: number = 0;
            const maximumNumber: number = 500;

            // Act
            const clampedNumber: number = mathExtensions.clamp(proposedNumber, minimumNumber, maximumNumber);

            // Assert
            expect(clampedNumber).toEqual(minimumNumber);
        });

        it('should return the proposed number of the proposed number is larger than the minimum number and less than the maximum number', () => {
            // Arrange
            const proposedNumber: number = 80;
            const minimumNumber: number = 0;
            const maximumNumber: number = 500;

            // Act
            const clampedNumber: number = mathExtensions.clamp(proposedNumber, minimumNumber, maximumNumber);

            // Assert
            expect(clampedNumber).toEqual(proposedNumber);
        });
    });

    describe('linearToLogarithmic', () => {
        it('should convert the minimum linear value to the minimum logarithmic value', () => {
            // Arrange
            const minLinear = 0;

            // Act
            const minLogarithmic = mathExtensions.linearToLogarithmic(minLinear, 0.01, 1.0);

            // Assert
            expect(minLogarithmic).toBeCloseTo(0.01);
        });

        it('should convert the maximum linear value to the maximum logarithmic value', () => {
            // Arrange
            const maxLinear = 1.0;

            // Act
            const maxLogarithmic = mathExtensions.linearToLogarithmic(maxLinear, 0.01, 1.0);

            // Assert
            expect(maxLogarithmic).toBeCloseTo(1.0);
        });

        it('should convert a linear value in the middle of the range to a logarithmic value', () => {
            // Arrange
            const middleLinear = 0.5;

            // Act
            const logarithmicValue = mathExtensions.linearToLogarithmic(middleLinear, 0.01, 1.0);

            // Calculate the expected logarithmic value manually
            const minLog = Math.log(0.01);
            const maxLog = Math.log(1.0);
            const scale = (maxLog - minLog) / (1.0 - 0.01);
            const expectedLogarithmic = Math.exp(minLog + scale * (middleLinear - 0.01));

            // Assert
            expect(logarithmicValue).toBeCloseTo(expectedLogarithmic);
        });
    });
});
