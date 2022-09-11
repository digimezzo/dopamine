import { RatingConverter } from './rating-converter';

describe('RatingConverter', () => {
    describe('starToPopMRating', () => {
        it('should return 0 when given 0', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.starToPopMRating(0);

            // Assert
            expect(popMRating).toEqual(0);
        });

        it('should return 1 when given 1', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.starToPopMRating(1);

            // Assert
            expect(popMRating).toEqual(1);
        });

        it('should return 64 when given 2', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.starToPopMRating(2);

            // Assert
            expect(popMRating).toEqual(64);
        });

        it('should return 128 when given 3', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.starToPopMRating(3);

            // Assert
            expect(popMRating).toEqual(128);
        });

        it('should return 196 when given 4', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.starToPopMRating(4);

            // Assert
            expect(popMRating).toEqual(196);
        });

        it('should return 255 when given 5', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.starToPopMRating(5);

            // Assert
            expect(popMRating).toEqual(255);
        });

        it('should return 0 when given 0.9', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.starToPopMRating(0.9);

            // Assert
            expect(popMRating).toEqual(0);
        });

        it('should return 0 when given 7', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.starToPopMRating(7);

            // Assert
            expect(popMRating).toEqual(0);
        });
    });

    describe('popM2StarRating', () => {
        it('should return 0 when given -1', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(-1);

            // Assert
            expect(popMRating).toEqual(0);
        });

        it('should return 0 when given 0', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(0);

            // Assert
            expect(popMRating).toEqual(0);
        });

        it('should return 1 when given 0.9', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(0.9);

            // Assert
            expect(popMRating).toEqual(1);
        });

        it('should return 1 when given 1', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(1);

            // Assert
            expect(popMRating).toEqual(1);
        });

        it('should return 2 when given 2', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(2);

            // Assert
            expect(popMRating).toEqual(2);
        });

        it('should return 2 when given 63', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(63);

            // Assert
            expect(popMRating).toEqual(2);
        });

        it('should return 2 when given 64', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(64);

            // Assert
            expect(popMRating).toEqual(2);
        });

        it('should return 3 when given 65', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(65);

            // Assert
            expect(popMRating).toEqual(3);
        });

        it('should return 3 when given 127', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(127);

            // Assert
            expect(popMRating).toEqual(3);
        });

        it('should return 3 when given 128', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(128);

            // Assert
            expect(popMRating).toEqual(3);
        });

        it('should return 4 when given 129', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(129);

            // Assert
            expect(popMRating).toEqual(4);
        });

        it('should return 4 when given 195', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(195);

            // Assert
            expect(popMRating).toEqual(4);
        });

        it('should return 4 when given 196', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(196);

            // Assert
            expect(popMRating).toEqual(4);
        });

        it('should return 5 when given 197', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(197);

            // Assert
            expect(popMRating).toEqual(5);
        });

        it('should return 5 when given 254', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(254);

            // Assert
            expect(popMRating).toEqual(5);
        });

        it('should return 5 when given 255', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(255);

            // Assert
            expect(popMRating).toEqual(5);
        });

        it('should return 0 when given 256', () => {
            // Arrange
            // Act
            const popMRating: number = RatingConverter.popM2StarRating(256);

            // Assert
            expect(popMRating).toEqual(0);
        });
    });
});
