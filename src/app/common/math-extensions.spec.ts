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
});
