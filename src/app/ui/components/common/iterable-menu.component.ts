import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-iterable-menu',
    templateUrl: './iterable-menu.component.html',
    styleUrls: ['./iterable-menu.component.css'],
})
export class IterableMenuComponent<T> {
    @Input() public tooltipKey!: string;
    @Input() public currentItem!: T;
    @Input() public items: T[] = [];
    @Input() public itemKeyFn!: (item: T) => string;
    @Input() public applyItemFn!: (item: T) => void;
}
