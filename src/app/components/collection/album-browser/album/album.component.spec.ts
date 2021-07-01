import { DomSanitizer } from '@angular/platform-browser';
import { IMock, Mock } from 'typemoq';
import { AlbumComponent } from './album.component';

describe('AlbumComponent', () => {
    let domSanitizerMock: IMock<DomSanitizer>;
    let component: AlbumComponent;

    beforeEach(() => {
        domSanitizerMock = Mock.ofType<DomSanitizer>();
        component = new AlbumComponent(domSanitizerMock.object);
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
            expect(component.domSanitizer).toBeDefined();
        });

        it('should define isSelected as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isSelected).toBeFalsy();
        });

        it('should define domSanitizer', () => {
            // Arrange

            // Act

            // Assert
            expect(component.domSanitizer).toBeDefined();
        });
    });
});
