import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-dialog-header',
    templateUrl: './dialog-header.component.html',
    styleUrls: ['./dialog-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class DialogHeaderComponent {
    @Input() public icon: string;
    @Input() public title: string;
}
