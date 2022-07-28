import { TotalsComponent } from './totals.component';

describe('SnackBarComponent', () => {
    let component: TotalsComponent;

    beforeEach(() => {
        component = new TotalsComponent();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define totalFileSizeInBytes', () => {
            // Arrange

            // Act

            // Assert
            expect(component.totalFileSizeInBytes).toBeDefined();
        });

        it('should set totalFileSizeInBytes to 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.totalFileSizeInBytes).toEqual(0);
        });

        it('should define totalDurationInMilliseconds', () => {
            // Arrange

            // Act

            // Assert
            expect(component.totalDurationInMilliseconds).toBeDefined();
        });

        it('should set totalDurationInMilliseconds to 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.totalDurationInMilliseconds).toEqual(0);
        });
    });
});
