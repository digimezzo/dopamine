import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class NativeElementProxy {
    public getElementWidth(element: ElementRef<HTMLElement> | undefined): number {
        if (element == undefined) {
            return 0;
        }

        if (element.nativeElement == undefined) {
            return 0;
        }

        // if (!(element.nativeElement instanceof HTMLElement)) {
        //     return 0;
        // }

        const htmlElement: HTMLElement = element.nativeElement;

        if (htmlElement.offsetWidth == undefined) {
            return 0;
        }

        return htmlElement.offsetWidth;
    }

    public getBoundingRectangle(element: ElementRef | undefined): DOMRect | undefined {
        if (element == undefined) {
            return undefined;
        }

        if (element.nativeElement == undefined) {
            return undefined;
        }

        if (!(element.nativeElement instanceof HTMLElement)) {
            return undefined;
        }

        const htmlElement: HTMLElement = element.nativeElement;

        return htmlElement.getBoundingClientRect();
    }
}
