import { MetroPageComponent } from './metro-page.component';
import { IMock, Mock } from 'typemoq';
import { ElementRef, Renderer2 } from '@angular/core';

describe('MetroPageComponent', () => {
    let renderer2Mock: IMock<Renderer2>;
    let elementRefMock: IMock<ElementRef>;

    beforeEach(() => {
        renderer2Mock = Mock.ofType<Renderer2>();
        elementRefMock = Mock.ofType<ElementRef>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: MetroPageComponent = new MetroPageComponent(renderer2Mock.object, elementRefMock.object);

            // Assert
            expect(component).toBeDefined();
        });
    });
});
