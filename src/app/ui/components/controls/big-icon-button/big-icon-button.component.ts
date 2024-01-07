import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-big-icon-button',
    templateUrl: './big-icon-button.component.html',
    styleUrls: ['./big-icon-button.component.scss'],
})
export class BigIconButtonComponent {
    @Input() public icon: string;
}
