import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class NativeElementProxy {
    constructor() {}

    public getElementWidth(element: ElementRef): number {
        if (element == undefined) {
            return 0;
        }

        if (element.nativeElement == undefined) {
            return 0;
        }
        if (element.nativeElement.offsetWidth == undefined) {
            return 0;
        }

        return element.nativeElement.offsetWidth;
    }
}
