import assert from 'assert';
import { StepIndicatorComponent } from './step-indicator.component';

describe('StepIndicatorComponent', () => {
    let component: StepIndicatorComponent;

    beforeEach(() => {
        component = new StepIndicatorComponent();
    });

    describe('ngOnInit', () => {
        it('should fill array of total steps', () => {
            // Arrange

            // Act
            component.totalSteps = 5;
            component.ngOnInit();

            // Assert
            assert.strictEqual(component.totalStepsCollection[0], 0);
            assert.strictEqual(component.totalStepsCollection[1], 1);
            assert.strictEqual(component.totalStepsCollection[2], 2);
            assert.strictEqual(component.totalStepsCollection[3], 3);
            assert.strictEqual(component.totalStepsCollection[4], 4);
        });
    });
});
