import { AnimatedPage } from './animated-page';

describe('AnimatedPage', () => {
    let animatedPage: AnimatedPage;

    beforeEach(() => {});

    describe('rightToLeft', () => {
        it('should return true when page is the same and previous page is greater', () => {
            // Arrange
            animatedPage = new AnimatedPage();
            animatedPage.page = 1;
            animatedPage.previousPage = 2;

            // Act, Assert
            expect(animatedPage.rightToLeft(1)).toBeTruthy();
        });

        it('should return false when page is the same and previous page is less', () => {
            // Arrange
            animatedPage = new AnimatedPage();
            animatedPage.page = 1;
            animatedPage.previousPage = 0;

            // Act, Assert
            expect(animatedPage.rightToLeft(1)).toBeFalsy();
        });

        it('should return false when page is different', () => {
            // Arrange
            animatedPage = new AnimatedPage();
            animatedPage.page = 1;
            animatedPage.previousPage = 2;

            // Act, Assert
            expect(animatedPage.rightToLeft(2)).toBeFalsy();
        });
    });

    describe('leftToRight', () => {
        it('should return true when page is the same and previous page is less or equal', () => {
            // Arrange
            animatedPage = new AnimatedPage();
            animatedPage.page = 1;
            animatedPage.previousPage = 1;

            // Act, Assert
            expect(animatedPage.leftToRight(1)).toBeTruthy();
        });

        it('should return false when page is the same and previous page is greater', () => {
            // Arrange
            animatedPage = new AnimatedPage();
            animatedPage.page = 1;
            animatedPage.previousPage = 2;

            // Act, Assert
            expect(animatedPage.leftToRight(1)).toBeFalsy();
        });

        it('should return false when page is different', () => {
            // Arrange
            animatedPage = new AnimatedPage();
            animatedPage.page = 1;
            animatedPage.previousPage = 2;

            // Act, Assert
            expect(animatedPage.leftToRight(2)).toBeFalsy();
        });
    });

    describe('setPage', () => {
        it('should set previousPage to page', () => {
            // Arrange
            animatedPage = new AnimatedPage();
            animatedPage.page = 1;

            // Act
            animatedPage.setPage(2);

            // Assert
            expect(animatedPage.previousPage).toEqual(1);
        });

        it('should set page to page', () => {
            // Arrange
            animatedPage = new AnimatedPage();
            animatedPage.page = 1;

            // Act
            animatedPage.setPage(2);

            // Assert

            expect(animatedPage.page).toEqual(2);
        });
    });
});
