import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import assert from 'assert';
import { StepIndicatorComponent } from './step-indicator.component';

describe('StepIndicatorComponent', () => {
    let componentWithInjection: StepIndicatorComponent;

    let component: StepIndicatorComponent;
    let fixture: ComponentFixture<StepIndicatorComponent>;

    beforeEach(() => {
        componentWithInjection = new StepIndicatorComponent();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [StepIndicatorComponent],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StepIndicatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should fill array of total steps', () => {
            // Arrange

            // Act
            componentWithInjection.totalSteps = 5;
            componentWithInjection.ngOnInit();

            // Assert
            assert.strictEqual(componentWithInjection.totalStepsCollection[0], 0);
            assert.strictEqual(componentWithInjection.totalStepsCollection[1], 1);
            assert.strictEqual(componentWithInjection.totalStepsCollection[2], 2);
            assert.strictEqual(componentWithInjection.totalStepsCollection[3], 3);
            assert.strictEqual(componentWithInjection.totalStepsCollection[4], 4);
        });
    });
});
