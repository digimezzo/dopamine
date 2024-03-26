const { MathUtils } = require('./math-utils');
describe('MathUtils', () => {
    describe('calculatePercentage', () => {
        it('should return 0 when given 0 and 46', () => {
            // Arrange, Act, Assert
            expect(MathUtils.calculatePercentage(0, 46)).toBe(0);
        });

        it('should return 100 when given 46 and 46', () => {
            // Arrange, Act, Assert
            expect(MathUtils.calculatePercentage(46, 46)).toBe(100);
        });

        it('should return 43 when given 20 and 46', () => {
            // Arrange, Act, Assert
            expect(MathUtils.calculatePercentage(20, 46)).toBe(43);
        });

        it('should return 85 when given 39 and 46', () => {
            // Arrange, Act, Assert
            expect(MathUtils.calculatePercentage(39, 46)).toBe(85);
        });
    });
});
