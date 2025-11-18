const { RatingConverter } = require('./rating-converter');

describe('RatingConverter', () => {
    describe('starToPopMRating', () => {
        it('should return 0 when given 0', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(0);

            // Assert
            expect(popMRating).toEqual(0);
        });

        it('should return 13 when given 1', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(1);

            // Assert
            expect(popMRating).toEqual(13);
        });

        it('should return 1 when given 2', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(2);

            // Assert
            expect(popMRating).toEqual(1);
        });

        it('should return 54 when given 3', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(3);

            // Assert
            expect(popMRating).toEqual(54);
        });

        it('should return 64 when given 4', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(4);

            // Assert
            expect(popMRating).toEqual(64);
        });

        it('should return 118 when given 5', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(5);

            // Assert
            expect(popMRating).toEqual(118);
        });

        it('should return 128 when given 6', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(6);

            // Assert
            expect(popMRating).toEqual(128);
        });

        it('should return 186 when given 7', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(7);

            // Assert
            expect(popMRating).toEqual(186);
        });

        it('should return 196 when given 8', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(8);

            // Assert
            expect(popMRating).toEqual(196);
        });

        it('should return 242 when given 9', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(9);

            // Assert
            expect(popMRating).toEqual(242);
        });

        it('should return 255 when given 10', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(10);

            // Assert
            expect(popMRating).toEqual(255);
        });

        it('should return 0 when given 11', () => {
            // Arrange, Act
            const popMRating = RatingConverter.starToPopMRating(11);

            // Assert
            expect(popMRating).toEqual(0);
        });
    });

    describe('popMToStarRating', () => {
        it('should return 0 when given 0', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(0);

            // Assert
            expect(popMRating).toEqual(0);
        });

        it('should return 2 when given 1', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(1);

            // Assert
            expect(popMRating).toEqual(2);
        });

        it('should return 4 when given 64', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(64);

            // Assert
            expect(popMRating).toEqual(4);
        });

        it('should return 6 when given 128', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(128);

            // Assert
            expect(popMRating).toEqual(6);
        });

        it('should return 8 when given 196', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(196);

            // Assert
            expect(popMRating).toEqual(8);
        });

        it('should return 10 when given 255', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(255);

            // Assert
            expect(popMRating).toEqual(10);
        });

        it('should return 1 when given 53', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(53);

            // Assert
            expect(popMRating).toEqual(1);
        });

        it('should return 3 when given 63', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(63);

            // Assert
            expect(popMRating).toEqual(3);
        });

        it('should return 5 when given 127', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(127);

            // Assert
            expect(popMRating).toEqual(5);
        });

        it('should return 7 when given 195', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(195);

            // Assert
            expect(popMRating).toEqual(7);
        });

        it('should return 9 when given 254', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(254);

            // Assert
            expect(popMRating).toEqual(9);
        });

        it('should return 0 when given 256', () => {
            // Arrange, Act
            const popMRating = RatingConverter.popMToStarRating(256);

            // Assert
            expect(popMRating).toEqual(0);
        });
    });
});
