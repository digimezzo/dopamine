import { StepIndicatorComponent } from './step-indicator.component';

describe('StepIndicatorComponent', () => {
    let component: StepIndicatorComponent;

    beforeEach(() => {
        component = new StepIndicatorComponent();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should fill array of total steps', () => {
            // Arrange

            // Act
            component.totalSteps = 5;
            component.ngOnInit();

            // Assert
            expect(component.totalStepsCollection[0]).toEqual(0);
            expect(component.totalStepsCollection[1]).toEqual(1);
            expect(component.totalStepsCollection[2]).toEqual(2);
            expect(component.totalStepsCollection[3]).toEqual(3);
            expect(component.totalStepsCollection[4]).toEqual(4);
        });
    });
});
