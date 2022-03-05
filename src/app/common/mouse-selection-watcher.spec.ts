import { MouseSelectionWatcher } from './mouse-selection-watcher';

describe('MouseSelectionWatcher', () => {
    describe('initialize', () => {
        it('should return no selected items if selectFirstItem is false', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const items: any[] = [item1, item2];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();

            // Act
            mouseSelectionWatcher.initialize(items, false);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(0);
        });

        it('should return the first item as selected item if selectFirstItem is true', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const items: any[] = [item1, item2];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();

            // Act
            mouseSelectionWatcher.initialize(items, true);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(1);
            expect(mouseSelectionWatcher.selectedItems[0]).toBe(item1);
        });

        it('should not throw an error if items is undefined', () => {
            // Arrange
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();

            // Act

            // Assert
            expect(() => mouseSelectionWatcher.initialize(undefined, true)).not.toThrow();
        });
    });

    describe('setSelectedItems', () => {
        it('should not throw an error if event is undefined', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();

            // Act

            // Assert
            expect(() => mouseSelectionWatcher.setSelectedItems(undefined, item1)).not.toThrow();
        });

        it('should not throw an error if item is undefined', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = { button: 0 };

            // Act

            // Assert
            expect(() => mouseSelectionWatcher.setSelectedItems(event, undefined)).not.toThrow();
        });

        it('should remove the given item from the selection if ctrl is pressed', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const items: any[] = [item1, item2, item3];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = { button: 0 };
            const ctrlEvent: any = { ctrlKey: {} };

            mouseSelectionWatcher.initialize(items, false);
            mouseSelectionWatcher.setSelectedItems(event, item2);

            // Act
            mouseSelectionWatcher.setSelectedItems(ctrlEvent, item2);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(0);
        });

        it('should add the given item to the selection if ctrl is pressed', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const items: any[] = [item1, item2, item3];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = { button: 0 };
            const ctrlEvent: any = { ctrlKey: {} };

            mouseSelectionWatcher.initialize(items, false);
            mouseSelectionWatcher.setSelectedItems(event, item2);

            // Act
            mouseSelectionWatcher.setSelectedItems(ctrlEvent, item3);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(2);
            expect(mouseSelectionWatcher.selectedItems[0]).toBe(item2);
            expect(mouseSelectionWatcher.selectedItems[1]).toBe(item3);
        });

        it('should select an item range if shift is pressed', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const items: any[] = [item1, item2, item3];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = { button: 0 };
            const shiftEvent: any = { shiftKey: {} };

            mouseSelectionWatcher.initialize(items, false);
            mouseSelectionWatcher.setSelectedItems(event, item1);

            // Act
            mouseSelectionWatcher.setSelectedItems(shiftEvent, item3);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(3);
            expect(mouseSelectionWatcher.selectedItems[0]).toBe(item1);
            expect(mouseSelectionWatcher.selectedItems[1]).toBe(item2);
            expect(mouseSelectionWatcher.selectedItems[2]).toBe(item3);
        });

        it('should not change the selection if no modifier keys are pressed, a non-left mouse button is pressed and multiple items are selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = { button: 1 };
            const shiftEvent: any = { shiftKey: {} };

            mouseSelectionWatcher.initialize(items, false);
            mouseSelectionWatcher.setSelectedItems(shiftEvent, item1);
            mouseSelectionWatcher.setSelectedItems(shiftEvent, item3);

            // Act
            mouseSelectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(3);
            expect(mouseSelectionWatcher.selectedItems[0]).toBe(item1);
            expect(mouseSelectionWatcher.selectedItems[1]).toBe(item2);
            expect(mouseSelectionWatcher.selectedItems[2]).toBe(item3);
        });

        it('should select only the given item if no modifier keys are pressed, the left mouse button is pressed and multiple items are selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = { button: 0 };
            const shiftEvent: any = { shiftKey: {} };

            mouseSelectionWatcher.initialize(items, false);
            mouseSelectionWatcher.setSelectedItems(shiftEvent, item1);
            mouseSelectionWatcher.setSelectedItems(shiftEvent, item3);

            // Act
            mouseSelectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(1);
            expect(mouseSelectionWatcher.selectedItems[0]).toBe(item3);
        });

        it('should select only the given item if no modifier keys are pressed, the left mouse button is pressed and 1 item is selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = { button: 0 };
            const shiftEvent: any = { shiftKey: {} };

            mouseSelectionWatcher.initialize(items, false);
            mouseSelectionWatcher.setSelectedItems(shiftEvent, item1);

            // Act
            mouseSelectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(1);
            expect(mouseSelectionWatcher.selectedItems[0]).toBe(item3);
        });

        it('should select only the given item if no modifier keys are pressed, the left mouse button is pressed and no item is selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = { button: 0 };
            const shiftEvent: any = { shiftKey: {} };

            mouseSelectionWatcher.initialize(items, false);

            // Act
            mouseSelectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(1);
            expect(mouseSelectionWatcher.selectedItems[0]).toBe(item3);
        });

        it('should select only the given item if no modifier keys are pressed, a non-left mouse button is pressed and 1 item is selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = { button: 1 };
            const shiftEvent: any = { shiftKey: {} };

            mouseSelectionWatcher.initialize(items, false);
            mouseSelectionWatcher.setSelectedItems(shiftEvent, item1);

            // Act
            mouseSelectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(1);
            expect(mouseSelectionWatcher.selectedItems[0]).toBe(item3);
        });

        it('should select only the given item if no modifier keys are pressed, a non-left mouse button is pressed and no item is selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = { button: 1 };
            const shiftEvent: any = { shiftKey: {} };

            mouseSelectionWatcher.initialize(items, false);

            // Act
            mouseSelectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(1);
            expect(mouseSelectionWatcher.selectedItems[0]).toBe(item3);
        });
    });
});
