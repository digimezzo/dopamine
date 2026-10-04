import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';

@Component({
    selector: 'app-cover-size-control',
    host: { style: 'display: block' },
    templateUrl: './cover-size-control.component.html',
    styleUrls: ['./cover-size-control.component.scss'],
})
export class CoverSizeControlComponent {
    public readonly minimumSize: number = 80;
    public readonly maximumSize: number = 240;
    public readonly sizeStep: number = 10;
    public readonly popupPositions: ConnectedPosition[] = [{ originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 }];
    public isPopupOpen: boolean = false;

    @Input()
    public titleKey: string = '';

    @Input()
    public size: number = 130;

    @Output()
    public sizeChange: EventEmitter<number> = new EventEmitter<number>();

    public get sliderValue(): number {
        return this.size - this.minimumSize;
    }

    public set sliderValue(v: number) {
        const newSize: number = v + this.minimumSize;

        if (newSize === this.size) {
            return;
        }

        this.size = newSize;
        this.sizeChange.emit(newSize);
    }

    public togglePopup(): void {
        this.isPopupOpen = !this.isPopupOpen;
    }

    public closePopup(): void {
        this.isPopupOpen = false;
    }
}
