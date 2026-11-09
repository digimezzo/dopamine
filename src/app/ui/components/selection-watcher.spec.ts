import { SelectionWatcher } from './selection-watcher';

describe('SelectionWatcher', () => {
    describe('initialize', () => {
        it('should return no selected items if selectFirstItem is false', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const items: any[] = [item1, item2];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();

            // Act
            selectionWatcher.initialize(items, false);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(0);
        });

        it('should return the first item as selected item if selectFirstItem is true', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const items: any[] = [item1, item2];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();

            // Act
            selectionWatcher.initialize(items, true);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(1);
            expect(selectionWatcher.selectedItems[0]).toBe(item1);
        });

        it('should not throw an error if items is undefined', () => {
            // Arrange
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();

            // Act

            // Assert
            expect(() => selectionWatcher.initialize(undefined, true)).not.toThrow();
        });
    });

    describe('setSelectedItems', () => {
        it('should not throw an error if event is undefined', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();

            // Act

            // Assert
            expect(() => selectionWatcher.setSelectedItems(undefined, item1)).not.toThrow();
        });

        it('should not throw an error if item is undefined', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();
            const event: any = { button: 0 };

            // Act

            // Assert
            expect(() => selectionWatcher.setSelectedItems(event, undefined)).not.toThrow();
        });

        it('should remove the given item from the selection if ctrl is pressed', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const items: any[] = [item1, item2, item3];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();
            const event: any = { button: 0 };
            const ctrlEvent: any = { ctrlKey: {} };

            selectionWatcher.initialize(items, false);
            selectionWatcher.setSelectedItems(event, item2);

            // Act
            selectionWatcher.setSelectedItems(ctrlEvent, item2);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(0);
        });

        it('should add the given item to the selection if ctrl is pressed', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const items: any[] = [item1, item2, item3];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();
            const event: any = { button: 0 };
            const ctrlEvent: any = { ctrlKey: {} };

            selectionWatcher.initialize(items, false);
            selectionWatcher.setSelectedItems(event, item2);

            // Act
            selectionWatcher.setSelectedItems(ctrlEvent, item3);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(2);
            expect(selectionWatcher.selectedItems[0]).toBe(item2);
            expect(selectionWatcher.selectedItems[1]).toBe(item3);
        });

        it('should select an item range if shift is pressed', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const items: any[] = [item1, item2, item3];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();
            const event: any = { button: 0 };
            const shiftEvent: any = { shiftKey: {} };

            selectionWatcher.initialize(items, false);
            selectionWatcher.setSelectedItems(event, item1);

            // Act
            selectionWatcher.setSelectedItems(shiftEvent, item3);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(3);
            expect(selectionWatcher.selectedItems[0]).toBe(item1);
            expect(selectionWatcher.selectedItems[1]).toBe(item2);
            expect(selectionWatcher.selectedItems[2]).toBe(item3);
        });

        it('should not change the selection if no modifier keys are pressed, a non-left mouse button is pressed and multiple items are selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();
            const event: any = { button: 1 };
            const shiftEvent: any = { shiftKey: {} };

            selectionWatcher.initialize(items, false);
            selectionWatcher.setSelectedItems(shiftEvent, item1);
            selectionWatcher.setSelectedItems(shiftEvent, item3);

            // Act
            selectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(3);
            expect(selectionWatcher.selectedItems[0]).toBe(item1);
            expect(selectionWatcher.selectedItems[1]).toBe(item2);
            expect(selectionWatcher.selectedItems[2]).toBe(item3);
        });

        it('should select only the given item if no modifier keys are pressed, the left mouse button is pressed and multiple items are selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();
            const event: any = { button: 0 };
            const shiftEvent: any = { shiftKey: {} };

            selectionWatcher.initialize(items, false);
            selectionWatcher.setSelectedItems(shiftEvent, item1);
            selectionWatcher.setSelectedItems(shiftEvent, item3);

            // Act
            selectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(1);
            expect(selectionWatcher.selectedItems[0]).toBe(item3);
        });

        it('should select only the given item if no modifier keys are pressed, the left mouse button is pressed and 1 item is selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();
            const event: any = { button: 0 };
            const shiftEvent: any = { shiftKey: {} };

            selectionWatcher.initialize(items, false);
            selectionWatcher.setSelectedItems(shiftEvent, item1);

            // Act
            selectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(1);
            expect(selectionWatcher.selectedItems[0]).toBe(item3);
        });

        it('should select only the given item if no modifier keys are pressed, the left mouse button is pressed and no item is selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();
            const event: any = { button: 0 };
            const shiftEvent: any = { shiftKey: {} };

            selectionWatcher.initialize(items, false);

            // Act
            selectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(1);
            expect(selectionWatcher.selectedItems[0]).toBe(item3);
        });

        it('should select only the given item if no modifier keys are pressed, a non-left mouse button is pressed and 1 item is selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();
            const event: any = { button: 1 };
            const shiftEvent: any = { shiftKey: {} };

            selectionWatcher.initialize(items, false);
            selectionWatcher.setSelectedItems(shiftEvent, item1);

            // Act
            selectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(1);
            expect(selectionWatcher.selectedItems[0]).toBe(item3);
        });

        it('should select only the given item if no modifier keys are pressed, a non-left mouse button is pressed and no item is selected.', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const selectionWatcher: SelectionWatcher = new SelectionWatcher();
            const event: any = { button: 1 };
            const shiftEvent: any = { shiftKey: {} };

            selectionWatcher.initialize(items, false);

            // Act
            selectionWatcher.setSelectedItems(event, item3);

            // Assert
            expect(selectionWatcher.selectedItems.length).toEqual(1);
            expect(selectionWatcher.selectedItems[0]).toBe(item3);
        });
    });
});
