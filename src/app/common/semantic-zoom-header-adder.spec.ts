import { IMock, Mock } from 'typemoq';
import { GuidFactory } from './guid.factory';
import { SemanticZoomHeaderAdder } from './semantic-zoom-header-adder';
import { SemanticZoomable } from './semantic-zoomable';

export class SemanticZoomableImplementation extends SemanticZoomable {
    public name: string;
    public displayName: string;
}

describe('SemanticZoomHeaderAdder', () => {
    let guidFactoryMock: IMock<GuidFactory>;
    let semanticZoomHeaderAdder: SemanticZoomHeaderAdder;

    const semanticZoomable1: SemanticZoomable = new SemanticZoomableImplementation();
    semanticZoomable1.displayName = 'Zoomable 1';
    const semanticZoomable2: SemanticZoomable = new SemanticZoomableImplementation();
    semanticZoomable2.displayName = 'Zoomable 2';
    const semanticZoomable3: SemanticZoomable = new SemanticZoomableImplementation();
    semanticZoomable3.displayName = 'Another zoomable 1';
    const semanticZoomable4: SemanticZoomable = new SemanticZoomableImplementation();
    semanticZoomable4.displayName = 'Another zoomable 2';

    beforeEach(() => {
        guidFactoryMock = Mock.ofType<GuidFactory>();
        semanticZoomHeaderAdder = new SemanticZoomHeaderAdder(guidFactoryMock.object);
    });

    describe('addZoomHeaders', () => {
        it('should add zoom headers on a list without zoom headers', () => {
            // Arrange
            let semanticZoomables: SemanticZoomable[] = [semanticZoomable1, semanticZoomable2, semanticZoomable3, semanticZoomable4];

            // Act
            semanticZoomables = semanticZoomHeaderAdder.addZoomHeaders(semanticZoomables);

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

        it('should not add additional zoom headers on a list which already has zoom headers', () => {
            // Arrange
            let semanticZoomables: SemanticZoomable[] = [semanticZoomable1, semanticZoomable2, semanticZoomable3, semanticZoomable4];

            // Act
            semanticZoomables = semanticZoomHeaderAdder.addZoomHeaders(semanticZoomables);
            semanticZoomables = semanticZoomHeaderAdder.addZoomHeaders(semanticZoomables);

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
