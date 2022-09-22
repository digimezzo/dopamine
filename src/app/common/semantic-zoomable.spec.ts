import { SemanticZoomable } from './semantic-zoomable';

export class SemanticZoomableImplementation extends SemanticZoomable {
    public name: string;
    public displayName: string;
    public isZoomHeader: boolean;
}

describe('SemanticZoomable', () => {
    let semanticZoomable: SemanticZoomable;

    beforeEach(() => {
        semanticZoomable = new SemanticZoomableImplementation();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            // Act
            // Assert
            expect(semanticZoomable).toBeDefined();
        });

        it('should define isZoomHeader as false', () => {
            // Arrange
            // Act
            // Assert
            expect(semanticZoomable.isZoomHeader).toBeFalsy();
        });
    });

    describe('sortableName', () => {
        it('should return a sortable name', () => {
            // Arrange
            semanticZoomable = new SemanticZoomableImplementation();
            semanticZoomable.name = 'The Text';

            // Act
            const sortableName: string = semanticZoomable.sortableName;

            // Assert
            expect(sortableName).toEqual('text');
        });
    });

    describe('header', () => {
        it('should return a header containing a letter if the first letter is known as alphabetical header', () => {
            // Arrange
            semanticZoomable = new SemanticZoomableImplementation();
            semanticZoomable.name = 'The Text';

            // Act
            const header: string = semanticZoomable.zoomHeader;

            // Assert
            expect(header).toEqual('t');
        });

        it('should return a header containing a letter if the first letter is not known as alphabetical header', () => {
            // Arrange
            semanticZoomable = new SemanticZoomableImplementation();
            semanticZoomable.name = '1 Text';

            // Act
            const header: string = semanticZoomable.zoomHeader;

            // Assert
            expect(header).toEqual('#');
        });
    });
});
