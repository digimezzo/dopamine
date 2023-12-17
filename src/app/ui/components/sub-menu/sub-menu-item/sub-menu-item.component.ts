import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-sub-menu-item',
    host: { style: 'display: block' },
    templateUrl: './sub-menu-item.component.html',
    styleUrls: ['./sub-menu-item.component.scss'],
})
export class SubMenuItemComponent {
    @Input()
    public page: number;

    @Input()
    public selectedPage: number;
}
