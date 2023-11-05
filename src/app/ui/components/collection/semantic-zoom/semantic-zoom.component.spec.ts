import { IMock, Mock, Times } from 'typemoq';
import { Constants } from '../../../common/application/constants';
import { BaseScheduler } from '../../../common/scheduling/base-scheduler';
import { SemanticZoomable } from '../../../common/semantic-zoomable';
import { SemanticZoomComponent } from './semantic-zoom.component';

export class SemanticZoomableImplementation extends SemanticZoomable {
    public constructor(public name: string, public displayName: string) {
        super();
    }
}

describe('SemanticZoomComponent', () => {
    let schedulerMock: IMock<BaseScheduler>;
    let component: SemanticZoomComponent;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        schedulerMock = Mock.ofType<BaseScheduler>();
        component = new SemanticZoomComponent(schedulerMock.object);
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
                ['h', 'i', 'j', 'k'],
                ['l', 'm', 'n', 'o'],
                ['p', 'q', 'r', 's'],
                ['t', 'u', 'v', 'w'],
                ['x', 'y', 'z'],
            ]);
        });
    });

    describe('ngOnInit', () => {
        it('should sleep and set fadeIn to visible', async () => {
            // Arrange
            component.fadeIn = 'hidden';

            // Act
            await component.ngOnInit();
            await flushPromises();

            // Assert
            schedulerMock.verify((x) => x.sleepAsync(Constants.semanticZoomOutDelayMilliseconds), Times.once());
            expect(component.fadeIn).toEqual('visible');
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
