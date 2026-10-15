import { IMock, Mock, Times } from 'typemoq';
import { SemanticZoomable } from '../../../../common/semantic-zoomable';
import { SemanticZoomComponent } from './semantic-zoom.component';
import { SchedulerBase } from '../../../../common/scheduling/scheduler.base';
import { Constants } from '../../../../common/application/constants';
import { GenreModel } from '../../../../services/genre/genre-model';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';

export class SemanticZoomableImplementation extends SemanticZoomable {
    public constructor(
        public name: string,
        public displayName: string,
    ) {
        super();
    }
}

describe('SemanticZoomComponent', () => {
    let schedulerMock: IMock<SchedulerBase>;
    let component: SemanticZoomComponent;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        schedulerMock = Mock.ofType<SchedulerBase>();
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

    it('should insert only populated Turkish headers and remove them when the list changes', () => {
        const translator = Mock.ofType<TranslatorServiceBase>().object;
        component.SemanticZoomables = ['\u00c7ile', '\u0130lahi', '\u015eark\u0131', '\u00c7ile'].map(
            (name) => new GenreModel(name, translator),
        );
        expect(component.buttonTexts.flat()).toEqual([
            '#',
            'a',
            'b',
            'c',
            '\u00e7',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'i\u0307',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            '\u015f',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
        ]);
        expect(component.buttonTexts.every((row) => row.length <= 4)).toBe(true);
        expect(component.isZoomable('i\u0307')).toBe(true);
        expect(component.isZoomable('\u011f')).toBe(false);

        component.SemanticZoomables = [new GenreModel('Rock', translator)];
        expect(component.buttonTexts.flat()).toEqual(Constants.alphabeticalHeaders);
    });

    it.each([
        ['\u00c7', '\u00e7', 'c'],
        ['\u011e', '\u011f', 'g'],
        ['\u0130', 'i\u0307', 'i'],
        ['\u00d6', '\u00f6', 'o'],
        ['\u015e', '\u015f', 's'],
        ['\u00dc', '\u00fc', 'u'],
    ])('should insert %s immediately after its base header', (name, header, base) => {
        component.SemanticZoomables = [new GenreModel(name, Mock.ofType<TranslatorServiceBase>().object)];
        const headers = component.buttonTexts.flat();
        expect(headers).toHaveLength(Constants.alphabeticalHeaders.length + 1);
        expect(headers[headers.indexOf(base) + 1]).toBe(header);
        expect(component.isZoomable(header)).toBe(true);
        component.SemanticZoomables = [];
        expect(component.buttonTexts.flat()).toEqual(Constants.alphabeticalHeaders);
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
