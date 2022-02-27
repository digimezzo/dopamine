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
            const event: any = {};

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
            const event: any = {};
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
            const event: any = {};
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
            const event: any = {};
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

        it('should select only the given item if ctrl and shift are not pressed and the given item is not yet selected', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = {};
            const ctrlEvent: any = { ctrlKey: {} };

            mouseSelectionWatcher.initialize(items, false);
            mouseSelectionWatcher.setSelectedItems(ctrlEvent, item1);
            mouseSelectionWatcher.setSelectedItems(ctrlEvent, item3);

            // Act
            mouseSelectionWatcher.setSelectedItems(event, item4);

            // Assert
            expect(mouseSelectionWatcher.selectedItems.length).toEqual(1);
            expect(mouseSelectionWatcher.selectedItems[0]).toBe(item4);
        });

        it('should not change the selection if ctrl and shift are not pressed and the given item is already selected', () => {
            // Arrange
            const item1: any = { isSelected: false };
            const item2: any = { isSelected: false };
            const item3: any = { isSelected: false };
            const item4: any = { isSelected: false };
            const items: any[] = [item1, item2, item3, item4];
            const mouseSelectionWatcher: MouseSelectionWatcher = new MouseSelectionWatcher();
            const event: any = {};
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
    });
});
