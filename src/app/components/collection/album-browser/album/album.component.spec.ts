import { AlbumComponent } from './album.component';

describe('AlbumComponent', () => {
    let component: AlbumComponent;

    beforeEach(() => {
        component = new AlbumComponent();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare but not define Album', () => {
            // Arrange

            // Act

            // Assert
            expect(component.album).toBeUndefined();
        });

        it('should define sanitizer', () => {
            // Arrange

            // Act

            // Assert
            expect(component.sanitizer).toBeDefined();
        });

        it('should define isSelected as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isSelected).toBeFalsy();
        });
    });
});
