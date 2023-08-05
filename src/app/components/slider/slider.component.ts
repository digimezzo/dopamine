import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../common/logger';
import { MathExtensions } from '../../common/math-extensions';
import { NativeElementProxy } from '../../common/native-element-proxy';

@Component({
    selector: 'app-slider',
    host: { style: 'display: block' },
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SliderComponent {
    private _value: number = 0;
    private sliderThumbWidth: number = 12;
    private mouseIsOverSlider = false;

    public constructor(private nativeElementProxy: NativeElementProxy, private mathExtensions: MathExtensions, private logger: Logger) {}

    @Input()
    public sliderThumbMargin: number = 0;

    @Input()
    public stepSize: number = 0.1;

    @Input()
    public mouseStepSize: number = 0.05;

    @Input()
    public maximum: number = 1;

    public get value(): number {
        return this._value;
    }

    @Input()
    public set value(v: number) {
        this._value = v;
    }

    @Output()
    public valueChange: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild('sliderTrack')
    public sliderTrack: ElementRef;

    public showSliderThumb: boolean = false;
    private isSliderThumbDown: boolean = false;

    public sliderBarPosition: number = 0;
    public sliderThumbPosition: number = 0;

    public isSliderDragged: boolean = false;
    public isSliderContainerDown: boolean = false;

    public onSliderThumbMouseDown(): void {
        this.isSliderThumbDown = true;
    }

    public onSliderContainerMouseEnter(): void {
        this.mouseIsOverSlider = true;
        this.showSliderThumb = true;
    }

    public onSliderContainerMouseLeave(): void {
        this.mouseIsOverSlider = false;

        if (!this.isSliderThumbDown) {
            this.showSliderThumb = false;
        }
    }

    public onSliderContainerMouseDown(e: any): void {
        this.applyPosition(this.getMouseXPositionRelativeToSlider(e.clientX));
    }

    @HostListener('document:mousedown', ['$event'])
    public onDocumentMouseDown(e: any): void {
        // Checking this.mouseIsOverSlider prevents cancelling mousedown when clicking on other elements (e.g. search box)
        if (this.mouseIsOverSlider) {
            // HACK: prevents document:mouseup from not being fired sometimes.
            // See: https://stackoverflow.com/questions/9506041/events-mouseup-not-firing-after-mousemove
            e.preventDefault();
        }
    }

    @HostListener('document:mouseup', ['$event'])
    public onDocumentMouseUp(e: any): void {
        this.isSliderThumbDown = false;
    }

    @HostListener('document:mousemove', ['$event'])
    public onDocumentMouseMove(e: any): void {
        if (this.isSliderThumbDown) {
            this.applyPosition(this.getMouseXPositionRelativeToSlider(e.clientX));
        }
    }

    public onSliderContainerMouseWheel(event: any): void {
        const mouseStepConvertedToSliderScale: number = this.getMouseStepConvertedToSliderScale();
        let newPosition: number = this.sliderBarPosition + mouseStepConvertedToSliderScale;
        if (event.deltaY > 0) {
            newPosition = this.sliderBarPosition - mouseStepConvertedToSliderScale;
        }
        this.applyPosition(newPosition);
    }

    private getMouseStepConvertedToSliderScale(): number {
        const sliderWidth: number = this.sliderTrack.nativeElement.offsetWidth;
        const mouseStepUsingSliderScale: number = (this.mouseStepSize / this.maximum) * sliderWidth;

        return mouseStepUsingSliderScale;
    }

    private applyPosition(position: number): void {
        try {
            const sliderWidth: number = this.sliderTrack.nativeElement.offsetWidth;

            this.sliderBarPosition = this.mathExtensions.clamp(position, 0, sliderWidth);

            this.sliderThumbPosition = this.mathExtensions.clamp(
                position - this.sliderThumbWidth / 2,
                this.sliderThumbMargin - this.sliderThumbWidth / 2,
                sliderWidth - this.sliderThumbMargin - this.sliderThumbWidth / 2
            );

            this.calculateValue();
        } catch (e) {
            this.logger.error(`Could not apply position. Error: ${e.message}`, 'SliderComponent', 'applyPosition');
        }
    }

    private getMouseXPositionRelativeToSlider(clientX: number): number {
        const element: any = this.sliderTrack.nativeElement;
        const rect: any = element.getBoundingClientRect();

        return clientX - rect.left;
    }

    private calculateValue(): void {
        const sliderWidth: number = this.nativeElementProxy.getElementWidth(this.sliderTrack);

        const valueFraction: number = this.sliderBarPosition / sliderWidth;
        const totalSteps: number = this.maximum / this.stepSize;
        let newValue: number = Math.round(valueFraction * totalSteps) * this.stepSize;

        this._value = this.mathExtensions.clamp(newValue, 0, this.maximum);
        this.valueChange.emit(this._value);
    }
}
