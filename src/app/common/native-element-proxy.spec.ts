import { ElementRef } from '@angular/core';
import { NativeElementProxy } from './native-element-proxy';

describe('NativeElementProxy', () => {
    describe('getElementWidth', () => {
        it('should return 0 if element is undefined', () => {
            // Arrange
            const nativeElementProxy: NativeElementProxy = new NativeElementProxy();
            const element: ElementRef = undefined;

            // Act
            const elementWidth: number = nativeElementProxy.getElementWidth(element);

            // Assert
            expect(elementWidth).toEqual(0);
        });

        it('should return 0 if element.nativeElement is undefined', () => {
            // Arrange
            const nativeElementProxy: NativeElementProxy = new NativeElementProxy();
            const element: any = {};

            // Act
            const elementWidth: number = nativeElementProxy.getElementWidth(element);

            // Assert
            expect(elementWidth).toEqual(0);
        });

        it('should return 0 if element.nativeElement.offsetWidth is undefined', () => {
            // Arrange
            const nativeElementProxy: NativeElementProxy = new NativeElementProxy();
            const element: ElementRef = { nativeElement: {} };

            // Act
            const elementWidth: number = nativeElementProxy.getElementWidth(element);

            // Assert
            expect(elementWidth).toEqual(0);
        });

        it('should return 50 if element.nativeElement.offsetWidth is 50', () => {
            // Arrange
            const nativeElementProxy: NativeElementProxy = new NativeElementProxy();
            const element: ElementRef = { nativeElement: { offsetWidth: 50 } };

            // Act
            const elementWidth: number = nativeElementProxy.getElementWidth(element);

            // Assert
            expect(elementWidth).toEqual(50);
        });
    });
});
