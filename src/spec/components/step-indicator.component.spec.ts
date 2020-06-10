import * as assert from 'assert';
import { StepIndicatorComponent } from '../../app/components/step-indicator/step-indicator.component';

describe('StepIndicatorComponent', () => {
    describe('ngOnInit', () => {
        it('Should fill array of total steps', () => {
            // Arrange
            const stepIndicatorComponent: StepIndicatorComponent = new StepIndicatorComponent();

            // Act
            stepIndicatorComponent.totalSteps = 5;
            stepIndicatorComponent.ngOnInit();

            // Assert
            assert.strictEqual(stepIndicatorComponent.totalStepsCollection[0], 0);
            assert.strictEqual(stepIndicatorComponent.totalStepsCollection[1], 1);
            assert.strictEqual(stepIndicatorComponent.totalStepsCollection[2], 2);
            assert.strictEqual(stepIndicatorComponent.totalStepsCollection[3], 3);
            assert.strictEqual(stepIndicatorComponent.totalStepsCollection[4], 4);
        });
    });
});
