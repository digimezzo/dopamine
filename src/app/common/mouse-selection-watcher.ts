import { Injectable } from '@angular/core';

@Injectable()
export class MouseSelectionWatcher {
    constructor() {}

    private items: any[] = [];
    private lastSelectedItem: any;

    public get selectedItems(): any[] {
        return this.items.filter((x) => x.isSelected);
    }

    public initialize(items: any[], selectFirstItem: boolean = false): void {
        if (items == undefined) {
            return;
        }

        this.items = items;

        if (this.items.length > 0) {
            this.items.forEach((x) => (x.isSelected = false));

            if (selectFirstItem) {
                this.items[0].isSelected = true;
            }
        }
    }

    public setSelectedItems(event: any, item: any): void {
        if (event == undefined) {
            return;
        }

        if (item == undefined) {
            return;
        }

        if (event && event.ctrlKey) {
            // CTRL is pressed: add item to, or remove item from selection
            this.toggleItemSelection(item);
        } else if (event && event.shiftKey) {
            // SHIFT is pressed: select a range of items
            this.selectItemsRange(item);
        } else {
            if (event.button !== 0 && this.selectedItems.length > 1) {
                return;
            }

            this.selectSingleItem(item);
        }
    }

    private toggleItemSelection(item: any): void {
        item.isSelected = !item.isSelected;

        if (item.isSelected) {
            this.lastSelectedItem = item;
        }
    }

    private selectItemsRange(item: any): void {
        const currentItemIndex: number = this.items.indexOf(item);
        let lastSelectedItemIndex: number = this.items.indexOf(item);

        if (this.lastSelectedItem) {
            lastSelectedItemIndex = this.items.indexOf(this.lastSelectedItem);
        }

        let lowIndex: number = currentItemIndex;
        let highIndex: number = lastSelectedItemIndex;

        if (currentItemIndex > lastSelectedItemIndex) {
            lowIndex = lastSelectedItemIndex;
            highIndex = currentItemIndex;
        }

        for (let i = 0; i < this.items.length; i++) {
            if (lowIndex <= i && i <= highIndex) {
                this.items[i].isSelected = true;
                this.lastSelectedItem = item;
            }
        }
    }

    private selectSingleItem(item: any): void {
        const currentItemIndex: number = this.items.indexOf(item);

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].isSelected = false;

            if (i === currentItemIndex) {
                this.items[i].isSelected = true;
                this.lastSelectedItem = item;
            }
        }
    }
}
