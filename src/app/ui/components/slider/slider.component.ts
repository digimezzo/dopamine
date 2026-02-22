import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Logger } from '../../../common/logger';
import { MathExtensions } from '../../../common/math-extensions';
import { NativeElementProxy } from '../../../common/native-element-proxy';

@Component({
    selector: 'app-slider',
    host: { style: 'display: block' },
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SliderComponent implements AfterViewInit {
    private _value: number = 0;
    private sliderThumbWidth: number = 12;
    private mouseIsOverSlider = false;

    public constructor(
        private nativeElementProxy: NativeElementProxy,
        private mathExtensions: MathExtensions,
        private logger: Logger,
    ) {}

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
        this.applyPositionFromValue(v);
    }

    @Output()
    public valueChange: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild('sliderTrack')
    public sliderTrack!: ElementRef;

    public showSliderThumb: boolean = false;
    private isSliderThumbMovable: boolean = false;

    public sliderBarPosition: number = 0;
    public sliderThumbPosition: number = 0;

    public ngAfterViewInit(): void {
        // Prevent ExpressionChangedAfterItHasBeenCheckedError in DEV mode
        setTimeout(() => {
            this.applyPositionFromValue(this.value);
        }, 0);
    }

    // --------------------------------------------------
    // ✅ Window Resize Fix
    // --------------------------------------------------

    @HostListener('window:resize')
    public onWindowResize(): void {
        this.recalculateFromCurrentValue();
    }

    private recalculateFromCurrentValue(): void {
        if (!this.sliderTrack) {
            return;
        }

        this.applyPositionFromValue(this._value);
    }

    // --------------------------------------------------
    // Interaction
    // --------------------------------------------------

    public onSliderThumbMouseDown(): void {
        this.isSliderThumbMovable = true;
    }

    public onSliderContainerMouseEnter(): void {
        this.mouseIsOverSlider = true;
        this.showSliderThumb = true;
    }

    public onSliderContainerMouseLeave(): void {
        this.mouseIsOverSlider = false;

        if (!this.isSliderThumbMovable) {
            this.showSliderThumb = false;
        }
    }

    public onSliderContainerMouseDown(e: MouseEvent): void {
        this.isSliderThumbMovable = true;
        this.applyPositionAndValue(this.getMouseXPositionRelativeToSlider(e.clientX));
    }

    @HostListener('document:mousedown', ['$event'])
    public onDocumentMouseDown(e: MouseEvent): void {
        if (this.mouseIsOverSlider) {
            e.preventDefault();
        }
    }

    @HostListener('document:mouseup')
    public onDocumentMouseUp(): void {
        this.isSliderThumbMovable = false;
    }

    @HostListener('document:touchend')
    public onDocumentTouchEnd(): void {
        this.isSliderThumbMovable = false;
    }

    @HostListener('document:mousemove', ['$event'])
    public onDocumentMouseMove(e: MouseEvent): void {
        if (this.isSliderThumbMovable) {
            this.applyPositionAndValue(this.getMouseXPositionRelativeToSlider(e.clientX));
        }
    }

    @HostListener('document:touchmove', ['$event'])
    public onDocumentTouchMove(e: TouchEvent): void {
        if (this.isSliderThumbMovable) {
            const touch: Touch = e.touches[0] !== undefined ? e.touches[0] : e.changedTouches[0];

            this.applyPositionAndValue(this.getMouseXPositionRelativeToSlider(touch.pageX));
        }
    }

    public onSliderContainerMouseWheel(event: WheelEvent): void {
        const mouseStepConvertedToSliderScale: number = this.getMouseStepConvertedToSliderScale();

        let newPosition: number = this.sliderBarPosition + mouseStepConvertedToSliderScale;

        if (event.deltaY > 0) {
            newPosition = this.sliderBarPosition - mouseStepConvertedToSliderScale;
        }

        this.applyPositionAndValue(newPosition);
    }

    // --------------------------------------------------
    // Calculations
    // --------------------------------------------------

    private getMouseStepConvertedToSliderScale(): number {
        const sliderWidth: number = this.nativeElementProxy.getElementWidth(this.sliderTrack);

        return (this.mouseStepSize / this.maximum) * sliderWidth;
    }

    private getMouseXPositionRelativeToSlider(clientX: number): number {
        const rect: DOMRect | undefined = this.nativeElementProxy.getBoundingRectangle(this.sliderTrack);

        if (!rect) {
            return 0;
        }

        return clientX - rect.left;
    }

    private applyPosition(position: number): void {
        const sliderWidth: number = this.nativeElementProxy.getElementWidth(this.sliderTrack);

        this.sliderBarPosition = this.mathExtensions.clamp(position, 0, sliderWidth);

        this.sliderThumbPosition = this.mathExtensions.clamp(
            position - this.sliderThumbWidth / 2,
            this.sliderThumbMargin - this.sliderThumbWidth / 2,
            sliderWidth - this.sliderThumbMargin - this.sliderThumbWidth / 2,
        );
    }

    private applyValue(): void {
        const sliderWidth: number = this.nativeElementProxy.getElementWidth(this.sliderTrack);

        if (sliderWidth === 0) {
            return;
        }

        const valueFraction: number = this.sliderBarPosition / sliderWidth;

        const totalSteps: number = this.maximum / this.stepSize;

        const newValue: number = Math.round(valueFraction * totalSteps) * this.stepSize;

        this._value = this.mathExtensions.clamp(newValue, 0, this.maximum);

        this.valueChange.emit(this._value);
    }

    private applyPositionAndValue(position: number): void {
        try {
            this.applyPosition(position);
            this.applyValue();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not apply position', 'SliderComponent', 'applyPosition');
        }
    }

    private applyPositionFromValue(value: number): void {
        try {
            const sliderWidth: number = this.nativeElementProxy.getElementWidth(this.sliderTrack);

            if (sliderWidth === 0) {
                return;
            }

            let position = 0;

            if (this.maximum > 0) {
                position = (value / this.maximum) * sliderWidth;
            }

            this.applyPosition(position);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not apply position from value', 'SliderComponent', 'applyPositionFromValue');
        }
    }
}
