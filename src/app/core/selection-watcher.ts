import { Injectable } from '@angular/core';

@Injectable()
export class SelectionWatcher {
    constructor() {}

    private items: any[];
    private lastSelectedItem: any;

    public get hasItems(): boolean {
        return this.items != null;
    }

    public get selectedItemsCount(): number {
        if (!this.hasItems) {
            return 0;
        }

        return this.items.filter((x) => x.isSelected).length;
    }

    public get selectedItems(): any[] {
        if (!this.hasItems) {
            return [];
        }

        return this.items.filter((x) => x.isSelected);
    }

    public reset(items: any[], selectFirstItem: boolean = false): void {
        this.items = items;

        if (this.items.length > 0) {
            this.items.forEach((x) => (x.isSelected = false));

            if (selectFirstItem) {
                this.items[0].isSelected = true;
            }
        }
    }

    public selectItemsRange(item: any): void {
        if (!this.hasItems) {
            return;
        }

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

    public selectSingleItem(item: any): void {
        if (!this.hasItems) {
            return;
        }

        const currentItemIndex: number = this.items.indexOf(item);

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].isSelected = false;

            if (i === currentItemIndex) {
                this.items[i].isSelected = true;
                this.lastSelectedItem = item;
            }
        }
    }

    public toggleItemSelection(item: any): void {
        if (!this.hasItems) {
            return;
        }

        item.isSelected = !item.isSelected;

        if (item.isSelected) {
            this.lastSelectedItem = item;
        }
    }
}
