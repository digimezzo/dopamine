import { CoverSizeControlComponent } from './cover-size-control.component';

describe('CoverSizeControlComponent', () => {
    it('should expose the size as a slider offset from the minimum size', () => {
        // Arrange
        const component: CoverSizeControlComponent = new CoverSizeControlComponent();
        component.size = 130;

        // Act, Assert
        expect(component.sliderValue).toEqual(50);
    });

    it('should emit the new size when the slider changes', () => {
        // Arrange
        const component: CoverSizeControlComponent = new CoverSizeControlComponent();
        component.size = 130;
        let emittedSize: number | undefined;
        component.sizeChange.subscribe((size: number) => (emittedSize = size));

        // Act
        component.sliderValue = 100;

        // Assert
        expect(component.size).toEqual(180);
        expect(emittedSize).toEqual(180);
    });

    it('should not emit when the size did not change', () => {
        // Arrange
        const component: CoverSizeControlComponent = new CoverSizeControlComponent();
        component.size = 130;
        let emitCount: number = 0;
        component.sizeChange.subscribe(() => emitCount++);

        // Act
        component.sliderValue = 50;

        // Assert
        expect(emitCount).toEqual(0);
    });

    it('should open and close the popup', () => {
        // Arrange
        const component: CoverSizeControlComponent = new CoverSizeControlComponent();

        // Act
        component.togglePopup();
        const isOpenAfterToggle: boolean = component.isPopupOpen;
        component.closePopup();

        // Assert
        expect(isOpenAfterToggle).toBeTruthy();
        expect(component.isPopupOpen).toBeFalsy();
    });
});
