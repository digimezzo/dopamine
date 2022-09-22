import { SemanticZoomHeaderAdder } from './semantic-zoom-header-adder';
import { SemanticZoomable } from './semantic-zoomable';

export class SemanticZoomableImplementation extends SemanticZoomable {
    public name: string;
    public displayName: string;
}

describe('SemanticZoomHeaderAdder', () => {
    let semanticZoomHeaderAdder: SemanticZoomHeaderAdder;

    const semanticZoomable1: SemanticZoomable = new SemanticZoomableImplementation();
    semanticZoomable1.name = 'Zoomable 1';
    const semanticZoomable2: SemanticZoomable = new SemanticZoomableImplementation();
    semanticZoomable2.name = 'Zoomable 2';
    const semanticZoomable3: SemanticZoomable = new SemanticZoomableImplementation();
    semanticZoomable3.name = 'Another zoomable 1';
    const semanticZoomable4: SemanticZoomable = new SemanticZoomableImplementation();
    semanticZoomable4.name = 'Another zoomable 2';

    beforeEach(() => {
        semanticZoomHeaderAdder = new SemanticZoomHeaderAdder();
    });

    describe('addZoomHeaders', () => {
        it('should add zoom headers', () => {
            // Arrange
            const semanticZoomables: SemanticZoomable[] = [semanticZoomable1, semanticZoomable2, semanticZoomable3, semanticZoomable4];

            // Act
            semanticZoomHeaderAdder.addZoomHeaders(semanticZoomables);

            // Assert
            expect(semanticZoomables.length).toEqual(6);
            expect(semanticZoomables[0].isZoomHeader).toBeTruthy();
            expect(semanticZoomables[0].zoomHeader).toEqual('z');
            expect(semanticZoomables[1].isZoomHeader).toBeFalsy();
            expect(semanticZoomables[2].isZoomHeader).toBeFalsy();
            expect(semanticZoomables[3].isZoomHeader).toBeTruthy();
            expect(semanticZoomables[3].zoomHeader).toEqual('a');
            expect(semanticZoomables[4].isZoomHeader).toBeFalsy();
            expect(semanticZoomables[5].isZoomHeader).toBeFalsy();
        });
    });
});
