import * as assert from 'assert';
import { StepIndicatorComponent } from '../../app/components/step-indicator/step-indicator.component';

describe('StepIndicatorComponent', () => {
    describe('ngOnInit', () => {
        it('Should fill array of total steps', () => {
            // Arrange
            let stepIndicatorComponent: StepIndicatorComponent = new StepIndicatorComponent();

            // Act
            stepIndicatorComponent.totalSteps = 5;
            stepIndicatorComponent.ngOnInit();

            // Assert
            assert.equal(stepIndicatorComponent.totalStepsCollection[0], 0);
            assert.equal(stepIndicatorComponent.totalStepsCollection[1], 1);
            assert.equal(stepIndicatorComponent.totalStepsCollection[2], 2);
            assert.equal(stepIndicatorComponent.totalStepsCollection[3], 3);
            assert.equal(stepIndicatorComponent.totalStepsCollection[4], 4);
        });
    });
});