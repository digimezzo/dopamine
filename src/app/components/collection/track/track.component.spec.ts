import { TrackComponent } from './track.component';

describe('TrackComponent', () => {
    let component: TrackComponent;

    beforeEach(() => {
        component = new TrackComponent();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare but not define Track', () => {
            // Arrange

            // Act

            // Assert
            expect(component.track).toBeUndefined();
        });

        it('should define canShowHeader as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.canShowHeader).toBeFalsy();
        });
    });
});
