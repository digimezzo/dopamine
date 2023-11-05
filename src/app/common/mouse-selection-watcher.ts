import { Injectable } from '@angular/core';
import { ISelectable } from '../ui/interfaces/i-selectable';

@Injectable()
export class MouseSelectionWatcher {
    private items: ISelectable[] = [];
    private lastSelectedItem: ISelectable;

    public get selectedItems(): ISelectable[] {
        return this.items.filter((x) => x.isSelected);
    }

    public initialize(items: ISelectable[] | undefined, selectFirstItem: boolean = false): void {
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

    public setSelectedItems(event: MouseEvent | undefined, item: ISelectable | undefined): void {
        if (event == undefined) {
            return;
        }

        if (item == undefined) {
            return;
        }

        if (event != undefined && event.ctrlKey) {
            // CTRL is pressed: add item to, or remove item from selection
            this.toggleItemSelection(item);
        } else if (event != undefined && event.shiftKey) {
            // SHIFT is pressed: select a range of items
            this.selectItemsRange(item);
        } else {
            if (event.button !== 0 && this.selectedItems.length > 1) {
                return;
            }

            this.selectSingleItem(item);
        }
    }

    private toggleItemSelection(item: ISelectable): void {
        item.isSelected = !item.isSelected;

        if (item.isSelected) {
            this.lastSelectedItem = item;
        }
    }

    private selectItemsRange(item: ISelectable): void {
        const currentItemIndex: number = this.items.indexOf(item);
        let lastSelectedItemIndex: number = this.items.indexOf(item);

        if (this.lastSelectedItem != undefined) {
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

    private selectSingleItem(item: ISelectable): void {
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
