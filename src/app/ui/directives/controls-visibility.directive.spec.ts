import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ControlsVisibilityDirective, ControlTooltipDirective } from './controls-visibility.directive';

@Component({
    selector: 'app-test-controls',
    template: '<button matTooltip="Pause">Pause</button>',
})
class TestControlsComponent {}

@Component({
    template: `
        <app-test-controls [appControlsHidden]="hidden"></app-test-controls>
        <button matTooltip="Unrelated" [matTooltipDisabled]="true">Unrelated</button>
    `,
})
class TestHostComponent {
    public hidden: boolean = false;
}

describe('ControlsVisibilityDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let tooltip: MatTooltip;
    let overlayContainer: OverlayContainer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatTooltipModule, NoopAnimationsModule],
            declarations: [TestHostComponent, TestControlsComponent, ControlsVisibilityDirective, ControlTooltipDirective],
        });
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        tooltip = fixture.debugElement.query(By.directive(TestControlsComponent)).query(By.directive(MatTooltip)).injector.get(MatTooltip);
        overlayContainer = TestBed.inject(OverlayContainer);
    });

    afterEach(() => {
        fixture.destroy();
        overlayContainer.ngOnDestroy();
    });

    it('hides a visible tooltip when controls fade without mouse movement', fakeAsync(() => {
        tooltip.show();
        tick();
        fixture.detectChanges();
        expect(overlayContainer.getContainerElement().textContent).toContain('Pause');

        fixture.componentInstance.hidden = true;
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();
        tick();

        expect(tooltip.disabled).toBe(true);
        expect(overlayContainer.getContainerElement().textContent).not.toContain('Pause');
    }));

    it('cancels a pending tooltip and prevents tooltips while controls are hidden', fakeAsync(() => {
        tooltip.show(500);
        fixture.componentInstance.hidden = true;
        fixture.detectChanges();
        tick(1000);
        tooltip.show();
        tick(1000);

        expect(overlayContainer.getContainerElement().textContent).not.toContain('Pause');
    }));

    it('enables tooltips again when controls become visible', fakeAsync(() => {
        fixture.componentInstance.hidden = true;
        fixture.detectChanges();
        fixture.componentInstance.hidden = false;
        fixture.detectChanges();
        tooltip.show();
        tick();
        fixture.detectChanges();

        expect(tooltip.disabled).toBe(false);
        expect(overlayContainer.getContainerElement().textContent).toContain('Pause');
    }));

    it('leaves tooltips outside the fading controls unchanged', () => {
        const unrelatedTooltip = fixture.debugElement.queryAll(By.directive(MatTooltip))[1].injector.get(MatTooltip);
        fixture.componentInstance.hidden = true;
        fixture.detectChanges();
        fixture.componentInstance.hidden = false;
        fixture.detectChanges();

        expect(unrelatedTooltip.disabled).toBe(true);
    });

    it('unsubscribes when a tooltip is destroyed', () => {
        const scope = fixture.debugElement.query(By.directive(ControlsVisibilityDirective)).injector.get(ControlsVisibilityDirective);
        fixture.destroy();
        scope.appControlsHidden = true;

        expect(tooltip.disabled).toBe(false);
    });
});
