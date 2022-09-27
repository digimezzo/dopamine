import { SemanticZoomable } from '../../../common/semantic-zoomable';
import { SemanticZoomComponent } from './semantic-zoom.component';

export class SemanticZoomableImplementation extends SemanticZoomable {
    public constructor(public name: string, public displayName: string) {
        super();
    }
}

describe('SemanticZoomComponent', () => {
    let component: SemanticZoomComponent;

    beforeEach(() => {
        component = new SemanticZoomComponent();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare SemanticZoomables as empty array', () => {
            // Arrange

            // Act

            // Assert
            expect(component.SemanticZoomables).toEqual([]);
        });

        it('should declare buttontexts', () => {
            // Arrange

            // Act

            // Assert
            expect(component.buttonTexts).toEqual([
                ['#', 'a', 'b', 'c'],
                ['d', 'e', 'f', 'g'],
                ['f', 'i', 'j', 'k'],
                ['l', 'm', 'n', 'o'],
                ['p', 'q', 'r', 's'],
                ['t', 'u', 'v', 'w'],
                ['x', 'y', 'z'],
            ]);
        });
    });

    describe('isZoomable', () => {
        it('should return true when text is found as SemanticZoomable zoomHeader', () => {
            // Arrange
            component.SemanticZoomables = [
                new SemanticZoomableImplementation('Lacuna Coil', 'Lacuna Coil'),
                new SemanticZoomableImplementation('Miss Monique', 'Miss Monique'),
            ];

            // Act
            const isZoomable: boolean = component.isZoomable('l');

            // Assert
            expect(isZoomable).toBeTruthy();
        });

        it('should return false when text is not found as SemanticZoomable zoomHeader', () => {
            // Arrange
            component.SemanticZoomables = [
                new SemanticZoomableImplementation('Lacuna Coil', 'Lacuna Coil'),
                new SemanticZoomableImplementation('Miss Monique', 'Miss Monique'),
            ];

            // Act
            const isZoomable: boolean = component.isZoomable('e');

            // Assert
            expect(isZoomable).toBeFalsy();
        });
    });
});
